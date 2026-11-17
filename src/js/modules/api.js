export async function buscarProdutos() {
  try {
    const res = await fetch('https://dummyjson.com/products?limit=8&skip=0&select=title,price,description,thumbnail,rating,stock');
    const json = await res.json();
    
    // Retorna diretamente o array de produtos para quem chamou a função
    return json.products; 
  } catch (err) {
    console.log('DEU ERRO ZÉ: ', err);
    return []; // Retorna um array vazio em caso de erro para não quebrar o loop
  }
}
