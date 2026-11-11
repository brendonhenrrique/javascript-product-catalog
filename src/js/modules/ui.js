
export default function initSidebarToggle() {
    const categoryList = document.getElementById('category-list');
    const toggleBtn = document.getElementById('toggle-btn');

    if (categoryList && toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            categoryList.classList.toggle('sidebar__list--collapsed');

            if (categoryList.classList.contains('sidebar__list--collapsed')) {
                toggleBtn.textContent = 'Ver mais';
            } else {
                toggleBtn.textContent = 'Ver menos';
            }
        });
    }
}
