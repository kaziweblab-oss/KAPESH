# KPESH Full-Stack Website - Project Plan

## 1. Project Goal

KPESH (Kashmiri Power Engineering Solution Hub) er jonno full-stack website + admin panel.
Admin nijei logo, name, category, service, project, product, blog, testimonial, FAQ,
contact info update korte parbe. Media database-e thakbe na - ImageKit-e thakbe,
DB-te shudhu URL/public_id.

## 2. Locked Decisions

- [x] Production hosting: Netlify Free (commercial use allowed)
- [x] Dev/preview: localhost + local MongoDB (Vercel use hobe na)
- [x] Framework: Next.js (App Router) + TypeScript
- [x] Database: MongoDB (Atlas Free in production, local MongoDB in development) + Mongoose
- [x] Media: ImageKit Free (20GB bandwidth + 3GB storage)
- [x] Auth: credentials login + bcrypt + signed httpOnly session cookie (custom implementation)
- [x] Roles: Admin / Editor / Author
- [x] Language: Bangla + English (`/bn`, `/en`) with hreflang
- [x] Styling: Tailwind CSS only (no component CSS files)
- [x] Animation: Motion (Framer Motion) + `prefers-reduced-motion` support
- [x] Email: Resend Free (optional, inquiry notification)
- [ ] Domain: TBD
- [ ] Logo & real photos: TBD

## 3. Current State (before work)

- [x] Static demo: `index.html`, `style.css`, `script.js`
- [x] BN/EN toggle hardcoded in `script.js`
- [x] Contact form demo only - data save hoy na
- [x] Images from Unsplash, assets folder empty
- [x] No backend, database, admin, package.json, git repo

## 4. Architecture

- Public site: `/`, `/services`, `/projects`, `/products`, `/blog`, `/about`, `/contact`
- Admin: `/admin/login`, `/admin`, `/admin/settings`, `/admin/categories`,
  `/admin/services`, `/admin/projects`, `/admin/products`, `/admin/blog`,
  `/admin/testimonials`, `/admin/faq`, `/admin/media`, `/admin/inquiries`,
  `/admin/users`, `/admin/audit-log`
- API/Actions: Next.js Route Handlers + Server Actions
- DB-te shudhu text, relation, URL - kono binary file na
- Media upload: admin -> signed ImageKit upload -> DB-te URL save

## 5. MongoDB Collections

`SiteSetting`, `User`, `Category`, `Service`, `Project`, `Product`, `Brand`,
`Testimonial`, `Faq`, `Post`, `Media`, `Inquiry`, `Navigation`, `ContentBlock`,
`AuditLog`

Common fields: `slug`, `title: { bn, en }`, `content: { bn, en }`,
`image: { url, publicId, alt }`, `sortOrder`, `isActive`, `createdAt`, `updatedAt`

Mongoose models live in `src/db/models`. Bilingual text is stored as nested
`{ bn, en }` objects. Indexes are synced from the model definitions.

---

# PHASES

## Phase 0 - Setup & Accounts

- [ ] GitHub repository create
- [ ] MongoDB Atlas cluster create + `MONGODB_URI` collect (or local MongoDB)
- [ ] ImageKit account + keys collect
- [ ] Netlify account/site prepare
- [ ] Domain decide (ache/kinbo)
- [ ] Logo, real photos, contact info confirm
- [ ] Product price display rule confirm

**Done when:** sob account/keys ready, repo ache.

## Phase 1 - Foundation

- [x] Verify Node, npm, git environment
- [x] Next.js + TypeScript scaffold (Next.js 16.4.3, React 19.3.1)
- [x] ESLint, Prettier, Tailwind v4 styling setup
- [x] Tailwind-only styling policy (no component CSS files)
- [x] Motion animation base + reduced-motion support
- [x] Folder structure + `.env.example`
- [x] Netlify config (`@netlify/plugin-nextjs`) + `.nvmrc`
- [x] Git init + `.gitignore` (commit only when user asks)
- [x] `lint`, `typecheck`, `build` pass (0 vulnerabilities)
- [ ] Netlify preview deploy (blocked: Netlify account)

