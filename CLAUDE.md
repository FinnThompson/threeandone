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
- **`js/main.js`** — All interactivity in a single IIFE. Handles: mobile nav toggle, sticky navbar scroll state, active nav highlighting via IntersectionObserver, scroll-triggered fade-in animations, gallery lightbox with keyboard nav, booking form submission (Web3Forms API), show date filtering (hides past shows), Google Calendar link generation for shows, and a list/calendar view toggle for shows.
- **`images/`** — Band assets: headshot JPGs in `images/headshots/`, decorative PNGs (guitar, drums, beachball, umbrella, headphones) used as hero decorations.

## Key Patterns

- **Shows are data-driven from HTML**: Each show is a `.show-card[data-date]` element. JS reads `data-date` attributes to hide past shows, build calendar view, and generate "Add to Calendar" links. To add/remove shows, edit the HTML in the shows section.
- **Booking form** uses [Web3Forms](https://web3forms.com/) — the access key is in a hidden input in the form. Submission is handled via `fetch` in JS.
- **Scroll animations** use the `.fade-in` class pattern — elements start hidden and get `.visible` added by IntersectionObserver. Staggered delays via `.fade-in-delay-1`, `.fade-in-delay-2`, `.fade-in-delay-3`.
- **Hero section** has many inline SVG and PNG decorative elements (notes, stars, vinyl record, instruments) positioned absolutely with CSS animations.

## Placeholder Content

Several sections have placeholder content marked with `[ ]` brackets that should be replaced with real content:
- Band member bios (`[Bio coming soon.]`)
- Gallery photos (`[ Gallery Photo N ]`)
- Group photo in About section (`[ Group Photo ]`)
- Testimonial quotes and author names
