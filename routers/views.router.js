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

viewsRouter.get("/chat", async (req, res) => {
    try {
      const messages = await messageModel.find().lean().exec();
      res.render("chat", { messages });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error });
    }
  });

export default viewsRouter