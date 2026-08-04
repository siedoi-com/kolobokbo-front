const cartButton = document.querySelector('.header__cart-button');
const miniCart = document.querySelector('[data-mini-cart]');
const overlay = document.querySelector('[data-mini-cart-overlay]');
const closeBtn = miniCart?.querySelector('.mini-cart__close');

if (cartButton && miniCart) {
    function updateCartLabel() {
        const count = miniCart.querySelectorAll('.cart-item').length;
        cartButton.setAttribute('aria-label', `Кошик, ${count} товари`);
    }

    function openCart() {
        miniCart.classList.add('active');
        overlay?.classList.add('active');
        cartButton.setAttribute('aria-expanded', 'true');
        document.body.classList.add('no-scroll');

        document.addEventListener('click', handleOutsideClick);
        document.addEventListener('keydown', handleEscape);
    }

    function closeCart() {
        miniCart.classList.remove('active');
        overlay?.classList.remove('active');
        cartButton.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');

        document.removeEventListener('click', handleOutsideClick);
        document.removeEventListener('keydown', handleEscape);
    }

    function handleOutsideClick(e) {
        if (!miniCart.contains(e.target) && !cartButton.contains(e.target)) {
            closeCart();
        }
    }

    function handleEscape(e) {
        if (e.key === 'Escape') closeCart();
    }

    cartButton.addEventListener('click', function (e) {
        e.preventDefault();
        miniCart.classList.contains('active') ? closeCart() : openCart();
    });

    closeBtn?.addEventListener('click', closeCart);

    overlay?.addEventListener('click', closeCart);

    updateCartLabel();
}