export default fetch('https://dummyjson.com/products?limit=8&skip=16&select=title,price')
    .then(res => res.json())
    .then(console.log)
    .catch(err => console.log('DEU ERRO ZÉ: ', err))