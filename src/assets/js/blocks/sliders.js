// import 'keen-slider/keen-slider.min.css';
// import KeenSlider from 'keen-slider';
import EmblaCarousel from 'embla-carousel';

// ─── Shared slider controls (arrows + pagination dots) ─────────────────────
function initSliderControls(emblaNode, embla, controlsRoot = emblaNode) {
    const prevBtn = controlsRoot.querySelector('.slider-controls__button--prev');
    const nextBtn = controlsRoot.querySelector('.slider-controls__button--next');
    const paginationEl = controlsRoot.querySelector('.slider-controls__pagination');
   
    if (prevBtn) prevBtn.addEventListener('click', () => embla.scrollPrev());
    if (nextBtn) nextBtn.addEventListener('click', () => embla.scrollNext());

    if (paginationEl) {
        function createDots() {
            paginationEl.innerHTML = '';
            embla.scrollSnapList().forEach((_, idx) => {
                const dot = document.createElement('div');
                dot.classList.add('slider-controls__pagination-item');
                dot.addEventListener('click', () => embla.scrollTo(idx));
                paginationEl.appendChild(dot);
            });
            updateDots();
        }

        function updateDots() {
            const selected = embla.selectedScrollSnap();
            paginationEl.querySelectorAll('.slider-controls__pagination-item').forEach((dot, idx) => {
                dot.classList.toggle('active', idx === selected);
            });
        }

        embla.on('init', createDots);
        embla.on('select', updateDots);
        embla.on('reInit', createDots);
    }
}

document.querySelectorAll('.hero__slider').forEach(item => {
    const parent_el = item.closest('.hero');
    const emblaApi = EmblaCarousel(item, { loop: true });

    parent_el.querySelector('.hero__slider-button--prev')?.addEventListener('click', () => emblaApi.scrollPrev());
    parent_el.querySelector('.hero__slider-button--next')?.addEventListener('click', () => emblaApi.scrollNext());
});

// ─── About Slider: Embla center mode ~2.5 slides ───────────────────────────
document.querySelectorAll('.embla--about-slider').forEach(emblaNode => {
    const viewport = emblaNode.querySelector('.embla__viewport');
    if (!viewport) return;

    const embla = EmblaCarousel(viewport, {
        loop: true,
        align: 'center',
    });

    const prevBtn = emblaNode.querySelector('.about-slider__prev');
    const nextBtn = emblaNode.querySelector('.about-slider__next');
    const paginationEl = emblaNode.querySelector('.about-slider__pagination');

    if (prevBtn) prevBtn.addEventListener('click', () => embla.scrollPrev());
    if (nextBtn) nextBtn.addEventListener('click', () => embla.scrollNext());

    if (paginationEl) {
        function createDots() {
            paginationEl.innerHTML = '';
            embla.scrollSnapList().forEach((_, idx) => {
                const dot = document.createElement('div');
                dot.classList.add('ingredients__pagination-item');
                dot.addEventListener('click', () => embla.scrollTo(idx));
                paginationEl.appendChild(dot);
            });
            updateDots();
        }

        function updateDots() {
            const selected = embla.selectedScrollSnap();
            paginationEl.querySelectorAll('.ingredients__pagination-item').forEach((dot, idx) => {
                dot.classList.toggle('active', idx === selected);
            });
        }

        embla.on('init', createDots);
        embla.on('select', updateDots);
        embla.on('reInit', createDots);
    }
});

// document.querySelectorAll('.logos__slider').forEach(item => {
//     const animation = {duration: 20000, easing: (t) => t}
//
//     const slider = new KeenSlider(item, {
//         loop: true,
//         slides: {perView: 3.5, spacing: 16,},
//         breakpoints: {
//             "(min-width: 768px)": {
//                 slides: {perView: 4.2, spacing: 20},
//             },
//             "(min-width: 992px)": {
//                 slides: {perView: 5.3, spacing: 32},
//             },
//             "(min-width: 1200px)": {
//                 slides: {perView: 6, spacing: 90},
//             },
//         },
//         created(s) {
//             s.moveToIdx(5, true, animation);
//         },
//         updated(s) {
//             s.moveToIdx(s.track.details.abs + 5, true, animation)
//         },
//         animationEnded(s) {
//             s.moveToIdx(s.track.details.abs + 5, true, animation)
//         },
//     });
// });

