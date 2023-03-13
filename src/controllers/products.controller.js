import { PRODUCTS } from '../../public/database/products.js';
import { logger } from '../winston/winston.js';

export const getProducts = async (req, res) => {
    logger.info(`Ruta: /products. Método: GET`)
    res.render('products', {PRODUCTS})
}