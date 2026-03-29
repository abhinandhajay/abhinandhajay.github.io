// Liquid Glass Portfolio - Main JavaScript

(function() {
    'use strict';

    // ===================
    // Mobile Menu Toggle
    // ===================
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu when clicking a link
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ===================
    // Scroll Navigation
    // ===================
    const nav = document.getElementById('nav');

    function handleScroll() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run on load

    // ===================
    // Smooth Scrolling
    // ===================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Don't prevent default for just "#"
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();

                const offsetTop = target.offsetTop - 80; // Account for fixed nav

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===================
    // Intersection Observer for Animations
    // ===================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections and cards
    document.querySelectorAll('.section, .glass-card').forEach(el => {
        // Don't apply to hero elements (they have their own animations)
        if (!el.closest('.hero')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        }
    });

    // ===================
    // Pause Off-Screen Animations
    // ===================
    const animationObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            const animatedEls = entry.target.querySelectorAll(
                '.icon-ring, .floating-shape'
            );
            animatedEls.forEach(el => {
                el.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
            });
        });
    }, { threshold: 0 });

    // Observe the toolbox section
    const toolboxSection = document.querySelector('.toolbox');
    if (toolboxSection) {
        animationObserver.observe(toolboxSection);
    }

    // Pause hero visual float animation when off-screen
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        const heroObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                const floatingCard = entry.target.querySelector('.glass-card');
                if (floatingCard) {
                    floatingCard.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
                }
            });
        }, { threshold: 0 });
        heroObserver.observe(heroVisual);
    }

    // Pause blob animations when tab is hidden
    document.addEventListener('visibilitychange', function() {
        var blobs = document.querySelectorAll('.blob');
        blobs.forEach(function(blob) {
            blob.style.animationPlayState = document.hidden ? 'paused' : 'running';
        });
    });

    console.log('Liquid Glass Portfolio loaded successfully! 🌊');
})();
