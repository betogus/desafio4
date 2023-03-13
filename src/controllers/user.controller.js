import { obtenerUsuario } from "../services/user.service.js";
import { logger } from "../winston/winston.js";


export const getUser = async (req, res) => {
    logger.info(`Ruta: /user. Método: GET`)
    const userId = req.session.passport.user;
    try {
        const user = await obtenerUsuario(userId)
        res.render('user', user)
    } catch (err) {
        res.status(500).send({message: "Error al traer los datos del usuario"})
    }
}