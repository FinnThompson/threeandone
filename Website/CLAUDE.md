# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Website for **Three and One**, a 4-piece cover band based in the Jersey Shore & Philadelphia area. This is a static, single-page site with no build tools, bundler, or framework — just plain HTML, CSS, and vanilla JS.

## Development

Open `index.html` directly in a browser. No build step, no dev server required. To preview changes, refresh the browser.

## Architecture

- **`index.html`** — Single-page site. All content lives here as sections: Hero, About, Band Members, Music/Media, Setlist, Shows, Gallery, Testimonials, Contact/Booking, Footer. Sections are marked with `<!-- ==================== SECTION ==================== -->` comment blocks.
- **`css/reset.css`** — Minimal CSS reset (box-sizing, margins, font inheritance).
- **`css/styles.css`** — All styles. Uses CSS custom properties defined in `:root` for theming (teal background `#0197b2`, accent gradient yellow `#ffc63b` → pink `#ff65c3`). Fonts: Outfit (headings) and Inter (body) via Google Fonts. Glass-morphism card pattern with `backdrop-filter`.
- **`fans.html`** — The site's only second page: a masonry mosaic of photos taken with fans, reached from the "Fan Photos" button in the navbar and the footer Quick Links. Tiles are built by `js/fans.js` from a `fanMedia` array; media lives in `images/FanPhotos/`. One entry is a silent `.mp4` clip that plays on hover like a GIF (and autoplays on touch devices, which have no hover).
- **`js/fans.js`** — Interactivity for `fans.html` only. Separate from `main.js` because `main.js` reaches for index-only elements (booking form, shows calendar, gallery ribbon) and would throw on this page.
- **`js/newsletter.js`** — Mailing-list signup, loaded by both pages. Handles every `.newsletter-form` on the page, POSTing to the Kit form endpoint in each form's `action`. Kit sends `access-control-allow-origin: *`, so the cross-origin fetch succeeds and the result shows inline; a network/CORS failure falls back to a native form POST that lands on Kit's hosted confirmation page.
- **`js/main.js`** — All interactivity in a single IIFE. Handles: mobile nav toggle, sticky navbar scroll state, active nav highlighting via IntersectionObserver, scroll-triggered fade-in animations, gallery lightbox with keyboard nav, booking form submission (Web3Forms API), show date filtering (hides past shows), Google Calendar link generation for shows, and a list/calendar view toggle for shows.
- **`email/`** — Not part of the website. `three-and-one-template.html` is a custom HTML email template for Kit, using Kit's Liquid placeholders (`{{ message_content }}`, `{{ unsubscribe_url }}`, `{{ subscriber_preferences_url }}`, `{{ address }}`). It is table-based with inline styles because email clients do not support flexbox, grid, or CSS custom properties. `make-preview.py` fills the placeholders with sample copy and writes `preview.html` so the template can be checked in a browser; regenerate it after editing the template.
- **`images/`** — Band assets: headshot JPGs in `images/headshots/`, decorative PNGs (guitar, drums, beachball, umbrella, headphones) used as hero decorations.

## Media Normalization

Phone media has to be converted before it goes on the site. `sips` handles HEIC → JPG and resizing, but it leaves the EXIF orientation tag in place, so the stored pixels can be rotated relative to what the browser shows. Re-encode through `ffmpeg -map_metadata -1` (it auto-rotates on decode) to bake the rotation in and drop GPS/device metadata. Do not also pass a `transpose` filter, or the image is rotated twice. Convert `.MOV` clips with `ffmpeg -an ... -c:v libx264 -crf 28 -movflags +faststart`; `-an` strips the audio track outright rather than relying on the `muted` attribute.

## Key Patterns

- **Shows are data-driven from HTML**: Each show is a `.show-card[data-date]` element. JS reads `data-date` attributes to hide past shows, build calendar view, and generate "Add to Calendar" links. To add/remove shows, edit the HTML in the shows section.
- **Booking form** uses [Web3Forms](https://web3forms.com/) — the access key is in a hidden input in the form. Submission is handled via `fetch` in JS.
- **Mailing list** uses [Kit](https://kit.com/) (formerly ConvertKit), form ID `9953858`. Signup forms sit under the Shows section and in the footer of both pages. The markup is hand-written rather than Kit's embed, because Kit's HTML embed ships its own CSS and a `ck.5.js` script that would clash with the site's styling. Only the form `action` URL and the `email_address` field name matter. Kit's free plan asks for the "Built with Kit" attribution link, which is in a clearly-commented `<p class="newsletter-fineprint">` in each form.
- **Scroll animations** use the `.fade-in` class pattern — elements start hidden and get `.visible` added by IntersectionObserver. Staggered delays via `.fade-in-delay-1`, `.fade-in-delay-2`, `.fade-in-delay-3`.
- **Hero section** has many inline SVG and PNG decorative elements (notes, stars, vinyl record, instruments) positioned absolutely with CSS animations.

## Placeholder Content

Several sections have placeholder content marked with `[ ]` brackets that should be replaced with real content:
- Band member bios (`[Bio coming soon.]`)
- Gallery photos (`[ Gallery Photo N ]`)
- Group photo in About section (`[ Group Photo ]`)
- Testimonial quotes and author names