// ─── Logos marquee ──────────────────────────────────────────────────────────
document.querySelectorAll('.logos__marquee').forEach(marquee => {
    const track = marquee.querySelector('.logos__track');
    if (!track) return;

    const originalSet = track.innerHTML;

    function fill() {
        track.innerHTML = originalSet;

        const containerW = marquee.offsetWidth;
        if (!containerW) return;

        // Ensure one "set" fills at least the container width (max 20 iterations guard)
        let iterations = 0;
        while (track.scrollWidth < containerW && iterations < 20) {
            track.innerHTML += originalSet;
            iterations++;
        }

        // Duplicate content to create seamless loop (-50% animation)
        const halfContent = track.innerHTML;
        track.innerHTML = halfContent + halfContent;
    }

    // Wait for images to load so scrollWidth is accurate
    window.addEventListener('load', fill);
    window.addEventListener('resize', fill);
});

// ─── Ingredients Slider: Embla ──────────────────────────────────────────────
document.querySelectorAll('.embla--ingredients-slider').forEach(emblaNode => {
    const viewport = emblaNode.querySelector('.embla__viewport');
    if (!viewport) return;

    const embla = EmblaCarousel(viewport, {
        loop: true,
        align: 'start',
    });

    initSliderControls(emblaNode, embla);
});

// .embla--testimonials-slider

document.querySelectorAll('.embla--testimonials-slider').forEach(emblaNode => {
    const viewport = emblaNode.querySelector('.embla__viewport');
    const container = emblaNode.querySelector('.embla__container');
    if (!viewport || !container) return;

    const controlsRoot = emblaNode.closest('.testimonials');
    const allCards = Array.from(container.querySelectorAll('.embla__slide'));
    const cardsData = allCards.map(card => card.innerHTML);

    const MOBILE_MAX = 1023.98;
    const SWAP_MAX = 1439.98;
    const ACTIVE_SLOT_POS = 1; 

    let mode = null; 
    let embla = null;
    let windowSize = 3;
    let slots = [];
    let anchorIndex = 0; 

    function mod(n, m) {
        return ((n % m) + m) % m;
    }

    function currentMode() {
        return window.innerWidth <= MOBILE_MAX ? 'scroll' : 'window';
    }

    function currentWindowSize() {
        return window.innerWidth <= SWAP_MAX ? 3 : 4;
    }

    // ─── scroll (mobile) ──────────────────────────────
    function updateScrollCenterClass() {
        if (!embla) return;
        const selected = embla.selectedScrollSnap();
        allCards.forEach((card, idx) => {
            card.classList.toggle('is-center', idx === selected);
        });
    }

    function enableScrollMode() {
        embla = EmblaCarousel(viewport, { loop: true, align: 'start' });
        embla.on('init', updateScrollCenterClass);
        embla.on('select', updateScrollCenterClass);
        embla.on('reInit', updateScrollCenterClass);
    }

    function disableScrollMode() {
        if (embla) {
            embla.destroy();
            embla = null;
        }
    }

    // ─── window (L: 3, XL: 4 )
    function renderContent() {
        slots.forEach((slot, slotPos) => {
            const dataIndex = mod(anchorIndex + slotPos - ACTIVE_SLOT_POS, cardsData.length);
            slot.innerHTML = cardsData[dataIndex];
            slot.dataset.index = dataIndex;
            slot.classList.toggle('is-center', slotPos === ACTIVE_SLOT_POS);
        });
    }

    function goTo(dataIndex) {
        anchorIndex = mod(dataIndex, cardsData.length);
        renderContent();
    }

    function slotClickHandler(e) {
        goTo(Number(e.currentTarget.dataset.index));
    }

    function enableWindowMode(size) {
        windowSize = Math.min(size, cardsData.length);
        slots = allCards.slice(0, windowSize);
        allCards.forEach(card => { card.style.display = 'none'; });
        slots.forEach(slot => {
            slot.style.display = '';
            slot.addEventListener('click', slotClickHandler);
        });

        anchorIndex = 0;
        renderContent();
    }

    function disableWindowMode() {
        allCards.forEach((card, i) => {
            card.style.display = '';
            card.classList.remove('is-center');
            card.innerHTML = cardsData[i];
            card.removeEventListener('click', slotClickHandler);
        });
        slots = [];
    }

    function handlePrev() {
        if (mode === 'window') {
            goTo(anchorIndex - 1);
        } else if (embla) {
            embla.scrollPrev();
        }
    }

    function handleNext() {
        if (mode === 'window') {
            goTo(anchorIndex + 1);
        } else if (embla) {
            embla.scrollNext();
        }
    }

    const prevBtn = controlsRoot.querySelector('.slider-controls__button--prev');
    const nextBtn = controlsRoot.querySelector('.slider-controls__button--next');
    if (prevBtn) prevBtn.addEventListener('click', handlePrev);
    if (nextBtn) nextBtn.addEventListener('click', handleNext);

    function applyMode() {
        const newMode = currentMode();
        const newWindowSize = currentWindowSize();
        const sizeChanged = newMode === 'window' && windowSize !== newWindowSize;

        if (newMode === mode && !sizeChanged) return;

        if (mode === 'scroll') disableScrollMode();
        if (mode === 'window') disableWindowMode();

        mode = newMode;

        if (mode === 'scroll') enableScrollMode();
        if (mode === 'window') enableWindowMode(newWindowSize);
    }

    applyMode();
    window.addEventListener('resize', applyMode);
});

