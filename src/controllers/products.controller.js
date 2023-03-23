import { productsDataBase } from '../models/Products.js';
import { logger } from '../winston/winston.js';

export const getProducts = (req, res) => {
    logger.info(`Ruta: /products. Método: GET`)
    //res.render('products', {PRODUCTS})
    let result = productsDataBase.getAll()
    res.status(200).send(result)
}

export const getProductById = (req, res) => {
    let {id} = req.params
    logger.info(`Ruta: /products/:id. Método: GET`)
    let result = productsDataBase.getById(parseInt(id))
    res.send(result)
}

export const addProduct = (req, res) => {
    let product = req.body
    logger.info(`Ruta: /products. Método: POST`)
    let result = productsDataBase.add(product)
    res.send(result)
}

export const deleteProduct = (req, res) => {
    let {id} = req.params
    logger.info(`Ruta: /products/:id. Método: DELETE`)
    let result = productsDataBase.delete(parseInt(id))
    res.send(result)
}

export const updateProduct = (req, res) => {
    let product = req.body
    logger.info(`Ruta: /products/. Método: PUT`)
    let result = productsDataBase.update(product)
    res.send(result)
}