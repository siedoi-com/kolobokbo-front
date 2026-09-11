# Phase 1 — Markup fixes (Kolobok Bo front)

Guide for **Claude Code / Claude CLI**: execute **strictly one PART at a time**. Do not mix PARTs in a single run. After each PART — stop, show the diff, wait for approval.

**Phase 1 goal:** fix the static front (`kolobokbo-front`) to match Figma and prepare markup for a later WP/WooCommerce port.  
**Out of scope for Phase 1:** WP theme, Woo hooks, deploy, production content.

---

## How to run in Claude CLI

Example for one PART:

```text
Read docs/PHASE-1-MARKUP.md and execute PART 1.0 only.
Do not touch other PARTs. When done, give a short report and DoD checklist.
```

Next PART — only after the previous one is approved:

```text
PART 1.0 accepted. Execute PART 1.1 from docs/PHASE-1-MARKUP.md.
```

---

## Project context

| | |
|---|---|
| Stack | Vite multi-page, HTML + SCSS (BEM) + JS modules |
| Root | `src/` |
| Styles | `src/assets/scss/` → imported via `src/assets/js/main.js` |
| Figma | https://www.figma.com/design/heqjRfc2E10M3zeAwMATHQ/Колобок--New--1?node-id=284-1695&m=dev |
| Breakpoints | Mobile base (design width 420) → tablet `1024` (`media.L`) → desktop `1440` (`media.XL`) |
| Target backend (later) | WordPress + WooCommerce; theme architecture ≈ Markilux; catalog = Woo (not CPT) |

### Pages

| File | Page |
|---|---|
| `src/index.html` | Home |
| `src/shop.html` | Catalog |
| `src/product.html` | Product detail |
| mini-cart | Mini-cart (partial; no dedicated `cart.html` required) |
| `src/checkout-page.html` | Checkout |
| `src/success.html` | Order success |
| `src/about-us-page.html` | About us |
| `src/blog.html` | Blog |
| `src/article-page.html` | Article |
| `src/contact.html` | Contact |
| `src/privacy-policy.html` | Privacy policy |
| `src/public-offer.html` | Public offer |
| `src/preview/*` | Cart states (keep in sync with partials) |

### Markup references (patterns only — do not copy-paste blindly)

- Markilux: thin `header`/`footer` + partials; SCSS `utils / components / layout / sections`
- Joimo: mini-cart **once** in the shared layout
- Neutech: clear components/sections without utility-class soup

---

## Agent rules (all PARTs)

1. **One PART at a time.** Do not start the next PART without an explicit “accepted”.
2. Change only files required for the current PART.
3. Keep the existing visual language; edits = bugs, a11y, structure, Figma sync.
4. BEM for components/sections. Utilities (`flex-row`, `d-none`, …) — minimal; prefer styles in the component SCSS.
5. Do not add WordPress leftover classes (`menu-item-type-post_type`, …) in new markup; existing ones may be removed in PART 1.0.
6. Static URL scheme: **one convention** — `.html` for internal links (`/shop.html`, `/contact.html`). A TODO comment for future WP pretty URLs is fine.
7. Do not invent new content (copy/prices) — fix markup; placeholders may stay.
8. After changes: `npm run build` must pass (when the environment allows).
9. Do not commit unless the user asks.

---

## Known issues (from audit) — fix in the relevant PART

- Header/footer/mini-cart **duplicated** across pages → drift
- Mini-cart DOM missing on most pages, but the button still has `aria-controls="mini-cart"`
- Ghost classes: `text--size_16`, `c--black`, `bg--white` (not defined in SCSS)
- Dead `$breakpoint_*` / `$color_*` block at the top of `style.scss`
- Skip-link uses missing `var(--color__accent-main)`
- Incorrect `aria-current` / `current-menu-item`
- `product.html`: product title must be `<h1>`
- `shop.html`: breadcrumbs — SVG must not be a direct child of `<ul>`
- `contact.html`: `/blog/#faq` has no target; form fields lack labels
- Mixed URLs: `/shop/` vs `/shop.html`, `/cart/`
- Rating lacks an accessible name; empty `alt` on content images

---

# PART 1.0 — Shared layout & foundation

**Goal:** single source of truth for site chrome + tokens/breakpoints + base a11y fixes.

### Do

