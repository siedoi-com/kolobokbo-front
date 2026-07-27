// ─── Message popup: shown after contact form submit ────────────────────────
function initMessagePopup() {
    var overlay = document.querySelector('[data-message-popup-overlay]');
    var popup = document.querySelector('[data-message-popup]');
    if (!overlay || !popup) return;

    var closeButtons = popup.querySelectorAll('[data-message-popup-close], .message-popup__close');

    function open() {
        overlay.classList.add('active');
        popup.classList.add('active');
    }

    function close() {
        overlay.classList.remove('active');
        popup.classList.remove('active');
    }

    overlay.addEventListener('click', close);

    for (var i = 0; i < closeButtons.length; i++) {
        closeButtons[i].addEventListener('click', close);
    }

    window.openMessagePopup = open;
}

initMessagePopup();