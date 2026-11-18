(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    // Header line once the page scrolls
    var top = document.querySelector('.top');
    function onScroll() { top.classList.toggle('is-scrolled', window.scrollY > 8); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Deal cards in as they come into view
    var slots = document.querySelectorAll('.card-slot');
    if (reduceMotion || !('IntersectionObserver' in window)) {
        slots.forEach(function (s) { s.classList.add('is-dealt'); });
    } else {
        var dealer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var slot = entry.target;
                slot.classList.add('is-dealt');
                dealer.unobserve(slot);
                if (slot.classList.contains('hero-slot')) {
                    var card = slot.querySelector('.card');
                    setTimeout(function () { card.classList.add('is-shining'); }, 900);
                    setTimeout(function () { card.classList.remove('is-shining'); }, 2300);
                }
            });
        }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });
        slots.forEach(function (s) { dealer.observe(s); });
    }

    // Count stats up from zero when a card back is shown
    function countUp(el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        if (reduceMotion || isNaN(target)) { el.textContent = target; return; }
        var start = null;
        function step(ts) {
            if (start === null) start = ts;
            var t = Math.min(1, (ts - start) / 900);
            var eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(target * eased);
            if (t < 1) requestAnimationFrame(step);
        }
        el.textContent = '0';
        requestAnimationFrame(step);
    }

    // Flip
    function setFlipped(slot, flipped) {
        var card = slot.querySelector('.card');
        var front = card.querySelector('.card-front');
        var back = card.querySelector('.card-back');
        var btn = slot.querySelector('.flip-btn');

        card.classList.toggle('is-flipped', flipped);
        front.inert = flipped;
        back.inert = !flipped;
        btn.setAttribute('aria-pressed', String(flipped));
        btn.textContent = flipped ? btn.getAttribute('data-back') : btn.getAttribute('data-front');
        if (btn.hasAttribute('aria-label')) {
            var label = btn.getAttribute('aria-label').replace(/^(Show stats for|Show front of) /, '');
            btn.setAttribute('aria-label', (flipped ? 'Show front of ' : 'Show stats for ') + label);
        }
        if (flipped) back.querySelectorAll('[data-count]').forEach(countUp);
    }

    slots.forEach(function (slot) {
        var card = slot.querySelector('.card');
        var btn = slot.querySelector('.flip-btn');

        btn.addEventListener('click', function () {
            setFlipped(slot, !card.classList.contains('is-flipped'));
        });

        // Clicking the card itself flips it, unless the click was on a link or button
        card.addEventListener('click', function (e) {
            if (e.target.closest('a, button, code')) return;
            setFlipped(slot, !card.classList.contains('is-flipped'));
        });

        // Tilt toward the pointer and move the foil highlight
        if (finePointer && !reduceMotion) {
            card.addEventListener('pointermove', function (e) {
                var r = card.getBoundingClientRect();
                var px = (e.clientX - r.left) / r.width;
                var py = (e.clientY - r.top) / r.height;
                card.classList.add('is-tracking');
                card.style.setProperty('--ry', ((px - 0.5) * 20).toFixed(2) + 'deg');
                card.style.setProperty('--rx', ((0.5 - py) * 16).toFixed(2) + 'deg');
                card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
                card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
            });
            card.addEventListener('pointerleave', function () {
                card.classList.remove('is-tracking');
                card.style.setProperty('--rx', '0deg');
                card.style.setProperty('--ry', '0deg');
            });
        }
    });

    // Copy the install command. Falls back to a hidden textarea where the
    // Clipboard API is missing (file:// pages, plain http) or refuses.
    function legacyCopy(text) {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.top = '0';
        ta.style.left = '0';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, text.length);
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
        document.body.removeChild(ta);
        return ok;
    }

    function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text).catch(function () {
                if (!legacyCopy(text)) throw new Error('copy failed');
            });
        }
        return legacyCopy(text) ? Promise.resolve() : Promise.reject(new Error('copy failed'));
    }

    document.querySelectorAll('.copy-btn').forEach(function (btn) {
        var timer = null;
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var source = document.querySelector(btn.getAttribute('data-copy'));
            if (!source) return;
            copyText(source.textContent.trim()).then(function () {
                btn.textContent = 'Copied';
            }, function () {
                // Last resort: select the command so the visitor can copy it by hand
                var range = document.createRange();
                range.selectNodeContents(source);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                btn.textContent = 'Press \u2318C';
            });
            clearTimeout(timer);
            timer = setTimeout(function () { btn.textContent = 'Copy'; }, 1800);
        });
    });
})();
