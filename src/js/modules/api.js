export async function buscarProdutos(limite, pular, sortBy = '', order = '') {
  try {
    const url = `https://dummyjson.com/products?limit=${limite}&skip=${pular}&sortBy=${sortBy}&order=${order}&select=title,price,description,thumbnail,rating,stock`

    const produto = await fetch(url);
    const json = await produto.json();

    return json;
  } catch (err) {
    console.log('DEU ERRO: ', err);
    return { products: [], total: 0 };
  }
}

export async function buscarPorCategoria(categoria, limite, pular, sortBy = '', order = '') {
  try {
    const url = `https://dummyjson.com/products/category/${categoria}?limit=${limite}&skip=${pular}&sortBy=${sortBy}&order=${order}&select=title,price,description,thumbnail,rating,stock`

    const categorias = await fetch(url);
    const json = await categorias.json();

    return json;
  } catch (err) {
    console.log('DEU ERRO: ', err);
    return { products: [], total: 0 };
  }
}

export async function buscarPorNome(nome, limite, pular, sortBy = '', order = '') {
  try {
    const url = `https://dummyjson.com/products/search?q=${nome}&limit=${limite}&skip=${pular}&sortBy=${sortBy}&order=${order}&select=title,price,description,thumbnail,rating,stock`

    const categorias = await fetch(url);
    const json = await categorias.json();

    return json;
  } catch (err) {
    console.log('DEU ERRO: ', err);
    return { products: [], total: 0 };
  }
}