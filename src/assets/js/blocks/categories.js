// Highlight the category link that matches ?category=… (default: all on /shop.html)
const categoryLinks = document.querySelectorAll('.categories__btn[data-category]');
if (!categoryLinks.length) {
    // no-op
} else {
    const params = new URLSearchParams(window.location.search);
    const current = params.get('category') || (window.location.pathname.includes('shop') ? 'all' : null);

    categoryLinks.forEach((link) => {
        const isActive = current !== null && link.dataset.category === current;
        link.classList.toggle('categories__btn--active', isActive);

        if (isActive) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}