**Done when:** empty app locally + Netlify preview deploy kore.

## Phase 2 - Database & Data Layer

- [x] Mongoose connection with serverless-safe global cache
- [x] Mongoose models for all collections + indexes (15 collections)
- [x] Seed script: settings, categories, services, projects, products, brands
- [x] Current demo content import (BN + EN)
- [x] Admin seed user (bcrypt password hash)
- [x] Query helpers + Zod validation
- [x] `db:seed` and `db:sync` scripts
- [x] Seed verified on local MongoDB (idempotent: second run creates 0)
- [ ] Production Atlas `MONGODB_URI` + seed (deploy time)

**Done when:** seed successful (local MongoDB or Atlas), demo content DB-te ache.

## Phase 3 - Public Design & i18n

- [x] Existing navy/green design components-e port
- [x] Responsive header, footer, navigation
- [x] Locale routing (`/bn`, `/en`, default `/bn`)
- [x] Language switcher with bilingual landing page content
- [x] Shared UI: buttons, cards, sections, empty states
- [x] Motion-based reveal and hover interactions

**Done when:** BN/EN toggle kaj kore, design demo-er moto.

**Current status:** Phase 3 complete and verified.

## Phase 4 - Public Dynamic Pages

- [x] Home: hero, trust strip, about, services, brands, projects, CTA, contact
- [x] Service list + detail
- [x] Project list + detail
- [x] Product list + detail
- [x] Blog list + detail
- [x] Testimonials + FAQ
- [x] Contact form -> Inquiry save
- [ ] `next/image` + ImageKit loader

