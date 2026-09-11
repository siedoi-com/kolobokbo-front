# Layout container system (Kolobok Bo front)

Guide for **Claude Code / Claude CLI**. Execute this as **one dedicated PART**. Do not mix with page pixel-pass PARTs unless the user says so.

## Verdict (why this exists)

**Using only per-section paddings is not ideal for this project.**

Today:

- Global `.container` (`src/assets/scss/components/_container.scss`) is almost unused.
- Most sections invent `section__container` with duplicated horizontal gutters:
  - mobile ≈ `var(--size_16)`
  - tablet `L` ≈ `var(--size_48)`
  - desktop `XL` ≈ `var(--size_80)`
- Vertical padding stays section-specific (good).
- Some sections **must** break the grid (full-bleed heroes, edge sliders, overflowing category scrollers).

**Goal:** one shared horizontal rhythm + explicit exceptions. Not “wrap every section in `.container` blindly”.

---

## How to run

```text
Read docs/LAYOUT-CONTAINER.md and execute the full task.
Do not start PART 1.2+ page work in the same run.
When done: short report + DoD checklist.
```

---

## Agent rules

1. Preserve visual look at 420 / 1024 / 1440 — this is a structure/token refactor, not a redesign.
2. Keep BEM section blocks. Prefer composing with a shared class over deleting section wrappers wholesale.
3. Do **not** force a container on full-bleed / bleed-out layouts.
4. Prefer CSS tokens for gutters over repeating rem literals.
5. Update SCSS first; change HTML only where a real shared class is needed.
6. `npm run build` must pass.
7. Do not commit unless asked.

---

## Target system

### 1. Gutter tokens (`_vars.scss`)

Add (names may be adjusted, but keep one clear set):

```scss
--layout-gutter: var(--size_16);          // mobile
--layout-max: 144rem;                     // optional cap used by some sections already
```

And via media mixins / or CSS cascading:

```scss
// after L
--layout-gutter: var(--size_48);

// after XL
--layout-gutter: var(--size_80);
```

(Implement tokens the same way other project tokens are applied — `:root` + breakpoint overrides in `_base.scss` or `_container.scss`.)

### 2. Shared container class

Replace / rewrite `.container` so it matches Figma gutters (rem), not the old unused vw model:

```scss
.container {
  width: 100%;
  max-width: var(--layout-max);
  margin-inline: auto;
  padding-inline: var(--layout-gutter);
}
```

Optional modifiers (only if needed):

- `.container--narrow` — reading width for legal/article text (if design needs it)
- `.container--full` — no max-width, still uses gutter
- `.container--bleed-end` — no `padding-inline-end` (for sliders that flush to the right edge)

### 3. How sections should use it

**Preferred HTML pattern for standard content sections:**

```html
<section class="faq">
  <div class="container faq__container">
    ...
  </div>
</section>
```

**SCSS pattern:**

- Horizontal inset → comes from `.container` (`padding-inline`).
- Vertical rhythm → stays on `section` or `section__container` (`padding-block` / `padding-top` / `padding-bottom` only).
- Remove duplicated `padding-inline` / left-right padding that only repeated the global gutter.

Example:

```scss
.faq {
  &__container {
    // was: padding: 4.8rem 1.6rem 4.2rem;
    padding-block: var(--size_48) var(--size_42);

    @include media.L {
      padding-block: var(--size_64);
    }
  }
}
```

### 4. Exceptions — do NOT force `.container`

| Pattern | Examples | Approach |
|---|---|---|
| Full-bleed media / split hero | `.hero`, some page heroes | Keep custom layout; only text column may use gutter tokens |
| Slider flush to one edge | `.ingredients`, `.testimonials`, `.blog` cards | `.container--bleed-end` or section-specific end padding `0` |
| Horizontal scroll chips | `.categories` list | Normal `.container`; `__scroller` breakout + trailing fade peek on mobile; `overflow: hidden` on section |
| Absolute décor outside | `.partners`, FAQ blobs | Container for content; décor stays absolute to section |

Use CSS variables (`padding-inline: var(--layout-gutter)`) even in exceptions when only one side differs.

---

## Suggested execution order

### Step A — Foundation

1. Add `--layout-gutter` / `--layout-max` tokens.
2. Rewrite `.container` to the rem-gutter model above.
3. Smoke-check promo / before-header if it used the old vw `.container` — update that call site.

### Step B — Homepage sections first (reference)

Migrate these to the shared pattern (in order):

1. `categories` (title alignment; list may still bleed)
2. `product-info`
3. `faq`
4. `partners` (if content is padded symmetrically)
5. `ingredients` / `testimonials` / `blog` (bleed-end care)
6. Featured `product` block if applicable

### Step C — Remaining pages

Apply the same rules to shop, product, about, contact, blog, article, checkout, success, legal.

### Step D — Cleanup

1. Grep for repeated `padding: … var(--size_16)` / `var(--size_48)` / `var(--size_80)` that only encode the global gutter — remove horizontal duplicates.
2. Leave intentional asymmetric values.
3. Ensure `max-width: 144rem` is not re-declared ad hoc where `.container` already caps width.

---

## Do NOT

- Replace every `__container` name with only `.container` if that destroys BEM hooks used by JS/CSS.
- Change vertical spacing to “normalize” sections.
- Reflow full-bleed heroes into a boxed container.
- Mix this refactor with catalog filter logic or new features.

---

## DoD

- [ ] `--layout-gutter` exists and changes at `L` / `XL`
- [ ] `.container` uses gutter tokens (no obsolete vw-only model as the primary layout)
- [ ] Homepage standard sections no longer hardcode the same horizontal paddings in 3 breakpoints
- [ ] Bleed/full-bleed exceptions still look correct at 420 / 1024 / 1440
- [ ] `npm run build` OK
- [ ] Short report: files touched + which sections were exceptions

---

## After this PART

Return to page PARTs in `docs/PHASE-1-MARKUP.md` (e.g. 1.2 Shop). Mention in the report if shop/catalog should reuse the new container immediately.
