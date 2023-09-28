import productRouter from './routers/product.router.js';
import cartRouter from "./routers/carts.router.js";
import viewsRouter from './routers/views.router.js';
import chatRouter from './routers/chat.router.js';
import sessionsRouter from './routes/sessions.router.js';
import { messageModel } from './Dao/fsManagers/models/messages.models.js';
import { socketServerConnection } from './socketServer.js'
import { passportCall } from './utils.js';
import LoggerRouter from './router/logger.routes.js'

const run = (io, app) => {
    app.use((req, res, next) => {
      req.io = io;
      next();
    })};
  
app.use('/api/products', productRouter);
app.use("/api/carts", cartRouter);
app.use('/home', viewsRouter)
app.use("/sessions", sessionsRouter)
app.use("/api/chat", chatRouter)
app.use("/api/carts", passportCall("jwt"), CartRouter);
app.use("/products", passportCall("jwt"), viewsRouter);
app.use("/logger", LoggerRouter)

socketServerConnection()

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

  app.get("/", (req, res) => res.render("index", {name:"Luna"}))

  export default run;

