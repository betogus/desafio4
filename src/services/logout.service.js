import { users } from "../models/User.js";
import { logger } from "../winston/winston.js";


export async function obtenerNombreUsuario (userId) {
    const user = await users.findById(userId);
    return {username: user.username}
}