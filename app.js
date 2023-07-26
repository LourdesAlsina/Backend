import express from 'express';
import handlebars from 'express-handlebars'
import {Server} from 'socket.io'
import __dirname, { PORT } from "./utils.js";
import productRouter from './routers/product.router.js';
import cartRouter from "./routers/carts.router.js";
import viewsRouter from './routers/views.router.js';
import mongoose from "mongoose"
import { messageModel } from './Dao/fsManagers/models/messages.models.js';
//import cookieParser from 'cookie-parse'
import { productModel } from './Dao/fsManagers/models/product.models.js';
import session from 'express-session'


const app = express();
app.use(express.json());
app.use(session({
  secret: 'lolasecret',
  resave: true,
  saveUninitialized: true
}))

mongoose.set('strictQuery', false)
try {
  await mongoose.connect('mongodb+srv://lulialsinaa:SAGa0m3ed@cluster0.tpyqumw.mongodb.net/Ecommerce', {
    useUnifiedTopology: true,
})
  const serverHttp = app.listen(PORT, () =>  console.log('Server up'));
  const io = new Server(serverHttp)
  app.set('socketio', io)
  app.use(express.static(`${__dirname}/public`)) 
  

  app.engine('handlebars', handlebars.engine())
  app.set("views", `${__dirname}/views`);
  app.set("view engine", "handlebars");
  

  app.get("/", (req, res) => res.render("index", {name:"Jorge"}))

  app.use('/api/products', productRouter);
  app.use("/api/carts", cartRouter);
  app.use('/home', viewsRouter)



  io.on("connection", async (socket) => {
    console.log("Successful Connection");
    socket.on("productList", (data) => {
      io.emit("updatedProducts", data);
    });


  let messages =  (await messageModel.find()) ? await messageModel.find() : [];

    socket.broadcast.emit('alerta');
    socket.emit('logs', messages);
    socket.on('message', async (data) => {
      messages.push(data);
      messageModel.create(data);
      io.emit('logs', messages);
  });
    });
  } catch (error) {
    console.log(`Cannot connect to database: ${error}`);
    process.exit();
  };











