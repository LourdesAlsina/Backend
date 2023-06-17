import express from 'express';
import handlebars from 'express-handlebars'
import {Server} from 'socket.io'
import __dirname, { PORT } from "./utils.js";
import productRouter from './routers/product.router.js';
import cartRouter from "./routers/carts.router.js";
import viewsRouter from './routers/views.router.js';

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




// Configuración
// Evento de conexión de Socket.IO
io.on("connection", socket => {
  console.log("Successful Connection");
  // Escucha el evento "productList" emitido por el cliente
  socket.on("productList", data => {
     // Emitir el evento "updatedProducts" a todos los clientes conectados
    io.emit("updatedProducts", data);
  });
});

// Configuración













