import { buscarProdutos } from "./api.js";

const btnStart = document.querySelector('.pagination__button--start');
const btnPrevious = document.querySelector('.pagination__button--previous');
const btnNext = document.querySelector('.pagination__button--next');
const btnEnd = document.querySelector('.pagination__button--end');


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

document.addEventListener('DOMContentLoaded', carregaPagina)

const estado = {
    paginaAtual: 1,
    limite: 8,
    total: 0
}

function calcularSkip() {
    return (estado.paginaAtual - 1) * estado.limite;
}

function calcularUltimaPagina() {
    return Math.ceil(estado.total / estado.limite);
}

async function carregaPagina() {
    const listaProdutos = await buscarProdutos(estado.limite, calcularSkip());
    const produtos = listaProdutos.products;
    const grid = document.querySelector('.catalog__grid');

    estado.total = listaProdutos.total
    grid.replaceChildren();

    for (const produto of produtos) {
        const card = createCard(produto);
        grid.appendChild(card);
    }

    atualizaRodape();
}

function atualizaRodape() {
    const skip = calcularSkip();
    const ultimaPagina = calcularUltimaPagina();
    const paginationText = document.querySelector('.pagination__info');
    const buttonNumber = document.querySelector('.pagination__button--number');

    if (estado.total === 0) {
        paginationText.textContent = "Mostrando 0 de 0 produtos";
        buttonNumber.textContent = 0;
    } else {
        const itemInicial = skip + 1;
        const itemFinal = Math.min(skip + estado.limite, estado.total);

        paginationText.textContent = `Mostrando ${itemInicial}-${itemFinal} de ${estado.total}`;
        buttonNumber.textContent = estado.paginaAtual;
    }

    const estaNaPrimeira = estado.paginaAtual <= 1;
    const estaNaUltima = estado.paginaAtual >= ultimaPagina;

    btnStart.classList.toggle('pagination__btn--disabled', estaNaPrimeira);
    btnPrevious.classList.toggle('pagination__btn--disabled', estaNaPrimeira);

    btnNext.classList.toggle('pagination__btn--disabled', estaNaUltima);
    btnEnd.classList.toggle('pagination__btn--disabled', estaNaUltima);
}

btnStart.addEventListener('click', () => {
    if (estado.paginaAtual > 1) {
        estado.paginaAtual = 1;
        carregaPagina();
    }
})

btnPrevious.addEventListener('click', () => {
    if (estado.paginaAtual > 1) {
        estado.paginaAtual = estado.paginaAtual - 1;
        carregaPagina();
    }
})

btnNext.addEventListener('click', () => {
    if (estado.paginaAtual < calcularUltimaPagina()) {
        estado.paginaAtual = estado.paginaAtual + 1;
        carregaPagina();
    }
})

btnEnd.addEventListener('click', () => {
    if (estado.paginaAtual < calcularUltimaPagina()) {
        estado.paginaAtual = calcularUltimaPagina();
        carregaPagina();
    }
})