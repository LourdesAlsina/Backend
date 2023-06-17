import { Router } from 'express'
import ProductManager from '../controllers/ProductManager.js';

const viewsRouter = Router()
const productManager = new ProductManager('../products.json') // creo que no sriver
const readProducts = await productManager.getProduct()

viewsRouter.get('/', (req, res) => {
    res.render('home', {
        title: "Programación backEnd | Handlebars",
        products: readProducts
    })
})

viewsRouter.get('/realTimeProducts', (req, res) => {
    res.render('realTimeProduct', {
        title: "Handlebars | Websocket",
        products: readProducts
    })
})

export default viewsRouter