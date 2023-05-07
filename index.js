class ProductManager {
    #product
    #error
    constructor() { 
        this.#product = []
        this.#error = undefined
    }

    getProduct = () =>  this.#product

    #genereteId = () => {
        return (this.#product.length === 0) ? 1 : this.#product[this.#product.length-1].id+1
    }

    getProductById = (id) => {
        const product = this.#product.find(item => item.id === id)
        if (!product) return 'not found'
        else return product
    }
    
    #isValid = (title, description, price, code, stock, thumbnail) => {
        if (!title || !description || !price || !code || !stock || !thumbnail) {
            this.#error = `[${title}] campos incompletos`
        } else {
            if (this.#product.length === 0) {
                return undefined;
            }
            const found = this.#product.find(item => item.code === code)
            if(!found) return this.#error = undefined
            if (found) this.#error = `[${title}] el codigo ya existe`
            else this.#error = undefined
        }
    }
    
    addProduct = (title, description, price, code, stock, thumbnail) => {
        this.#isValid(title, description, price, code, stock, thumbnail)
         if (this.#error === undefined) 
            this.#product.push({id: this.#genereteId(), title, description, price, code, stock, thumbnail})
         else 
            console.log(this.#error)
    }      
}

const productManager = new ProductManager
productManager.addProduct('Top Loly', 'Top negro talle unico', 3500, '123', 2, 'https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1624963064-zara-cropped-top-negro-1624963028.jpg?crop=1xw:1xh;center,top&resize=480%3A%2A')
productManager.addProduct('Top Luna', 'Top verde talle unico',3000, '124', 3, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZcGzMP7UT8zw8zJ2SkaOWJ2CNgZjPFZYQwA&usqp=CAU') 
productManager.addProduct('Top Bimba', 'Top rosa talle unico', 4000, '125', 2, 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/top-zara-1616859543.jpg?resize=480:*') 
console.log(productManager.getProduct())
console.log(productManager.getProductById(2))