**Done when:** admin DB` content public site-e dekha jay.

**Current status:** Phase 4 public content pages complete and build verified.

## Phase 5 - Admin Auth & Roles

- [x] Credentials-based admin login flow
- [x] Signed session cookie handling and logout
- [x] Password verification with bcrypt and active-user checks
- [x] Protected admin route group + `noindex`
- [x] Login rate limit (8 attempts / 15 minutes) + 2FA-ready user fields
- [x] Role-based access for Admin / Editor / Author
- [x] Responsive admin layout, sidebar, and database-backed dashboard stats

**Done when:** role onujayi admin access control kaj kore.

**Current status:** implemented and verified with lint, typecheck, production build, and signed-out route checks. Credentialed login and role-specific CRUD still need manual verification with the configured seed account.

## Phase 6 - Admin Content Management

- [ ] Site settings form (name, logo, favicon, colors, contact, social, SEO)
- [x] Category CRUD + reorder + active toggle
- [x] Service CRUD
- [ ] Project CRUD + multiple images
- [ ] Product CRUD + price + specs + stock
- [ ] Blog CRUD + Tiptap editor + draft/publish
- [x] Testimonial CRUD
- [x] FAQ CRUD
- [x] Navigation/menu management
- [ ] Media library (upload, alt, reuse, delete)
- [x] User management (Admin only)
- [x] Audit log
- [ ] Preview before publish

**Done when:** admin panel theke pura site customize kora jay.

**Current status:** core settings, content editors, media upload/alt/delete, user administration, and audit viewer are implemented. The remaining items are image reuse in content forms, expanded project/product fields, rich-text editing, and preview-before-publish.

## Phase 7 - Inquiries, Search & SEO

- [x] Inquiry inbox (read/unread, CSV export)
- [ ] Email notification via Resend
- [ ] Site search (services/projects/products/blog)
- [ ] Dynamic metadata, OG image
- [ ] `sitemap.xml`, `robots.txt`, canonical, hreflang
- [ ] JSON-LD: LocalBusiness, Product, Article
- [ ] Privacy policy + terms page

**Done when:** form submission DB + email-e jay, SEO tags thik ache.

**Current status:** inquiry storage, status/notes management, and CSV export are implemented. Email notifications, site search, and the remaining SEO work are pending.

## Phase 8 - Security, Testing & Performance

- [ ] Zod validation sob input-e
- [ ] Rich text sanitize (XSS protection)
- [ ] CSRF + rate limiting + honeypot
- [x] Admin route protection test (signed-out smoke check)
- [ ] Playwright smoke tests (login, CRUD, form)
- [x] `lint`, `typecheck`, `build` clean
- [ ] Lighthouse performance/SEO/accessibility check
- [ ] Image optimization + caching

**Done when:** sob test pass, security checklist clear.

## Phase 9 - Deploy & Handover

- [ ] Netlify production deploy
- [ ] Environment variables set
- [ ] Custom domain + SSL
- [ ] MongoDB backup (weekly `mongodump` GitHub Action)
- [ ] Admin training document (Bangla)
- [ ] Credentials handover (secure way)
- [ ] Final acceptance checklist

**Done when:** live site + admin panel + docs ready.

---

## UI Modernization - One Phase at a Time

UI refresh is tracked separately from backend/deployment phases. Finish and verify
each phase before starting the next one; keep later phases pending until then.

### UI Phase 1 - Admin Dashboard Atmosphere

- [ ] Add a subtle animated navy/green ambient background to the dashboard welcome panel.
- [ ] Refresh dashboard statistic cards with clearer hierarchy and restrained hover feedback.
- [ ] Respect `prefers-reduced-motion` by disabling ambient dashboard animations.
- [ ] Verify desktop/mobile appearance and reduced-motion behavior in the browser.
- [ ] Run lint, typecheck, and production build before marking this phase final.

**Status:** Implementation is in place; browser/build acceptance is pending, so the
checkboxes remain open. The user has prioritized the separate public mobile
navigation work while dashboard acceptance remains pending.

### UI Phase 2 - Mobile Homepage Navigation

- [x] Add a compact small-screen header with a slide-in navigation drawer on the homepage.
- [x] Keep the existing desktop navigation, logo, language switch, and search destination.
- [x] Make the drawer bilingual, keyboard-dismissible, focus-contained, and scroll-locking.
- [x] Add a wind-reactive grass animation to the drawer surface.
- [x] Hide the drawer scrollbar while preserving its scroll behavior.
- [x] Keep the navigation links transparent and borderless above the grass animation.
- [x] Reveal public card sections with staggered bottom/side motion as cards enter the viewport.
- [x] Add bordered hover treatment to homepage section action links.
- [x] Align the admin console sidebar, top bar, and login surface with the public KPESH navy/teal/lime visual system.
- [x] Replace the mobile admin navigation strip with a public-style slide-in drawer and add a branded desktop sidebar scrollbar.
- [x] Move mobile admin controls to the header right, add a Bengali site-language control, and place Theme above Logout at the drawer bottom.
- [x] Keep the admin language control inside the admin route instead of sending users to the public dashboard.
- [x] Add a real English/Bangla admin locale toggle using a persistent admin-only cookie.
- [x] Fix the mobile admin drawer viewport positioning with a body portal and verify visible link hover states.
- [x] Match the admin theme control to the public System/Light/Dark selector and add a red logout hover state.
- [x] Add pointer cursors to admin navigation, theme, close, and logout controls.
- [x] Apply dark-theme surfaces and form contrast overrides to the admin route.
- [x] Fix dark-mode contrast for admin topbar language/navigation controls and the portaled mobile navigation surface.
- [x] Translate admin content routes, media, inquiries, users, settings, and audit-log surfaces using the admin locale cookie.
- [x] Improve settings localization and visibility, add direct logo/video upload controls, and clean up replaced ImageKit assets safely.
- [x] Keep localized settings textarea heights fixed and disable manual resizing.
- [x] Make the settings logo control device-upload-only with a local preview; do not fetch or display old media records.
- [x] Defer logo ImageKit upload and media persistence until the settings Save button is submitted.
- [x] Enable Save/Cancel actions after settings changes and modernize the background video upload control.
- [x] Split settings actions across sections, keep logo/video previews visible, enlarge localized fields, and style the admin scrollbar.
- [x] Remove the duplicate bottom settings actions and invalidate all public locale layouts after a logo/settings update.
- [x] Wire the saved logo and short name into the admin sidebar/mobile drawer/login card and public footer, not only the public header.
- [x] Apply full circular styling to all saved logo previews and logo marks across admin and public surfaces.
- [x] Match desktop admin sidebar navigation hover colors and motion to the public navigation style.
- [x] Improve admin theme contrast for labels, legends, muted text, and light button states in dark mode.
- [x] Fix dark-theme hover contrast across public links/buttons and admin secondary controls so hover text remains visible.
- [x] Restore readable dark-mode colors for service cards, descriptions, and service action text.
- [x] Explicitly force dark-mode hero CTA, hero supporting text, service headings, descriptions, and action labels to high-contrast colors.
- [x] Verify the updated header in a running browser at mobile and desktop widths.
- [x] Verify the drawer scrollbar is hidden while the drawer remains scrollable.
- [x] Verify the animated drawer background stays fixed while navigation content scrolls.
- [ ] Run the project's typecheck, lint, and build only if the user asks for terminal validation or reports an error.

**Status:** Mobile and desktop browser checks pass. Fixed the mobile drawer being
contained by the header's backdrop filter by limiting that blur to desktop, where
the drawer is hidden. Keyboard Escape closes the drawer, restores focus, and
releases the page scroll lock. The drawer scrollbar is hidden without disabling
scrolling. The drawer now uses a subtle full-surface grass field; nearby
blades wave in response to cursor movement across `#mobile-public-navigation`.
Navigation links remain transparent and borderless above it. Editor diagnostics
report no errors.
Terminal validation remains pending per the user's instruction not to run
commands unless an error is reported.

