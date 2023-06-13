import express from 'express';
import productRouter from './routers/product.router.js';
import cartRouter from "./routers/carts.router.js";
import handlebars from 'express-handlebars'
import {Server} from 'socket.io'
import ProductManager from './controllers/ProductManager.js';
import viewsRouter from './routers/views.router.js';

const app = express();
const PORT = 3000
app.use(express.json());
app.use(express.static('./public'))

const serverHttp = app.listen(PORT, () =>  console.log('Server up'));
const io = new Server(serverHttp)
app.set('socketio', io)


app.engine('handlebars', handlebars.engine())
app.set('views', 'views')
app.set('views engine', 'handlebars')

app.get('/', (req, res) => {
  res.send('<h1>Bienvenida a LOLA clothes</h1>');
});

app.use('/product', productRouter);
app.use("/api/carts", cartRouter);
app.use('products', viewsRouter)
app.use('/', viewsRouter)

app.use((req, res, next) => {
  req.io = io
  next()
})
io.on("connection", socket => {
  console.log('A new client has connected to the Server')
  socket.on('productList',async(data) => {
      let products = await ProductManager.addProducts(data)
      io.emit('updatedProducts', products)
  })
})







