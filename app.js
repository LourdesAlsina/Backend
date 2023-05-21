import express from 'express';
import fs from 'fs';

const app = express();

class ProductManager {
  constructor(path) {
    this.path = path;
    this.format = 'utf-8';
    this.#product = [];
    this.getProduct();
  }

  #product = [];

  getProductById = (id) => {
    const product = this.#product.find(item => item.id === id);
    if (!product) return 'producto no encontrado';
    else return product;
  };

  getProduct = async () => {
    try {
      const data = await fs.promises.readFile(this.path, this.format);
      this.#product = JSON.parse(data);
    } catch (error) {
      console.log('Error al leer el archivo de productos:', error);
    }
  };
}

const productManager = new ProductManager('./ProductManager.json');

app.get('/', (req, res) => {
  console.log('Solicitud recibida');
  res.send('<h1>Bienvenida a LOLA clothes</h1>');
});

app.get('/product', async (req, res) => {
  console.log('Solicitud recibida');
  await productManager.getProduct();
  const products = productManager.#products;
  
 
  const limit = parseInt(req.query.limit);
  if (!isNaN(limit) && limit > 0) {
    res.send(products.slice(0, limit));
  } else {
    res.send(products);
  }
});

app.get('/products/:id', (req, res) => {
  const id = req.params.id;
  const product = productManager.getProductById(id);
  if (product === 'producto no encontrado') {
    res.send({ error: 'Producto no encontrado' });
  } else {
    res.send(product);
  }
});

app.listen(8080, () => console.log('Server up'));
