const beforeHeaderEl = document.querySelector('.before-header');
const headerEl       = document.querySelector('.header');
const mobileMenuEl   = document.querySelector('.mobile-menu');

const STICKY_VH = 90;

// ── Helpers ───────────────────────────────────────────────────────────────────
function isPastThreshold() {
    return window.scrollY >= window.innerHeight * (STICKY_VH / 100);
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
    // Прибрати transition щоб не було flash-анімації
    if (headerEl)       headerEl.style.transition       = 'none';
    if (beforeHeaderEl) beforeHeaderEl.style.transition = 'none';

    headerEl?.classList.add('header--hidden');
    beforeHeaderEl?.classList.add('before-header--hidden');

    // Один rAF щоб браузер застосував стан без анімації, потім повернути transition
    requestAnimationFrame(function () {
        if (headerEl)       headerEl.style.removeProperty('transition');
        if (beforeHeaderEl) beforeHeaderEl.style.removeProperty('transition');
    });
}

// ── Body padding placeholder (компенсує вихід з потоку) ──────────────────────
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
    const fixed              = isPastThreshold();
    const justBecameFixed    = fixed && !wasFixed;
    const justBecameRelative = !fixed && wasFixed;

    if (justBecameFixed) {
        // Зафіксувати висоту ДО того як елементи вийдуть з потоку
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

window.addEventListener('resize', updateStickyState.bind(null, false));

// ── Mobile menu toggle ────────────────────────────────────────────────────────
document.querySelector('.header-burger')?.addEventListener('click', function () {
    mobileMenuEl.classList.add('active');
    document.body.classList.add('no-scroll');
});

document.querySelector('.mobile-menu__close')?.addEventListener('click', function () {
    mobileMenuEl.classList.remove('active');
    document.body.classList.remove('no-scroll');
});

// ── Header hide on scroll down / show on scroll up & stop ────────────────────
let lastScrollY = window.scrollY;
let ticking     = false;
let stopTimer   = null;

function updateHeaderVisibility() {
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
    clearTimeout(stopTimer);
    stopTimer = setTimeout(function () {
        showHeader();
        updateStickyState(false);
    }, 200);

    if (!ticking) {
        requestAnimationFrame(updateHeaderVisibility);
        ticking = true;
    }
}, { passive: true });