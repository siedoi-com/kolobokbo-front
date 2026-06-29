const btns = document.querySelectorAll('.categories__btn');

btns.forEach(btn => {
    btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('categories__btn--active'));
        btn.classList.add('categories__btn--active');
    });
});