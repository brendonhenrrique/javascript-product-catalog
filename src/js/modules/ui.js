import { buscarProdutos } from "./api.js";

export function initSidebarToggle() {
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

export function createCard(produto) {
    const card = document.createElement('article');
    card.className = "product-card";

    const img = document.createElement('img');
    img.className = "product-card__image";
    img.src = produto.thumbnail;
    img.alt = produto.title;

    const h3 = document.createElement("h3");
    h3.className = "product-card__title";
    h3.textContent = produto.title;

    const rating = document.createElement("p");
    rating.className = "product-card__rating";
    rating.textContent = `★ ${produto.rating}`;

    const description = document.createElement("p");
    description.className = "product-card__description";
    description.textContent = produto.description;

    const footer = document.createElement("div");
    footer.className = "product-card__footer";

    const price = document.createElement("p");
    price.className = "product-card__price";
    price.textContent = produto.price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    const unit = document.createElement("p");
    unit.className = "product-card__unit";
    unit.textContent = `${produto.stock} Unid.`;

    footer.append(price, unit);

    card.append(img, h3, rating, description, footer);

    return card;
}

export async function renderizarProduto() {
    const listaProdutos = await buscarProdutos();
    const grid = document.querySelector('.catalog__grid');

    for (const produto of listaProdutos) {
        const card = createCard(produto);
        grid.appendChild(card);
    }
}

