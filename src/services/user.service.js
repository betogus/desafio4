import { users } from "../models/User.js";

export async function obtenerUsuario(userId, callback) {
    const user = await users.findById(userId);
    return {
        username: user.username,
        email: user.email,
        photo: user.photo,
        address: user.address,
        age: user.age,
        phone: user.phone
    }
}