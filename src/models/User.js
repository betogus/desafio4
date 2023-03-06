import mongoose from "mongoose";

const collection = 'Users'

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    phone: Number,
    age: Number,
    photo: String,
    address: String

})

export const users = mongoose.model(collection, UserSchema)

