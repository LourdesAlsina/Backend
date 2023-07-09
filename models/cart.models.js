import mongoose from "mongoose"

const cartCollection = 'cart'

const cartSchema = new mongoose.Schema({
    products: {
        type: [
          {
            _id: false,
            product: mongoose.ObjectId,
            quantity: Number,
          },
        ],
        default: [],
      },
    });
    
    mongoose.set("strictQuery", false);

export const cartModel = mongoose.model(cartCollection, cartSchema)

