import ProductDAO from "../Dao/product.mongo.dao";
import CartDAO from "../Dao/product.mongo.dao";
import ProductRepository from "../repositories/product.repository";
import CartRepository from "../repositories/cart.repository";
import UserDAO from "../Dao/user.mongo.dao";
import UserRepository from "../repositories/user.repository";


export const ProductService = new ProductRepository(new ProductDAO())
export const CartService = new CartRepository(new CartDAO())
export const UserService = new UserRepository(new UserDAO())