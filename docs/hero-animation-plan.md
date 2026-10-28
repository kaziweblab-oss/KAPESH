# Live Energy Flow Hero

## Goal

Add a premium, restrained renewable-energy motion layer to the existing KPESH
homepage hero without replacing its navigation, copy, calls to action, service
cards, brand colors, or optional admin-managed ImageKit video background.

## Existing implementation

- Framework: Next.js App Router with React 19 and TypeScript.
- Styling: Tailwind CSS v4 plus shared styles in `src/app/globals.css`.
- Motion dependency: `motion`, already used for content entrance effects.
- Homepage hero: `src/app/[locale]/page.tsx`.
- Optional uploaded video: `src/components/public/decorative-video-background.tsx`.
- Existing brand tokens: navy `#092a32`, secondary navy `#0c3940`, lime `#9bd64a`.
- No project-level `AGENTS.md` was found during inspection.

## Technical approach

- Preserve the current server-rendered hero markup and all of its content.
- Keep the existing dark teal gradient and introduce slow, layered CSS radial
  glows using the existing navy and lime brand tokens with a restrained teal
  highlight.
- Add one decorative, aria-hidden Canvas component with a layered bundle of
  fine, flowing teal ribbons, a softly glowing highlight, and a few restrained
  glints. Give each strand its own gently moving, randomized harmonic profile
  for natural, non-repeating waves inspired by the supplied visual reference.
  Cap rendering at about 30 FPS and device-pixel ratio at 1.5; do not add
  packages.
- Place the canvas behind the hero copy and service cards and above the optional
  video's contrast overlay; reuse it on the existing admin login background.
- Stop canvas animation for `prefers-reduced-motion` and render a static frame.
- Retain the current reduced-motion handling for the optional video and existing
  page animations.

## Accessibility

- Mark the canvas as hidden from assistive technology and ensure it cannot
  intercept pointer or keyboard interaction.
- Keep all text, links, focus states, and existing interactive content unchanged.
- Preserve the high-contrast dark overlay when a custom video is configured.
- Honor `prefers-reduced-motion` by disabling canvas and CSS ambient movement;
  do not add flashing or rapid changes.

## Performance

- Use a small Canvas and a single requestAnimationFrame loop capped at about 30
  FPS; pause while the tab is hidden and cancel all listeners/frames on cleanup.
- Cap the device-pixel ratio to 1.5 and use a restrained glint count. Draw paths
  with Canvas Bézier curves rather than dense per-frame point sampling.
- Keep the canvas pointer-transparent and positioned with existing Tailwind
  utilities behind content.
- Preserve the dark teal CSS background when no uploaded video is configured.

## Affected files

- `src/app/[locale]/page.tsx` — mount the decorative layer in the existing hero.
- `src/components/public/live-energy-background.tsx` — shared Canvas layer for
  the homepage hero and admin login.
- `src/components/admin/admin-login-form.tsx` — mount the shared Canvas on the
  existing login background.
- `src/app/globals.css` — existing atmosphere and reduced-motion styles.
- `docs/hero-animation-plan.md` — implementation and verification tracking.

## Verification checklist

- [x] Inspect the existing framework, dependencies, homepage hero, tokens, and
  responsive hero structure before implementation.
- [x] Preserve the homepage text, navigation, CTAs, and four service cards.
- [x] Check the visual effect at desktop and mobile widths.
- [x] Check `prefers-reduced-motion` leaves the hero static and readable.
- [x] Verify the homepage and login canvas layers are decorative, behind
  content, and do not intercept pointer interaction.
- [x] Check browser console and changed-file editor diagnostics.
- [x] Run lint, typecheck, and production build.
- [ ] Run automated tests; this project does not define a test script.

## Status

The shared Canvas has replaced the earlier SVG layer and is mounted on the
homepage, About hero, admin login, and mobile navigation drawer. Each ribbon now
uses a gently moving randomized harmonic profile, making the strands drift in
natural, non-repeating waves rather than follow one fixed curve. Browser
rendering on the homepage and changed-file editor diagnostics were checked for
this update. Earlier typecheck, lint, production build, and desktop/mobile checks
passed before the recent visual restyles. No automated test script is defined in
`package.json`.
