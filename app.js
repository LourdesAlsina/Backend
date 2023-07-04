import express from 'express';
import handlebars from 'express-handlebars'
import {Server} from 'socket.io'
import __dirname, { PORT } from "./utils.js";
import productRouter from './routers/product.router.js';
import cartRouter from "./routers/carts.router.js";
import viewsRouter from './routers/views.router.js';
import userRouter from './routers/user.router.js'
import mongoose from "mongoose"

// Configuración
const app = express();
app.use(express.json());
app.use(express.static(`${__dirname}/public`)) 
const serverHttp = app.listen(PORT, () =>  console.log('Server up'));
const io = new Server(serverHttp)
app.set('socketio', io)
//HANDLEBARS
app.engine('handlebars', handlebars.engine())
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");
//HANDLEBARS


// Configuración

// RUTAS
//Principal
app.get("/", (req, res) => res.render("index", {name:"Jorge"}))

app.use('/api/products', productRouter);
app.use("/api/carts", cartRouter);
app.use('/home', viewsRouter)
app.use('/users', userRouter)




// Mongoose

try {
  await mongoose.connect('mongodb+srv://lulialsinaa:SAGa0m3ed@cluster0.tpyqumw.mongodb.net/Ecommerce')
  app.listen(8080, () => console.log('Server Up!'))
} catch(err) {
  console.log(err.message)
}

// CHAT - SOCKET

io.on("connection", async (socket) => {
  console.log("Successful Connection");
  socket.on("productList", (data) => {
    io.emit("updatedProducts", data);
  });

  let messages = (await messageModel.find()) ? await messageModel.find() : [];

  socket.broadcast.emit("alerta");
  socket.emit("logs", messages);
  socket.on("message", (data) => {
    messages.push(data);
    messageModel.create(messages);
    io.emit("logs", messages);
  });
});











