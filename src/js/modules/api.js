export async function buscarProdutos(limite, pular) {
  try {
    const produto = await fetch(`https://dummyjson.com/products?limit=${limite}&skip=${pular}&select=title,price,description,thumbnail,rating,stock`);
    const json = await produto.json();

    console.log(json);
    return json;
    
  } catch (err) {
    console.log('DEU ERRO ZÉ: ', err);
    return []; // Retorna um array vazio em caso de erro para não quebrar o loop
  }
}

export async function buscarPorCategoria(categoria, limite, pular) {
  try {
    const categorias = await fetch(`https://dummyjson.com/products/category/${categoria}?limit=${limite}&skip=${pular}&select=title,price,description,thumbnail,rating,stock`)
    const json = await categorias.json();
    console.log(json);
    
    return json;
  } catch (err) {
    console.log('DEU ERRO ZÉ: ', err);
    return []; // Retorna um array vazio em caso de erro para não quebrar o loop
  }
}