1. **Partials for shared markup**  
   Recommended: `vite-plugin-handlebars`, or `vite-plugin-html` / posthtml-include — whichever fits the current `vite.config.js` with least friction.  
   Minimum set:
   - `src/partials/before-header.html` (promo line)
   - `src/partials/header.html` (burger, logo, nav, cart button — bar only, no wrapper)
   - `src/partials/mobile-menu.html` (fullscreen overlay; sibling of header, not nested)
   - `src/partials/mini-cart.html` (overlay + panel; filled state + structure ready for empty)
   - `src/partials/footer.html`  
   Wire partials into **all** HTML pages (including `preview/`).

2. **Header parameterization** (via partial locals / placeholders):
   - Logo: link to `/` everywhere **except** homepage (homepage may use a non-link `div`) — **or** always link (simpler for WP later). Pick one approach and apply everywhere.
   - `current-menu-item` + **only one** `aria-current="page"` on the active item.
   - Cart badge / count from markup is fine.

3. **Mini-cart on every page** that has a cart button.  
   JS behavior (`mini-cart.js`) must work the same everywhere.

4. **Cleanup utilities / tokens**
   - Remove or implement ghost classes in the header.
   - Delete the dead `$color_*` / `$breakpoint_*` block at the top of `src/assets/scss/style.scss`.
   - In `_media.scss`: document that the working breakpoints are base / `L(1024)` / `XL(1440)`. Do not expand unused mixins.
   - Fix `.skip-link` token; add a skip-link in the header partial if missing from HTML.
   - `body.lock` vs `no-scroll` — keep one class and align JS.

5. **Single URL scheme** in partials: `*.html` for internal pages.  
   Cart `href`: if mini-cart JS calls `preventDefault`, use `#` or `/checkout-page.html` by agreement — do not leave a broken `/cart/` with no page. Document the choice in a partial comment.

6. Remove / do not proliferate WordPress leftover menu classes (`menu-item` + `current-menu-item` is enough if styles need them).

### Do not do in 1.0

- Pixel fixes for homepage / other page sections
- Full utility-class refactor across the project
- New JS features

### DoD — PART 1.0

- [ ] Partials exist and are included on all pages
- [ ] Editing footer partial text updates every page after rebuild/dev
- [ ] Mini-cart opens from the header on `shop.html` and `contact.html`
- [ ] No ghost classes in the header partial (or they are actually styled)
- [ ] `npm run build` OK
- [ ] Short report: files added/changed

---

# PART 1.1 — Homepage (`index.html`)

**Goal:** homepage pixel-close to Figma `main` (desktop 1440 + mobile 420; verify tablet 1024).

### Figma

- File: Kolobok — New  
- Homepage frame: `main` (e.g. node near `461:5637`; confirm in Dev Mode)
- Also check mobile/tablet homepage frames in the same file

### Sections (order)

1. Hero  
2. Categories  
3. Running / promo line  
4. Featured product  
5. Partners  
6. Ingredients (slider)  
7. Product info (“What is onigiri?”)  
8. Testimonials  
9. Blog teaser  
10. FAQ  

### Do

- Match spacing, typography, colors to Figma (via `_vars.scss` tokens)
- Semantics: one `<h1>` in hero; then logical `h2`/`h3` hierarchy
- Categories: `aria-pressed` / correct active state
- Rating: accessible name
- Content images: meaningful `alt`
- FAQ: valid `aria-controls` / `id` (mostly OK — verify)
- Remove duplicate reviews/articles if they are markup mistakes (keep if Figma intentionally repeats them)

### DoD — PART 1.1

- [ ] Homepage checked at 420 / 1024 / 1440 without obvious layout breaks
- [ ] Key sections match Figma (not “approximately”)
- [ ] Homepage a11y checklist done
- [ ] Shared partials still intact

---

# PART 1.2 — Catalog (`shop.html`)

### Do

- Catalog hero + filters/categories
- `product-card` grid (identical card structure — no drift from giant copy-paste)
- Breadcrumbs: separators only inside `<li>`
- Sort / segmented control: basic a11y (`aria-expanded`, `aria-pressed` where needed)
- Correct header `current` (Catalog)
- Compare to Figma catalog (desktop + mobile)

### DoD

- [ ] Valid breadcrumbs markup
- [ ] Product cards consistent
- [ ] Menu current = Catalog
- [ ] Visual ≈ Figma

