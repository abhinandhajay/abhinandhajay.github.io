# abhinandhajay.com

My personal site. Static HTML, CSS, and a little JavaScript, served by GitHub Pages.

The hero is a collectible card for me, and each project is a numbered card with brass frames on a deep green page. Cards deal in as they scroll into view, tilt toward the cursor with a foil shine, and flip over to show details and links. Everything holds still when the system asks for reduced motion.

Colors and fonts are CSS variables at the top of `assets/css/main.css`, so a new theme only means changing that block.

## Structure

```
index.html             The whole page
assets/css/main.css    Styles and animations
assets/js/main.js      Deal-in, tilt, flip, stat count-up, copy button, header line
assets/img/            Ada's avatar, prettydiff screenshot
favicon.svg / .ico     Small brass-framed card
apple-touch-icon.png
og-image.png           Social preview (1200 x 630)
CNAME                  Custom domain
```

## Run locally

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Adding a card

Copy one of the `.card-slot` blocks inside `.set` in `index.html`. Set `--frame` (the color of the rule under the title on the back) and `--art` (art background) on the `.card`, and bump `--i` on the slot so it deals in after the others. Put any number you want counted up on flip in `<span data-count="N">N</span>`.

## Type

Young Serif for headings and Hanken Grotesk for everything else, both from Google Fonts.
