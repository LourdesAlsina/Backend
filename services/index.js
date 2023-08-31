import ProductDAO from "../Dao/product.mongo.dao";
import CartDAO from "../Dao/product.mongo.dao";
import ProductRepository from "../repositories/product.repository";
import CartRepository from "../repositories/cart.repository";


export const ProductService = new ProductRepository(new ProductDAO())
export const CartService = new CartRepository(new CartDAO())