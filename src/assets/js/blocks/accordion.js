document.querySelectorAll('[data-accordion-item-title]').forEach(item => item.addEventListener('click', function () {
    const parent_item_el = item.closest('[data-accordion-item]');
    const panel_item_el = parent_item_el.querySelector('[data-accordion-item-panel]');
    const is_active = parent_item_el.classList.contains('active');

    // Close all other items in the same list
    const faq_list = parent_item_el.closest('.faq__list');
    if (faq_list) {
        faq_list.querySelectorAll('[data-accordion-item].active').forEach(open_item => {
            if (open_item !== parent_item_el) {
                open_item.classList.remove('active');
                open_item.querySelector('[data-accordion-item-panel]').style.maxHeight = null;
                open_item.querySelector('[data-accordion-item-title]').setAttribute('aria-expanded', 'false');
            }
        });
    }

    parent_item_el.classList.toggle('active', !is_active);
    item.setAttribute('aria-expanded', String(!is_active));

    if (!is_active) {
        const paddingBuffer = parseFloat(getComputedStyle(document.documentElement).fontSize) * 5;
        panel_item_el.style.maxHeight = (panel_item_el.scrollHeight + paddingBuffer) + 'px';
    } else {
        panel_item_el.style.maxHeight = null;
    }
}));