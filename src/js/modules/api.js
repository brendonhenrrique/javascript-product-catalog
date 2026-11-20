const BASE_URL = 'https://dummyjson.com/products';
const SELECTED_FIELDS = 'title,price,description,thumbnail,rating,stock';

async function fetchFromApi(endpoint, params = {}) {
  try {
    const queryParams = new URLSearchParams({
      ...params,
      select: SELECTED_FIELDS,
    });

    const response = await fetch(`${BASE_URL}${endpoint}?${queryParams}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return { products: [], total: 0 };
  }
}

export function fetchProducts(limit, skip, sortBy = '', order = '') {
  return fetchFromApi('', { limit, skip, sortBy, order });
}

export function fetchProductsByCategory(category, limit, skip, sortBy = '', order = '') {
  return fetchFromApi(`/category/${encodeURIComponent(category)}`, {
    limit,
    skip,
    sortBy,
    order,
  });
}

export function searchProductsByName(query, limit, skip, sortBy = '', order = '') {
  return fetchFromApi('/search', {
    q: query,
    limit,
    skip,
    sortBy,
    order,
  });
}