import { confirmarCompra } from "../services/cart.service.js";
import { logger } from "../winston/winston.js";


export const getCarrito = async (req, res) => {
    logger.info('Ruta: /cart. Método: GET')
    res.render('cart')
}

export const postCarrito = async (req, res) => {
    logger.info('Ruta: /cart. Método: POST')
    const userId = req.session.passport.user;
    let productosEnElCarrito = (req.body)
    try {
        await new Promise((resolve, reject) => {
            confirmarCompra(userId, productosEnElCarrito, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        res.status(200).send({
            Message: "Compra confirmada"
        })
    } catch (error) {
        res.status(500).send({
            Message: "Error al confirmar la compra"
        })
    }
};