---

# PART 1.3 — Product (`product.html`)

### Do

- Product title → **`<h1>`**
- Gallery, summary, composition, characteristics, related
- Breadcrumbs: link to `shop.html`
- Menu current: Catalog (or agreed PDP rule — document it)
- Rating / quantity a11y

### DoD

- [ ] Single `<h1>` — product name
- [ ] Sections ≈ Figma product
- [ ] No broken `/shop/` in breadcrumbs

---

# PART 1.4 — Cart UX (mini-cart + preview states)

### Do

- States: filled / empty / add-success (see `src/preview/` + Figma cart frames)
- Align `cart-item` markup, buttons, totals with SCSS components
- Empty-state CTA → `shop.html`
- Ensure partial + preview stay in sync

### DoD

- [ ] All Figma cart states covered in markup
- [ ] Works on mobile 420 and desktop

---

# PART 1.5 — Checkout + Success

Files: `checkout-page.html`, `success.html`

### Do

- Forms: `<label>` or `aria-label` on every field
- Choice/payment cards, order summary
- Success: details + recommended products
- URLs/CTAs aligned with the `.html` scheme

### DoD

- [ ] Forms usable via keyboard / basic screen reader
- [ ] Visual ≈ Figma checkout / success

---

# PART 1.6 — About (`about-us-page.html`)

Sections: hero, story, stats, values, team (per Figma).

### DoD

- [ ] Heading hierarchy correct
- [ ] ≈ Figma about (desktop + mobile)

---

# PART 1.7 — Blog + Article

Files: `blog.html`, `article-page.html`

### Do

- List / tabs / featured / pagination
- Article: hero + content typography
- Article cards: `alt`, clickable title
- Unique `<title>` values (at least sensible static titles)

### DoD

- [ ] Blog + article ≈ Figma
- [ ] No empty `alt` on article covers

---

# PART 1.8 — Contact (`contact.html`)

### Do

- Hero, details, form, FAQ teaser
- Labels on form fields
- FAQ CTA: `/index.html#faq` or an on-page FAQ section — **not** `/blog/#faq` with no target
- Partners block if present in the design — keep in sync with homepage component if needed

### DoD

- [ ] Form fields have accessible names
- [ ] FAQ link is valid
- [ ] ≈ Figma contact

---

# PART 1.9 — Legal

Files: `privacy-policy.html`, `public-offer.html`

### Do

- Legal hero + content typography/spacing
- Footer legal links correct
- Light visual polish to Figma (if frames exist)

### DoD

- [ ] Readable typography, container, spacing
- [ ] Footer navigation works

---

# PART 1.10 — Final QA (all pages)

### Do

1. Run the checklist below on every page at 420 / 1024 / 1440  
2. Grep for broken patterns: `/shop/`, `/cart/`, `text--size_16`, `c--black`, `bg--white`, duplicate `aria-current`  
3. Confirm partials are the single source of truth  
4. `npm run build`  
5. Short QA report: what remains for Phase 2 (WP)

### Final checklist

- [ ] Header/footer/mini-cart only via partials  
- [ ] No critical a11y/HTML issues from the audit left  
- [ ] Single URL scheme  
- [ ] Breakpoints only as agreed  
- [ ] Ready to port into WP theme `template-parts/`  

---

## Recommended order (summary)

| PART | Focus | Why |
|---|---|---|
| **1.0** | Layout partials + tokens | Otherwise every fix is duplicated N times |
| **1.1** | Homepage | Most sections / component reference |
| **1.2** | Shop | Catalog + cards |
| **1.3** | Product | PDP + h1 / gallery |
| **1.4** | Mini-cart states | E-com UX |
| **1.5** | Checkout + success | Forms / funnel |
| **1.6** | About | Marketing |
| **1.7** | Blog + article | Content |
| **1.8** | Contact | Form + FAQ link |
| **1.9** | Legal | Fast |
| **1.10** | QA | Close Phase 1 |

Correct order: **shared chrome first, then homepage, then page by page**. Do not do “a bit of everything” in parallel.

---

## Phase 2 (reminder only — do not execute here)

WP theme following Markilux structure (`inc/`, ACF blocks, Vite) + **WooCommerce** overrides; partials → `template-parts/`; content from admin. Verify domain `kolobokbo.com.ua` is not compromised before deploy.