### UI Phase 3 - Shared Navigation Across Public Pages (Current)

- [x] Extract the public header into a shared component without changing page content or routes.
- [x] Apply the mobile drawer consistently to all public listing, detail, search, about, and contact routes.
- [x] Remove duplicate page-local headers from all public routes.
- [x] Remove decorative serial numbers from public navigation, homepage cards, and about cards.
- [x] Modernize desktop navigation with a rounded active-link group, clearer hover/focus states, and a compact translucent header surface.
- [x] Verify shared navigation on English and Bengali routes, route-preserving language switch, and mobile drawer without serial labels.
- [ ] Run the project's typecheck, lint, and build only if the user asks for terminal validation or reports an error.

**Status:** Shared navigation is mounted once in the locale layout; all public
route-local header blocks are removed. Browser checks on `/en/about` and
`/bn/about` confirmed a single shared header, Bengali/English route-preserving
language switching, and a working mobile drawer. Editor diagnostics report no
errors in the affected files. Terminal validation remains pending per the user's
instruction not to run commands unless an error is reported.

### UI Phase 4 - YouTube-Style Inline Search

- [x] Replace the separate search-page navigation action with an expandable header search field.
- [x] Reuse existing search query/results behavior and retain the search results route for submitted queries.
- [x] Support Enter, Escape, focus return, keyboard access, and Bengali/English labels.
- [x] Verify English results, Bengali no-results state, expandable header behavior, and mobile-menu search access in the browser.
- [ ] Run typecheck, lint, and build only if the user asks for terminal validation or reports an error.

**Status:** Inline search is implemented and browser-checked. Search opens from the
shared header or mobile drawer, focuses the field, submits to the existing
localized search results page, supports clear/close and Escape with focus return,
and displays localized labels. Existing result and empty states remain intact.
Editor diagnostics report no errors; terminal validation remains pending per the
user's instruction not to run commands unless an error is reported.

