export async function buscarProdutos(limite, pular, sortBy = '', order = '') {
  try {
    const produto = await fetch(`https://dummyjson.com/products?limit=${limite}&skip=${pular}&sortBy=${sortBy}&order=${order}&select=title,price,description,thumbnail,rating,stock`);
    const json = await produto.json();
    return json;
  } catch (err) {
    console.log('DEU ERRO ZÉ: ', err);
    return [];
  }
}

export async function buscarPorCategoria(categoria, limite, pular, sortBy = '', order = '') {
  try {
    const categorias = await fetch(`https://dummyjson.com/products/category/${categoria}?limit=${limite}&skip=${pular}&sortBy=${sortBy}&order=${order}&select=title,price,description,thumbnail,rating,stock`);
    const json = await categorias.json();
    return json;
  } catch (err) {
    console.log('DEU ERRO ZÉ: ', err);
    return [];
  }
}