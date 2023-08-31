import fs from 'fs';
import { __dirname } from "../../../utils.js";


export default class ProductManager {
  #product;
  #format;
  #path;
    constructor() {
      this.#path = "./JSON/ProductManager.json";
      this.#format = 'utf-8';
      this.#product = [];
  }

  isValid = (title, description, price, code, stock, thumbnail, category, status) => {
    let error = '';
    if (!title || !description || !price || !code || !stock || !thumbnail || !category || !status) {
      error = `[${title}] Campos incompletos`;
    } else {
      if (this.#product.length === 0) {
        return undefined;
      }
      const found = this.#product.find(item => item.code === code);
      if (found) {
        error = `[${title}] El código ya existe`;
      }
    }
    return error;
  };


  getProduct = async () => {
    try {
      return JSON.parse(
        await fs.promises.readFile(this.#path, this.#format)
      );
    } catch (error) {
      console.log('Error: archivo no encontrado');
      return [];
    }
  };
  #validateProduct = async (product) => {
    const products = await this.getProduct();
    const existingProduct = await products.find(
      (prod) => prod.code === product.code
    );
    if (existingProduct !== undefined) {
      console.log("Ya existe un producto con el mismo código");
      return false;
    }

    return true;
  };


  #generateId = async () => {
    const products = await this.getProduct();
    return products.length === 0 ? 1 : products[products.length - 1].id + 1;
  };

  getProductById = async (id) => {
    const products = await this.getProduct()
    const product = products.find(item => item.id === id);
    if (!product) return 'Producto no encontrado';
    else return product;
  };

  addProduct = async (title, description, price, thumbnail, code, category, stock) => {
    const products = await this.getProduct();

    const newProduct = {
      id: await this.#generateId(),
      title,
      description,
      price,
      thumbnail: thumbnail || [],
      code,
      category,
      stock,
      status: true,
    };

  
    if (await this.#validateProduct(newProduct)) {
      products.push(newProduct)
      await fs.promises.writeFile(
        this.#path,
        JSON.stringify(products, null, "\t")
      );

      
      this.products = products;

      return newProduct;
    }
  };

  
  updateProduct = async (id, updatedFields) => {
    this.#product = await this.getProduct();
    const productIndex = this.#product.findIndex(item => item.id === id);
    if (productIndex === -1) {
      return 'Producto no encontrado';
    }
    this.#product[productIndex] = { ...this.#product[productIndex], ...updatedFields };
    await fs.promises.writeFile(this.#path, JSON.stringify(this.#product, null, '\t'));
    return this.#product[productIndex];
  };

  deleteProduct = async id => {
    this.#product = await this.getProduct();
    const filteredProducts = this.#product.filter(product => product.id !== id);
    if (filteredProducts.length === this.#product.length) return 'Producto no encontrado';
    await fs.promises.writeFile(this.#path, JSON.stringify(filteredProducts, null, '\t'));
    return 'Producto eliminado';
  };
}

export const productManager = new ProductManager();