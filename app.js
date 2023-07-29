import express from 'express';
import handlebars from 'express-handlebars'
import {Server} from 'socket.io'
import __dirname, { PORT } from "./utils.js";
import productRouter from './routers/product.router.js';
import cartRouter from "./routers/carts.router.js";
import viewsRouter from './routers/views.router.js';
import chatRouter from './routers/chat.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mongoose from "mongoose"
import { messageModel } from './Dao/fsManagers/models/messages.models.js';
//import cookieParser from 'cookie-parse'
import { productModel } from './Dao/fsManagers/models/product.models.js';
import session from 'express-session'
import { FileStore } from 'session-file-store';
import MongoStore from 'connect-mongo'
import passport from 'passport'
import initializePassport from './config/passport.js'


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      dbName: MONGO_DB_NAME,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    }),
    secret: "Secret", 
    resave: false,
    saveUninitialized: true,
  })
)

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

const MONGO_URI = "mongodb://127.0.0.1:27017"
const MONGO_DB_NAME = "Ecommerce"

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
  app.use("/sessions", sessionsRouter)
  app.use("/api/chat", chatRouter)



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











