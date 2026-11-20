import {
  fetchProducts,
  fetchProductsByCategory,
  searchProductsByName,
} from './api.js';

const ACTIVE_CATEGORY_CLASS = 'sidebar__button--active';
const DISABLED_BTN_CLASS = 'pagination__btn--disabled';
const COLLAPSED_LIST_CLASS = 'sidebar__list--collapsed';

const state = {
  currentPage: 1,
  limit: 8,
  total: 0,
  currentCategory: 'all',
  sortBy: '',
  order: '',
  searchQuery: '',
};

const elements = {
  grid: document.querySelector('.catalog__grid'),
  categoryList: document.getElementById('category-list'),
  toggleSidebarBtn: document.getElementById('toggle-btn'),
  sortSelect: document.getElementById('sort'),
  searchForm: document.querySelector('.header__search'),
  searchInput: document.querySelector('.header__search-input'),
  paginationInfo: document.querySelector('.pagination__info'),
  pageNumberBtn: document.querySelector('.pagination__button--number'),
  startBtn: document.querySelector('.pagination__button--start'),
  previousBtn: document.querySelector('.pagination__button--previous'),
  nextBtn: document.querySelector('.pagination__button--next'),
  endBtn: document.querySelector('.pagination__button--end'),
};

function calculateSkip() {
  return (state.currentPage - 1) * state.limit;
}

function calculateTotalPages() {
  return Math.ceil(state.total / state.limit);
}

function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';

  const img = document.createElement('img');
  img.className = 'product-card__image';
  img.src = product.thumbnail;
  img.alt = product.title;

  const title = document.createElement('h3');
  title.className = 'product-card__title';
  title.textContent = product.title;

  const rating = document.createElement('p');
  rating.className = 'product-card__rating';
  rating.textContent = `★ ${product.rating}`;

  const description = document.createElement('p');
  description.className = 'product-card__description';
  description.textContent = product.description;

  const footer = document.createElement('div');
  footer.className = 'product-card__footer';

  const price = document.createElement('p');
  price.className = 'product-card__price';
  price.textContent = product.price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const stock = document.createElement('p');
  stock.className = 'product-card__unit';
  stock.textContent = `${product.stock} Unid.`;

  footer.append(price, stock);
  card.append(img, title, rating, description, footer);

  return card;
}

function createSkeletonCard() {
  const card = document.createElement('article');
  card.className = 'product-card';

  const img = document.createElement('div');
  img.className = 'skeleton skeleton--image';

  const title = document.createElement('div');
  title.className = 'skeleton skeleton--title';

  const rating = document.createElement('div');
  rating.className = 'skeleton skeleton--rating';

  const description = document.createElement('div');
  description.className = 'skeleton skeleton--description';

  const footer = document.createElement('div');
  footer.className = 'product-card__footer';

  const price = document.createElement('div');
  price.className = 'skeleton skeleton--price';

  const unit = document.createElement('div');
  unit.className = 'skeleton skeleton--unit';

  footer.append(price, unit);
  card.append(img, title, rating, description, footer);

  return card;
}

function renderSkeletons() {
  const skeletons = Array.from({ length: state.limit }, createSkeletonCard);
  elements.grid.replaceChildren(...skeletons);
}

function renderEmptyState() {
  const container = document.createElement('div');
  container.className = 'catalog__empty';

  const title = document.createElement('h3');
  title.className = 'catalog__empty-title';
  title.textContent = state.searchQuery
    ? `Nenhum produto encontrado para "${state.searchQuery}"`
    : 'Nenhum produto encontrado';

  const text = document.createElement('p');
  text.className = 'catalog__empty-text';
  text.textContent =
    'Dica: nosso catálogo utiliza uma base internacional. Tente pesquisar termos em inglês (ex: phone, laptop, watch, shoes).';

  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.className = 'catalog__empty-btn';
  resetBtn.textContent = 'Ver todos os produtos';
  resetBtn.addEventListener('click', resetToAllProducts);

  container.append(title, text, resetBtn);
  elements.grid.replaceChildren(container);
}

function updatePaginationUI() {
  const skip = calculateSkip();
  const totalPages = calculateTotalPages();

  if (state.total === 0) {
    elements.paginationInfo.textContent = 'Mostrando 0 de 0 produtos';
    elements.pageNumberBtn.textContent = '0';
  } else {
    const startItem = skip + 1;
    const endItem = Math.min(skip + state.limit, state.total);

    elements.paginationInfo.textContent = `Mostrando ${startItem}-${endItem} de ${state.total}`;
    elements.pageNumberBtn.textContent = String(state.currentPage);
  }

  const isFirstPage = state.currentPage <= 1;
  const isLastPage = state.currentPage >= totalPages;

  elements.startBtn.classList.toggle(DISABLED_BTN_CLASS, isFirstPage);
  elements.previousBtn.classList.toggle(DISABLED_BTN_CLASS, isFirstPage);
  elements.nextBtn.classList.toggle(DISABLED_BTN_CLASS, isLastPage);
  elements.endBtn.classList.toggle(DISABLED_BTN_CLASS, isLastPage);
}

