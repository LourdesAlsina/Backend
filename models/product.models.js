import mongoose from "mongoose"

const productCollection = 'product'

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    priece: { Number, required: true},
    stock: { Number, required: true},
    code: { type: String, required: true },
    category: String
})

export const productModel = mongoose.model(productCollection, productSchema)