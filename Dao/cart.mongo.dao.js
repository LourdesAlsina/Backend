import { cartModel } from "./fsManagers/models/cart.models";

export default class CartDAO {
    getAll = async () => await cartModel.find();
    getById = async (id) => await cartModel.findById(id);
    create = async (data) => await cartModel.create(data);
    update = async (id, data) => await cartModel.findByIdAndUpdate(id, data, { returnDocument: "after" });
    delete = async (id) => await cartModel.findByIdAndDelete(id);
}