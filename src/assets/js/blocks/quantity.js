document.addEventListener('DOMContentLoaded', function () {
    // Event delegation for dynamically loaded cart fragments (AJAX updates)
    document.body.addEventListener('click', function (e) {
        if (e.target.matches('.quantity .plus') || e.target.matches('.quantity .minus')) {
            e.preventDefault();

            const btn = e.target;
            const container = btn.closest('.quantity');
            const input = container.querySelector('input.qty');

            if (!input) return;

            let val = parseFloat(input.value);
            const max = parseFloat(input.getAttribute('max'));
            const min = parseFloat(input.getAttribute('min'));
            const step = parseFloat(input.getAttribute('step')) || 1;

            if (isNaN(val)) val = 0;

            if (btn.classList.contains('plus')) {
                if (max && (max === val || val > max)) {
                    input.value = max;
                } else {
                    input.value = val + step;
                }
            } else {
                if (min && (min === val || val < min)) {
                    input.value = min;
                } else if (val > 1) { // Default minimum visually is often 1
                    input.value = val - step;
                }
            }

            // Trigger change event to notify WooCommerce to update the cart
            const event = new Event('change', { bubbles: true });
            input.dispatchEvent(event);

            // For jQuery dependencies in WooCommerce
            if (typeof jQuery !== 'undefined') {
                jQuery(input).trigger('change');

                // Automatically update cart if we're on the cart page
                jQuery('[name="update_cart"]').prop('disabled', false).trigger('click');
            }
        }
    });
});