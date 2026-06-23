import 'keen-slider/keen-slider.min.css';
import KeenSlider from 'keen-slider';
import EmblaCarousel from 'embla-carousel';

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

document.querySelectorAll('.ingredients__slider').forEach(item => {
    const parent_el = item.closest('.ingredients');
    const paginationEl = parent_el.querySelector('.ingredients__pagination');

    const slider = new KeenSlider(item, {
        loop: true,
    }, [navigation]);

    parent_el.querySelector('.ingredients__button--prev')?.addEventListener('click', () => slider.prev());
    parent_el.querySelector('.ingredients__button--next')?.addEventListener('click', () => slider.next());

    function navigation(slider) {
        function createPagination() {
            paginationEl.innerHTML = '';
            slider.track.details.slides.forEach((_, idx) => {
                const dot = document.createElement('div');
                dot.classList.add('ingredients__pagination-item');
                dot.addEventListener('click', () => slider.moveToIdx(idx));
                paginationEl.appendChild(dot);
            });
            updatePagination();
        }

        function updatePagination() {
            const current = slider.track.details.rel;
            paginationEl.querySelectorAll('.ingredients__pagination-item').forEach((dot, idx) => {
                dot.classList.toggle('active', idx === current);
            });
        }

        slider.on('created', createPagination);
        slider.on('slideChanged', updatePagination);
        slider.on('updated', updatePagination);
    }
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