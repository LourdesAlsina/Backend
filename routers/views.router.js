import { Router } from 'express'
import ProductManager from '../controllers/ProductManager.js';

const viewsRouter = Router()
const productManager = new ProductManager('./products.json')
const readProducts = await productManager.readProducts()

viewsRouter.get('/', (req, res) => {
    res.render('home', {
        title: "Programación backEnd | Handlebars",
        products: readProducts
    })
})

viewsRouter.get('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts', {
        title: "Handlebars | Websocket",
        products: readProducts
    })
})

export default viewsRouter