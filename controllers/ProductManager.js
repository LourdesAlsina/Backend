import fs from 'fs';


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

  #generateId = () => {
    return this.#product.length === 0 ? 1 : this.#product[this.#product.length - 1].id + 1;
  };

  getProductById = id => {
    const products = this.getProduct()
    const product = products.find(item => item.id === id);
    if (!product) return 'Producto no encontrado';
    else return product;
  };

  addProduct = async (title, description, price, code, stock, thumbnail, category, status) => {
    this.#product = await this.getProduct();
    this.#product.push({
      id: this.#generateId(),
      title,
      description,
      price,
      code,
      stock,
      thumbnail,
      category,
      status
    });
    await fs.promises.writeFile(this.#path, JSON.stringify(this.#product, null, '\t'));
    return this.#product[this.#product.length - 1];
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
