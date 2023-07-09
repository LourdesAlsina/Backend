import mongoose from "mongoose";

const productCollection = 'product';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    code: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: Boolean, default: true },
});

mongoose.set("strictQuery", false);
export const productModel = mongoose.model(productCollection, productSchema);
