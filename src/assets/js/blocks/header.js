const beforeHeaderEl = document.querySelector('.before-header');
const headerEl       = document.querySelector('.header');
const mobileMenuEl   = document.querySelector('.mobile-menu');

const STICKY_VH = 90;

// ── Helpers ───────────────────────────────────────────────────────────────────
function isPastThreshold() {
    return window.scrollY >= window.innerHeight * (STICKY_VH / 100);
}

function isMobileMenuOpen() {
    return mobileMenuEl?.classList.contains('active');
}

function updateHeaderTop() {
    if (!headerEl) return;
    const bh = beforeHeaderEl ? beforeHeaderEl.offsetHeight : 0;
    headerEl.style.top = bh + 'px';
    headerEl.style.setProperty('--before-h', bh + 'px');
}

function showHeader() {
    headerEl?.classList.remove('header--hidden');
    beforeHeaderEl?.classList.remove('before-header--hidden');
}

function hideHeaderInstant() {
    // Drop transition so sticky-enter does not flash
    if (headerEl)       headerEl.style.transition       = 'none';
    if (beforeHeaderEl) beforeHeaderEl.style.transition = 'none';

    headerEl?.classList.add('header--hidden');
    beforeHeaderEl?.classList.add('before-header--hidden');

    requestAnimationFrame(function () {
        if (headerEl)       headerEl.style.removeProperty('transition');
        if (beforeHeaderEl) beforeHeaderEl.style.removeProperty('transition');
    });
}

// ── Body padding placeholder (keeps layout when chrome leaves document flow) ─
function setPlaceholderHeight(enable) {
    if (!headerEl) return;
    if (enable) {
        const bh = beforeHeaderEl ? beforeHeaderEl.offsetHeight : 0;
        document.body.style.paddingTop = (bh + headerEl.offsetHeight) + 'px';
    } else {
        document.body.style.removeProperty('padding-top');
    }
}

// ── Sticky state (relative ↔ fixed at 90vh) ───────────────────────────────────
let wasFixed = false;

function updateStickyState(scrollingDown) {
    if (isMobileMenuOpen()) return;

    const fixed              = isPastThreshold();
    const justBecameFixed    = fixed && !wasFixed;
    const justBecameRelative = !fixed && wasFixed;

    if (justBecameFixed) {
        setPlaceholderHeight(true);
    }

    headerEl?.classList.toggle('is-fixed', fixed);
    beforeHeaderEl?.classList.toggle('is-fixed', fixed);
    beforeHeaderEl?.classList.toggle('before-header--compact', fixed);

    if (fixed) {
        updateHeaderTop();
    } else {
        headerEl?.style.removeProperty('top');
    }

    if (justBecameFixed) {
        if (scrollingDown) {
            hideHeaderInstant();
        } else {
            showHeader();
        }
    }

    if (justBecameRelative) {
        setPlaceholderHeight(false);
        showHeader();
    }

    wasFixed = fixed;
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    wasFixed = isPastThreshold();
    updateStickyState(false);
});

window.addEventListener('resize', function () {
    if (isMobileMenuOpen()) return;
    updateStickyState(false);
});

// ── Mobile menu toggle ────────────────────────────────────────────────────────

const burgerEl = document.querySelector('.header-burger');
const menuCloseEl = document.querySelector('.mobile-menu__close');

function openMobileMenu() {
    // Keep chrome visible while the overlay is open
    showHeader();
    mobileMenuEl?.classList.add('active');
    document.body.classList.add('no-scroll');
    burgerEl?.setAttribute('aria-expanded', 'true');
}

function closeMobileMenu() {
    mobileMenuEl?.classList.remove('active');
    document.body.classList.remove('no-scroll');
    burgerEl?.setAttribute('aria-expanded', 'false');
    burgerEl?.focus({ preventScroll: true });
}

burgerEl?.addEventListener('click', openMobileMenu);
menuCloseEl?.addEventListener('click', closeMobileMenu);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isMobileMenuOpen()) {
        closeMobileMenu();
    }
});

// ── Header hide on scroll down / show on scroll up or stop ────────────────────
let lastScrollY = window.scrollY;
let ticking     = false;
let stopTimer   = null;
const SCROLL_STOP_MS = 180;

function updateHeaderVisibility() {
    if (isMobileMenuOpen()) {
        ticking = false;
        return;
    }

    const currentY      = window.scrollY;
    const scrollingDown = currentY > lastScrollY;

    updateStickyState(scrollingDown);

    if (isPastThreshold()) {
        if (scrollingDown) {
            headerEl?.classList.add('header--hidden');
            beforeHeaderEl?.classList.add('before-header--hidden');
        } else {
            showHeader();
        }
    }

    lastScrollY = currentY;
    ticking = false;
}

window.addEventListener('scroll', function () {
    if (isMobileMenuOpen()) return;

    clearTimeout(stopTimer);
    stopTimer = setTimeout(function () {
        if (isMobileMenuOpen()) return;
        // Reveal chrome when the user pauses scrolling (not only on scroll-up)
        if (isPastThreshold()) {
            showHeader();
        }
    }, SCROLL_STOP_MS);

    if (!ticking) {
        requestAnimationFrame(updateHeaderVisibility);
        ticking = true;
    }
}, { passive: true });
