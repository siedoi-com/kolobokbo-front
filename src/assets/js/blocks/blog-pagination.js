// ─── Blog grid: paginate articles, item count per page depends on breakpoint ──
function initBlogPagination(grid) {
    var controlsRoot = grid.closest('.blog-list');
    if (!controlsRoot) return;

    controlsRoot = controlsRoot.querySelector('.blog-list__slider-controls');
    if (!controlsRoot) return;

    var cards = Array.prototype.slice.call(grid.children);

    var prevBtn = controlsRoot.querySelector('.slider-controls__button--prev');
    var nextBtn = controlsRoot.querySelector('.slider-controls__button--next');
    var paginationEl = controlsRoot.querySelector('.slider-controls__pagination');

    var currentPage = 0;
    var perPage = 5;
    var totalPages = 1;

    function getPerPage() {
        var width = window.innerWidth;
        if (width >= 1440) {
            return 9; // XL
        }
        if (width >= 1024) {
            return 9; // L
        }
        return 4; // mobile
    }

    function renderDots() {
        paginationEl.innerHTML = '';
        for (var i = 0; i < totalPages; i++) {
            var dot = document.createElement('button');
            dot.type = 'button';
            dot.classList.add('slider-controls__pagination-item');
            dot.setAttribute('aria-label', 'Сторінка ' + (i + 1));
            dot.setAttribute('data-page', i);
            dot.addEventListener('click', onDotClick);
            paginationEl.appendChild(dot);
        }
        updateDots();
    }

    function onDotClick(event) {
        var page = Number(event.currentTarget.getAttribute('data-page'));
        goToPage(page);
    }

    function updateDots() {
        var dots = paginationEl.querySelectorAll('.slider-controls__pagination-item');
        for (var i = 0; i < dots.length; i++) {
            if (i === currentPage) {
                dots[i].classList.add('active');
            } else {
                dots[i].classList.remove('active');
            }
        }
    }

    function showPage(page) {
    var start = page * perPage;
    var end = start + perPage;
    var lastVisibleIndex = Math.min(end, cards.length) - 1;

    for (var i = 0; i < cards.length; i++) {
        if (i >= start && i < end) {
            cards[i].style.display = '';
        } else {
            cards[i].style.display = 'none';
        }

        if (i === lastVisibleIndex) {
            cards[i].classList.add('article-card--wide');
        } else {
            cards[i].classList.remove('article-card--wide');
        }
     }
    }

    function goToPage(page) {
        if (page < 0) {
            page = 0;
        }
        if (page > totalPages - 1) {
            page = totalPages - 1;
        }
        currentPage = page;
        showPage(currentPage);
        updateDots();
    }

    function goToPrevPage() {
        goToPage(currentPage - 1);
    }

    function goToNextPage() {
        goToPage(currentPage + 1);
    }

    function recalc() {
        var newPerPage = getPerPage();
        var changed = newPerPage !== perPage;
        perPage = newPerPage;
        totalPages = Math.ceil(cards.length / perPage);

        if (changed) {
            currentPage = 0;
        } else if (currentPage > totalPages - 1) {
            currentPage = totalPages - 1;
        }

        renderDots();
        showPage(currentPage);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', goToPrevPage);
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', goToNextPage);
    }

    recalc();
    window.addEventListener('resize', recalc);
}

var blogGrids = document.querySelectorAll('.blog-list__grid');
for (var i = 0; i < blogGrids.length; i++) {
    initBlogPagination(blogGrids[i]);
}