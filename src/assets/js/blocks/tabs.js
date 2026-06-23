document.querySelectorAll('[data-tab-id]').forEach(item => item.addEventListener('click', function () {
    document.querySelectorAll('[data-tab-id]').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('[data-tab-content]').forEach(el => el.classList.remove('active'));

    const activeTab = item.getAttribute('data-tab-id');

    item.classList.add('active');
    document.querySelector(`[data-tab-content=${activeTab}]`).classList.add('active');
}));