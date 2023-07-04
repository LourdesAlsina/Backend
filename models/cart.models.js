import mongoose from "mongoose"

const cartCollection = 'cart'

const cartSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: String
})

export const cartModel = mongoose.model(cartCollection, cartSchema)

