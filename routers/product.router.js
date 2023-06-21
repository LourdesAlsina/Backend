import { Router } from 'express';
import ProductManager from '../controllers/ProductManager.js';

const router = Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
  try {
    const products = await productManager.getProduct();
    const limit = req.query.limit;
    if (limit) {
      const limitedProducts = products.slice(0, limit);
      res.json({ productos: limitedProducts });
    } else {
      res.json({ productos: products });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);
    console.log(product)
    if (!product) {
      return res.status(404).json({
        error: `El producto con el id ${productId} no se ha encontrado`,
      });
    }
    res.json({ product: product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.post('/', async (req, res) => {
  try {
    let {
      title,
      description,
      price,
      thumbnail,
      code,
      category,
      stock,
      status,
    } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    const addProduct = await productManager.addProduct(
      title,
      description,
      price,
      thumbnail,
      code,
      category,
      stock,
      (status = true)
    );

    if (addProduct) {
      return res.status(201).json({
        message: "Producto agregado exitosamente",
        product: addProduct,
      });
    }
    return res.status(404).json({ error: "Error al agregar el producto" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "error en el servidor" });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    if (req.body.id !== productId && req.body.id !== undefined) {
      return res
        .status(404)
        .json({ error: 'No se puede modificar el id del producto' });
    }

    const updated = req.body;

    const productFind = await productManager.getProductById(productId);

    if (!productFind) {
      return res
        .status(404)
        .json({ error: `No existe el producto con el id: ${productId}` });
    }

    await productManager.updateProduct(productId, updated);

    res.json({ message: `Actualizando el producto con el id: ${productId}` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const products = await productManager.getProduct();

    const productFind = await products.find((prod) => prod.id === productId);

    if (!productFind) {
      return res
        .status(404)
        .json({ error: `No existe el producto con el id: ${productId}` });
    }
    const deleteProduct = await productManager.deleteProduct(productId);
    console.log(deleteProduct);

    res.json({
      message: `Producto con el id ${productId} eliminado con exito`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});


export default router;