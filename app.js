import express from 'express';
import productRouter from './routers/product.router.js';
import cartRouter from "./routers/carts.router.js";

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('<h1>Bienvenida a LOLA clothes</h1>');
});

app.use('/product', productRouter);
app.use("/api/carts", cartRouter);

app.listen( 3000, () => {
  console.log('Servidor up');
});