### UI Phase 5 - Footer and Public Section Styling

- [x] Restyle the shared footer to coordinate with the live-energy brand while retaining readable light surfaces and link contrast.
- [x] Improve narrow-screen footer layout, touch targets, wrapping, and spacing.
- [x] Add the shared, reduced-motion-aware live-energy canvas to the About hero while keeping its navy background, text, and layout intact.
- [x] Restyle the shared Canvas into a layered, softly glowing teal energy-wave ribbon with smooth, naturally varying randomized strands.
- [x] Add reduced-motion-aware staggered card lift/scale on hover and subtle border/shadow feedback across public content cards.
- [x] Strengthen staggered scroll-reveal motion across public card grids and apply it to search results and About FAQ cards.
- [x] Modernize the service listing cards with equal heights, consistent image panels, aligned descriptions/actions, and improved hover/focus feedback.
- [x] Apply the same equal-height media/content card structure to Products, Projects, and Blog listings, including consistent image fallbacks and aligned card actions.
- [x] Fix medium-width listing images with responsive 16:10 media frames and centered cover positioning.
- [x] Add a persisted public light/dark theme toggle without affecting the admin surface.
- [x] Add System as the default theme mode and follow OS preference changes.
- [x] Use two listing columns from 720px through tablet widths before expanding at desktop breakpoints.
- [ ] Identify and update any other public sections that need visual alignment with the live-energy hero; preserve content and route behavior.
- [x] Check footer contrast and Bengali text wrapping on a narrow-screen browser viewport.
- [ ] Check all updated public sections for reduced motion, accessibility contrast, and bilingual text wrapping.

**Status:** The shared footer now uses a dark teal energy palette, subtle static
teal/lime glows, a clear brand/tagline area, grouped navigation, and separate
legal links. On a 390px Bengali page viewport, links wrap cleanly, each link has
at least a 40px touch target, and no horizontal overflow was detected. Products,
Projects, and Blog listing cards now follow the same equal-height media/content
pattern as Services. The latest updates also disable card-image scaling and CTA
arrow movement when reduced motion is requested.

Typecheck passes. Lint exits successfully with two existing React hook ref
cleanup warnings in `home-public-header.tsx`. The earlier generic HTTP 500
responses across the listing routes cleared after the approved dev-server
restart. Browser checks now render all three English desktop listings and all
three Bengali mobile listings. At 1440px, Products cards are all 418px high and
Projects cards are all 450px high; Blog has one 494px card. At 390px, Products
cards are all 410px high, Projects cards are all 442px high, and Blog has one
486px card. None of the checked routes has horizontal overflow. The broader
review of contrast, reduced-motion behavior, and bilingual wrapping across all
updated public sections remains open. A reduced-motion spot check on the
Bengali Blog card confirmed its CTA arrow remains stationary.
Medium-width listing cards now use responsive media frames so source images
retain a stable presentation instead of being compressed into a short fixed
height. Public visitors can now switch between light and dark themes from the
shared header; the preference is persisted locally and the admin surface is
left unchanged. Theme selection now includes System, Light, and Dark, with
System as the initial mode and an early root bootstrap to prevent route-load
flicker. Browser verification confirmed System default on Projects and Dark
selection persisted after navigating to Bengali Services. Services, Products,
Projects, and Blog use two columns from 720px through tablet widths. Typecheck
and lint pass after these adjustments.

### UI Phase 6 - Final Public UI Acceptance

- [ ] Review navigation, inline search, footer, and public sections across all routes at mobile and desktop widths.
- [ ] Run browser smoke checks and the production build when terminal validation is authorized.
- [ ] Record verified results and mark only accepted items complete.

### UI Phase 7 - Configurable Ambient Video

