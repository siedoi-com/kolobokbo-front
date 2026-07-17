document.querySelectorAll('[data-select]').forEach(select => {
    const control = select.querySelector('[data-select-toggle]');
    const valueEl = select.querySelector('[data-select-value]');
    const clearBtn = select.querySelector('[data-select-clear]');
    const options = select.querySelectorAll('[data-select-option]');
    const placeholder = valueEl.textContent;

    function open() {
        if (select.classList.contains('select--disabled')) return;
        select.classList.add('select--open');
        control.setAttribute('aria-expanded', 'true');
        document.addEventListener('click', handleOutsideClick);
        document.addEventListener('keydown', handleEscape);
    }

    function close() {
        select.classList.remove('select--open');
        control.setAttribute('aria-expanded', 'false');
        document.removeEventListener('click', handleOutsideClick);
        document.removeEventListener('keydown', handleEscape);
    }

    function handleOutsideClick(e) {
        if (!select.contains(e.target)) close();
    }

    function handleEscape(e) {
        if (e.key === 'Escape') close();
    }

    control.addEventListener('click', () => {
        select.classList.contains('select--open') ? close() : open();
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            options.forEach(o => o.classList.remove('select__option--active'));
            option.classList.add('select__option--active');
            valueEl.textContent = option.textContent;
            select.classList.add('select--filled');
            close();
        });
    });

    clearBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        valueEl.textContent = placeholder;
        select.classList.remove('select--filled');
        options.forEach(o => o.classList.remove('select__option--active'));
    });
});