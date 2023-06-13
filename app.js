import express from 'express';
import productRouter from './routers/product.router.js';
import cartRouter from "./routers/carts.router.js";
import handlebars from 'express-handlebars'
import {Server} from 'socket.io'

const app = express();
app.use(express.json());

const serverHttp = app.listen(300, () => console.log('Server up'));
const io = new Server(serverHttp)
app.set('socketio', io)
app.use(express.static('./public'))
app.engine('handlebars', handlebars.engine())
app.set('views', 'views')
app.set('views engine', 'handlebars')

app.get('/', (req, res) => {
  res.send('<h1>Bienvenida a LOLA clothes</h1>');
});

app.use('/product', productRouter);
app.use("/api/carts", cartRouter);
app.use('products', viewsRouter)