- [ ] Add an optional ImageKit MP4/WebM video setting with upload, preview, replace, and remove controls.
- [ ] Render the selected video behind the homepage hero and admin login, retaining the animated gradient fallback.
- [ ] Enforce the configured ImageKit endpoint and supported MIME types when saving the setting.
- [ ] Verify upload, persistence, both display locations, fallback behavior, and reduced-motion behavior.
- [ ] Run lint, typecheck, and production build before marking the phase final.

**Status:** Implementation is in place; browser/build acceptance is pending. No
hosted video was uploaded, so actual ImageKit upload and playback remain unverified.

---

## 6. Progress Tracking Rules

- Kaaj shuru korar age status `in_progress` hisebe note hobe.
- Checkbox `[x]` hobe shudhu local test/build pass er por.
- Protita phase shesh e `plan.md` update + short progress log.
- Kono phase adhora thakle `[ ]` thakbe ar blocker note thakbe.

## 7. Overall Status (checked 2026-10-28)

**The full project is not complete yet.** Local foundation, bilingual public routes,
and core admin features are implemented. Production accounts/deployment, parts of
content management, SEO/search, and final security/performance verification remain.

| Phase                               | Status                                                                                                                |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 0 - Setup & Accounts                | Blocked on GitHub, Atlas, ImageKit, Netlify, domain, and final assets/account decisions.                              |
| 1 - Foundation                      | Local setup and build checks pass; Netlify preview still needs an account.                                            |
| 2 - Database & Data Layer           | Local MongoDB and seed are complete; production Atlas setup is pending.                                               |
| 3 - Public Design & i18n            | Complete; `/bn` and `/en` smoke checks return 200.                                                                    |
| 4 - Public Dynamic Pages            | Main routes and inquiry persistence are implemented; ImageKit `next/image` loader is not.                             |
| 5 - Admin Auth & Roles              | Implemented and build-verified; credentialed login and role-specific actions still need manual verification.          |
| 6 - Admin Content Management        | Partial; settings, core CRUD, media, users, and audit log exist, but listed enhancements remain.                      |
| 7 - Inquiries, Search & SEO         | Partial; inbox and CSV export exist; email, search, and remaining SEO work are pending.                               |
| 8 - Security, Testing & Performance | Partial; lint/typecheck/build and signed-out route checks pass; full security, browser, and performance tests remain. |
| 9 - Deploy & Handover               | Not started; depends on production accounts, environment setup, and acceptance testing.                               |
| UI Modernization                    | Admin dashboard acceptance pending; public homepage mobile navigation and shared public navigation are browser-checked; inline search and footer phases pending; configurable video browser/build acceptance pending. |

`.env.local` is present, but its values and the configured credentials were not
displayed or verified. Never share secret values in chat.

## 8. Progress Log

