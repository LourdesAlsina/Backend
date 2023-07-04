import { Router } from "express";
import { cartManager } from "../controllers/CartManager.js";
import { cartModel } from "../models/cart.models.js";


const cartRouter = Router();

cartRouter.post("/", async (req, res) => {
  try {    
    const addCart = await cartManager.addCart();
    res.json({ message: "Producto agregado al carrito", addCart });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "error en el servidor" });
  }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    if (productId <= 0) {
      return res.status(404).json({ error: "Producto no válido" });
    }

    const cart = await cartManager.addProductsToCart(cartId, productId);

    if (!cart) {
      return res
        .status(404)
        .json({ error: `El carrito con el id ${cartId} no existe` });
    }
    res.json(cart);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "error en el servidor" });
  }
});

cartRouter.get("/:cid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);

    const cart = await cartManager.getCartsById(cartId);

    if (!cart) {
      return res
        .status(404)
        .json({ error: `El carrito con el id ${cartId} no existe` });
    }
    
    res.send(cart);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "error en el servidor" });
  }
});


cartRouter.get('/', async (req, res) => {
  try {
      const users = await cartModel.find()
      res.json({ status: 'success', payload: cart })
  } catch(err) {
      res.status(500).json({ status: 'error', error: err.message })
  }
})

cartRouter.post('/', async (req, res) => {
  const user = req.body
  try {
      const result = await userModel.create(cart)
      res.json({ status: 'success', payload: result })
  } catch(err) {
      res.status(500).json({ status: 'error', error: err.message })
  }
})

export default cartRouter;