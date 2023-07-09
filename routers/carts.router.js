import { Router } from "express";
import { cartModel } from "../models/cart.models.js";
import { productModel } from '../models/product.models.js';


const cartRouter = Router();

cartRouter.post("/", async (req, res) => {
  try {
    const cart = req.body;
    const addCart = await cartModel.create(cart);
    res.json({ status: "success", payload: addCart });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});


cartRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await productModel.findById(pid);
    if (!product) {
      return res.status(404).json({ error: "Producto no válido" });
    }
    const cid = req.params.cid;
    const cart = await cartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no válido" });
    }
    const existingProductIndex = cart.products.findIndex(
      (item) => item.product.toString() === pid
    );
    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += 1;
    } else {
      const newProduct = {
        product: pid,
        quantity: 1,
      };
      cart.products.push(newProduct);
    }
    const result = await cart.save();
    res.json({ status: "success", payload: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
});

cartRouter.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      return res
        .status(404)
        .json({ error: `El carrito con el id: ${cartId} no existe` });
    }
    res.send(cart);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});


/*cartRouter.get('/', async (req, res) => {
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
})*/

export default cartRouter;