| Date       | Phase | Update                                                                 |
| ---------- | ----- | ---------------------------------------------------------------------- |
| 2026-10-24 | 0     | Plan created. Accounts/keys pending.                                   |
| 2026-10-24 | 1     | Next.js 16.4.3 scaffold, Tailwind, Prettier, Netlify config. Build OK. |
| 2026-10-24 | 1     | Netlify preview pending (account needed). GitHub push pending.         |
| 2026-10-24 | 1     | Tailwind-only policy confirmed. Motion setup + reduced-motion done.    |
| 2026-10-24 | 2     | Switched database to MongoDB + Mongoose (local + Atlas for prod).      |
| 2026-10-24 | 2     | 15 collections/models, queries, Zod schemas, indexes.                  |
| 2026-10-24 | 2     | Local seed OK: 12 categories, 5 brands, 4 services, 3 projects,        |
|            |       | 4 products, 4 FAQs, 1 post, 7 nav items, 4 content blocks, 1 admin.    |
| 2026-10-28 | 5-8   | Added users, inquiry inbox/CSV, audit log, and ImageKit media UI/API.  |
|            |       | Lint, typecheck, build, Prettier, and signed-out HTTP checks pass.     |
| 2026-10-28 | UI-1  | Added reduced-motion-aware ambient animation and refreshed admin dashboard stat cards; acceptance pending. |
| 2026-10-28 | UI-2  | Added a bilingual mobile drawer; confirmed layout, Escape close, focus return, and scroll unlock in browser. |
| 2026-10-28 | UI-2  | Hid the drawer scrollbar without disabling scrolling; verified the navigation area remains scrollable at 390px. |
| 2026-10-28 | UI-2  | Fixed header effect cleanup ref warnings; typecheck and lint now pass with zero errors and warnings. |
| 2026-10-28 | UI-2  | Replaced the native theme select with a modern accessible popover; fixed its deferred state sync and revalidated typecheck/lint. |
| 2026-10-29 | UI-2  | Strengthened public dark-theme surface overrides for page backgrounds, cards, header controls, borders, and text contrast; typecheck/lint pass. |
| 2026-10-29 | UI-2  | Fixed dark mode remaining visually light by using `data-theme` root selectors, dark color tokens, and explicit public surface overrides. |
| 2026-10-29 | UI-2  | Extended dark-mode contrast across all public routes: headings, muted text, links, cards, forms, inputs, prose content, borders, and responsive surfaces; typecheck/lint pass. |
| 2026-10-29 | UI-2  | Full-scroll browser verification completed in dark mode across homepage, About, listing, contact/legal, and detail routes; no sampled low-contrast text remained. |
| 2026-10-29 | UI-2  | Refined dark search styling with a rounded input, readable light text, translucent dark field, and lime action button; typecheck/lint pass. |
| 2026-10-29 | UI-2  | Moved the inline search icon inside the rounded input field and added matching left padding; terminal validation intentionally skipped per user preference. |
| 2026-10-29 | UI-2  | Made mobile drawer navigation links transparent so the live animation remains visible; added hover/rotate feedback to the drawer close button. |
| 2026-10-29 | UI-2  | Replaced the drawer atmosphere with a full-surface grass field; nearby blades wave with cursor movement while the links remain transparent and borderless. |
| 2026-10-29 | UI-3  | Updated public card grids with clearer staggered reveals: cards alternate from below, left, and right while the section fills. |
| 2026-10-29 | UI-3  | Added rounded border, soft brand halo, background tint, and arrow motion to homepage “View all” links. |
| 2026-10-29 | ADMIN-1 | Restyled the protected admin shell and login form with KPESH brand surfaces, glass navigation, responsive controls, and consistent focus/hover states. |
| 2026-10-29 | ADMIN-1 | Verified `/admin`, replaced the mobile horizontal nav strip with a slide-in drawer, and added a slim lime-accented sidebar scrollbar. |
| 2026-10-29 | ADMIN-1 | Moved the mobile menu control to the header right, added a Bengali website-language button, and placed the theme control above Logout in the drawer. |
| 2026-10-29 | ADMIN-1 | Corrected the mobile admin language control from the public `/bn` route to the admin `/admin` route. |
| 2026-10-29 | ADMIN-1 | Replaced the non-functional admin language link with an English/Bangla toggle that reloads the same admin route and translates the shell/dashboard surfaces. |
| 2026-10-29 | ADMIN-1 | Fixed the mobile drawer being constrained by the blurred header; portaled it to the body, restored full-height positioning, and verified lime border/background/slide hover states. |
| 2026-10-29 | ADMIN-1 | Added the public-style admin theme popover with System/Light/Dark selection, fixed drawer translate state, and changed logout hover styling to red on desktop and mobile. |
| 2026-10-29 | ADMIN-1 | Added explicit pointer cursors to all admin navigation and action controls, then verified mobile drawer and desktop sidebar cursor states. |
| 2026-10-29 | ADMIN-1 | Fixed admin dark mode by adding scoped dark overrides for the shell, topbar, cards, text, borders, inputs, textareas, selects, and editable surfaces. |
| 2026-10-29 | ADMIN-1 | Added dark topbar button surfaces and readable text, plus a themed mobile drawer gradient so portaled navigation controls remain visible in dark mode. |
| 2026-10-29 | ADMIN-1 | Added client-safe admin translation helpers and wired Bangla labels across all protected admin routes, content forms, media, inquiries, users, settings, and audit log; verified routes in the browser. |
| 2026-10-29 | ADMIN-1 | Localized settings form labels/actions, added a new-image upload control beside the logo picker, retained video upload/replace controls, and made settings saves remove replaced ImageKit assets unless they are still referenced elsewhere. |
| 2026-10-29 | ADMIN-1 | Fixed localized settings textarea height at three rows and disabled manual resize handles. |
| 2026-10-29 | ADMIN-1 | Changed the settings logo picker to device-only upload with local preview and no existing media-library fetch/select. |
| 2026-10-29 | ADMIN-1 | Deferred logo ImageKit upload and metadata persistence until Save; aligned localized textareas and right-aligned the rounded logo upload control. |
| 2026-10-29 | ADMIN-1 | Added settings dirty-state tracking with enabled Save/Cancel actions after edits, plus a bordered modern video upload button. |
| 2026-10-29 | ADMIN-1 | Added section-level Save/Cancel actions, persistent logo preview, larger localized text areas, hidden media URLs, and a modern gradient scrollbar for admin content. |
| 2026-10-29 | ADMIN-1 | Removed the duplicate bottom Save/Cancel bar and added public route/layout cache invalidation so saved logo changes propagate across the site. |
| 2026-10-29 | ADMIN-1 | Replaced hardcoded admin and footer logo marks with the database-backed saved logo and short name, including admin sidebar, mobile drawer, login, and public footer. |
| 2026-10-29 | ADMIN-1 | Made all logo images and fallback marks fully round with circular containers and clipped previews. |
| 2026-10-29 | ADMIN-1 | Updated desktop admin sidebar nav hover styling with public-style brand tint, border, lift, and shadow feedback. |
| 2026-10-29 | ADMIN-1 | Fixed theme-aware admin text contrast so labels, legends, muted text, and secondary buttons remain readable in dark mode. |
| 2026-10-29 | ADMIN-1 | Added dark-theme hover overrides for public navigation/actions and admin links/buttons to prevent low-contrast hover text. |
| 2026-10-29 | ADMIN-1 | Fixed dark-mode service card backgrounds, headings, descriptions, CTA text, and hover surfaces so service content stays visible. |
| 2026-10-29 | ADMIN-1 | Added explicit dark-mode selectors for the hero service CTA and service content to prevent inherited text colors from hiding labels. |

## 9. Open Questions

- Domain ache kina? Na thakle kon name/extension?
- Logo + real project photos kothay ache?
- Product price website-e dekhabo, naki "Call for price"?
- Analytics lagbe kina (Plausible/Umami)?
- Blog author hisebe ke likhbe?

## 10. Estimated Timeline

- Phase 0-1: 3-4 days
- Phase 2-4: 7-9 days
- Phase 5-6: 6-8 days
- Phase 7-8: 4-5 days
- Phase 9: 2 days
- Total: ~3 weeks (content/feedback er upor depend kore)

## 11. Blockers

- MongoDB Atlas (production `MONGODB_URI`), ImageKit, Netlify, domain - user account/credentials lagbe.
- Local MongoDB already running; local seed done. Atlas migration deploy time-e hobe.
- Real logo/photos - na thakle placeholder diye start, admin theke replace.
- GitHub repo - `gh` CLI nai; user GitHub account/push permission lagbe.
- Netlify preview deploy - account/site create na hoya porjonto pending.
- Phase 2 seed - local MongoDB e cholbe; production-e Atlas `MONGODB_URI` lagbe.
