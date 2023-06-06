import express from 'express';
import { Router } from 'express';
import ProductManager from '../controllers/ProductManager.js';

const router = Router();
const app = express();


app.use(express.json());


const productManager = new ProductManager('../JSON/ProductManager.json');

const getProducts = async () => {
  await productManager.initialize();
  return productManager.getProduct();
};

router.get('/', async (req, res) => {
  const { limit } = req.query;
  let result = await getProducts();

  if (limit) {
    result = result.slice(0, Number(limit));
  }

  res.status(200).json(result);
});

router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }

  res.status(200).json(product);
});

router.post("/", (req, res) => {
  const { title, description, price, code, stock, category, thumbnails } = req.body;
  const id = generateId();

  const newProduct = {
    id,
    title,
    description,
    price,
    code,
    stock,
    category,
    thumbnails,
    status: true,
  };
  
  if (!title || !description || !code || !price || !stock || !category) {
    return res
      .status(400)
      .json({ error: "Todos los campos son obligatorios" });
  }

  products.push(newProduct);
  saveProductsToJSON(products);

  res.status(201).json({ message: `Producto agregado: ${id}` });
});


router.post("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const data = req.body;
  const productIndex = products.findIndex((item) => item.id === id);

  if (productIndex === -1) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }

  products[productIndex] = { ...products[productIndex], ...data };
  saveProductsToJSON(products);

  res.status(200).json({ message: `Producto actualizado: ${id}` });
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = products.length;
  products = products.filter(item => item.id !== id);
  if (products.length === initialLength) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }
  res.json({ message: `Producto eliminado = ${id}` });
});

export default router;