function setActiveCategoryButton(categoryName = null) {
  const currentActive = elements.categoryList.querySelector(`.${ACTIVE_CATEGORY_CLASS}`);
  if (currentActive) {
    currentActive.classList.remove(ACTIVE_CATEGORY_CLASS);
  }

  if (categoryName) {
    const targetButton = elements.categoryList.querySelector(
      `[data-category="${categoryName}"]`
    );
    if (targetButton) {
      targetButton.classList.add(ACTIVE_CATEGORY_CLASS);
    }
  }
}

async function loadProducts() {
  renderSkeletons();

  const skip = calculateSkip();
  let data;

  if (state.currentCategory === 'all' && state.searchQuery === '') {
    data = await fetchProducts(state.limit, skip, state.sortBy, state.order);
  } else if (state.currentCategory) {
    data = await fetchProductsByCategory(
      state.currentCategory,
      state.limit,
      skip,
      state.sortBy,
      state.order
    );
  } else {
    data = await searchProductsByName(
      state.searchQuery,
      state.limit,
      skip,
      state.sortBy,
      state.order
    );
  }

  state.total = data.total;

  if (data.products.length === 0) {
    renderEmptyState();
  } else {
    const cards = data.products.map(createProductCard);
    elements.grid.replaceChildren(...cards);
  }

  updatePaginationUI();
}

function resetToAllProducts() {
  elements.searchInput.value = '';
  setActiveCategoryButton('all');

  state.searchQuery = '';
  state.currentCategory = 'all';
  state.currentPage = 1;

  loadProducts();
}

function handleCategoryClick(event) {
  const categoryBtn = event.target.closest('.sidebar__button');
  if (!categoryBtn) return;

  const selectedCategory = categoryBtn.dataset.category;
  setActiveCategoryButton(selectedCategory);
  elements.searchInput.value = '';

  state.currentCategory = selectedCategory;
  state.searchQuery = '';
  state.currentPage = 1;

  loadProducts();
}

function handleSortChange() {
  const sortMap = {
    'price-asc': { sortBy: 'price', order: 'asc' },
    'price-desc': { sortBy: 'price', order: 'desc' },
    default: { sortBy: '', order: '' },
  };

  const selectedSort = sortMap[elements.sortSelect.value] || sortMap.default;
  state.sortBy = selectedSort.sortBy;
  state.order = selectedSort.order;
  state.currentPage = 1;

  loadProducts();
}

function handleSearchSubmit(event) {
  event.preventDefault();
  const query = elements.searchInput.value.trim();

  if (query === '') {
    resetToAllProducts();
    return;
  }

  setActiveCategoryButton(null);

  state.searchQuery = query;
  state.currentCategory = '';
  state.currentPage = 1;

  loadProducts();
}

function handleSearchClear() {
  if (elements.searchInput.value.trim() === '') {
    resetToAllProducts();
  }
}

function goToPage(newPage) {
  const totalPages = calculateTotalPages();
  if (newPage < 1 || newPage > totalPages || newPage === state.currentPage) {
    return;
  }

  state.currentPage = newPage;
  loadProducts();
}

export function initSidebarToggle() {
  const { categoryList, toggleSidebarBtn } = elements;
  if (!categoryList || !toggleSidebarBtn) return;

  toggleSidebarBtn.addEventListener('click', () => {
    const isCollapsed = categoryList.classList.toggle(COLLAPSED_LIST_CLASS);
    toggleSidebarBtn.textContent = isCollapsed ? 'Ver mais' : 'Ver menos';
  });
}

export function initCatalog() {
  elements.categoryList.addEventListener('click', handleCategoryClick);
  elements.sortSelect.addEventListener('change', handleSortChange);
  elements.searchForm.addEventListener('submit', handleSearchSubmit);
  elements.searchInput.addEventListener('search', handleSearchClear);

  elements.startBtn.addEventListener('click', () => goToPage(1));
  elements.previousBtn.addEventListener('click', () => goToPage(state.currentPage - 1));
  elements.nextBtn.addEventListener('click', () => goToPage(state.currentPage + 1));
  elements.endBtn.addEventListener('click', () => goToPage(calculateTotalPages()));

  loadProducts();
}