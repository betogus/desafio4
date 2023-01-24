import mongoose from "mongoose";

const collection = 'Users'

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,

})

export const users = mongoose.model(collection, UserSchema)

