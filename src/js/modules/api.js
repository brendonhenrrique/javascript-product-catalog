export async function buscarProdutos(limite, pular) {
  try {
  const result = await fetch(`https://dummyjson.com/products?limit=${limite}&skip=${pular}&select=title,price,description,thumbnail,rating,stock`);
  const json = await result.json();

  return json;
  } catch (err) {
    console.log('DEU ERRO ZÉ: ', err);
    return []; // Retorna um array vazio em caso de erro para não quebrar o loop
  }
}