// ─── Blog Slider: Embla ─────────────────────────────────────────────────────
document.querySelectorAll('.embla--blog-slider').forEach(emblaNode => {
    const viewport = emblaNode.querySelector('.embla__viewport');
    if (!viewport) return;

    const embla = EmblaCarousel(viewport, {
        loop: true,
        align: 'start',
    });

    initSliderControls(emblaNode, embla);
});

// ─── Related Products: Embla slider ─────────────
document.querySelectorAll('.related-products__carousel').forEach(emblaNode => {
    const viewport = emblaNode.querySelector('.embla__viewport');
    if (!viewport) return;

    const embla = EmblaCarousel(viewport, {
        loop: false,
        align: 'start',
    });

    initSliderControls(emblaNode, embla);
});

// ─── About team: photo slider ───────────────────────────────────────────────
document.querySelectorAll('.embla--team-slider').forEach(function (emblaNode) {
    var viewport = emblaNode.querySelector('.embla__viewport');
    if (!viewport) return;

    var embla = EmblaCarousel(viewport, {
        loop: true,
        align: 'start',
    });

    initSliderControls(emblaNode, embla);
});

// ─── Succes Recommend: Embla slider ─────────────
document.querySelectorAll('.embla--success-slider').forEach(function (emblaNode) {
    var viewport = emblaNode.querySelector('.embla__viewport');
    if (!viewport) return;

    var embla = EmblaCarousel(viewport, {
        loop: false,
        align: 'start',
    });

    initSliderControls(emblaNode, embla);
});

// ─── Single product: Embla image slider ─────────────────────────────────────
document.querySelectorAll('.js-product-slider').forEach(emblaNode => {
    const wrap = emblaNode.closest('.sp-preview__image-wrap');
    if (!wrap) return;

    const embla = EmblaCarousel(emblaNode, { loop: true });

    const prevBtn = wrap.querySelector('.js-gallery-prev');
    const nextBtn = wrap.querySelector('.js-gallery-next');
    const dots = wrap.querySelectorAll('.sp-preview__gallery-dot');

    if (prevBtn) prevBtn.addEventListener('click', () => embla.scrollPrev());
    if (nextBtn) nextBtn.addEventListener('click', () => embla.scrollNext());

    function updateDots() {
        const idx = embla.selectedScrollSnap();
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => embla.scrollTo(i));
    });

    embla.on('select', updateDots);
    embla.on('init', updateDots);

    // ─── Autoplay 3s ───
    let autoplayId = 0;

    const startAutoplay = () => {
        autoplayId = window.setInterval(() => {
            if (embla.canScrollNext()) {
                embla.scrollNext();
            } else {
                embla.scrollTo(0);
            }
        }, 3000);
    };

    const stopAutoplay = () => {
        window.clearInterval(autoplayId);
        autoplayId = 0;
    };

    embla.on('pointerDown', stopAutoplay);
    embla.on('settle', () => {
        if (!autoplayId) setTimeout(startAutoplay, 2000);
    });

    startAutoplay();
});

// ─── Single product: Quantity buttons ───────────────────────────────────────
document.querySelectorAll('.sp-preview__qty-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const wrap = this.closest('.sp-preview__quantity');
        const input = wrap?.querySelector('.sp-preview__qty-input');
        if (!input) return;

        const val = parseInt(input.value) || 1;
        const min = parseInt(input.min) || 1;
        const max = parseInt(input.max) || 99;

        input.value = this.classList.contains('sp-preview__qty-btn--minus')
            ? Math.max(min, val - 1)
            : Math.min(max, val + 1);

        // Sync to AJAX add-to-cart button
        const atcBtn = document.querySelector('.ajax_add_to_cart[data-product_id]');
        if (atcBtn) atcBtn.setAttribute('data-quantity', input.value);
    });
});
