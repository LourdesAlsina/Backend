export default class ProductManager {
    constructor(path) {
      this.path = path;
      this.format = 'utf-8';
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
  
    getProduct = () => this.#product;

    #generateId = () => {
      return this.#product.length === 0 ? 1 : this.#product[this.#product.length - 1].id + 1;
    };
  
    addProduct = async (title, description, price, code, stock, thumbnail, category, status) => {
      this.#product = await this.getProduct();
      this.#product.push({ id: this.#generateId(), title, description, price, code, stock, thumbnail, category, status });
      return await fs.promises.writeFile(this.path, JSON.stringify(this.#product, null, '\t'));
    };
  
    getProductById = id => {
      const product = this.#product.find(item => item.id === id);
      if (!product) return 'Producto no encontrado';
      else return product;
    };
  
    getProduct = async () => {
      try {
        const fileContent = await fs.promises.readFile(this.path, this.format);
        return JSON.parse(fileContent);
      } catch (error) {
        return [];
      }
    };
  
    updateProduct = async (id, updatedFields) => {
        this.#product = await this.getProduct();
        const productIndex = this.#product.findIndex(item => item.id === id);
        if (productIndex === -1) {
          return 'Producto no encontrado';
        }
        this.#product[productIndex] = { ...this.#product[productIndex], ...updatedFields };
        await fs.promises.writeFile(this.path, JSON.stringify(this.#product, null, '\t'));
        return this.#product[productIndex];
      };
    
      deleteProduct = async id => {
        this.#product = await this.getProduct();
        const filteredProducts = this.#product.filter(product => product.id !== id);
        if (filteredProducts.length === this.#product.length) return 'Producto no encontrado';
        await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts, null, '\t'));
        return 'Producto eliminado';
      };
    
      #product;
    
      async initialize() {
        this.#product = await this.getProduct();
      }
    }
/*export const productManager = new ProductManager("./JSON/ProductManager.json");
await productManager.addProduct('Top Loly', 'Top negro talle unico', 3500, '123', 2, 'https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1624963064-zara-cropped-top-negro-1624963028.jpg?crop=1xw:1xh;center,top&resize=480%3A%2A', "ropa", true)
await productManager.addProduct('Top Luna', 'Top verde talle unico',3000, '124', 3, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZcGzMP7UT8zw8zJ2SkaOWJ2CNgZjPFZYQwA&usqp=CAU', "ropa", true) 
await productManager.addProduct('Top Bimba', 'Top rosa talle unico', 4000, '125', 2, 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/top-zara-1616859543.jpg?resize=480:*', "ropa", true)
console.log(productManager.getProductById(2))

const updatedProduct = await productManager.updateProduct(2, { title: 'Top Lunar', price: 2500 });
console.log(updatedProduct)

const deleteProduct = await productManager.deleteProduct(2)
console.log(deleteProduct)

*/



