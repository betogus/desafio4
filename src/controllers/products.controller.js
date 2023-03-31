import { graphqlHTTP } from 'express-graphql';
import { productsDataBase } from '../models/Products.js';
import { logger } from '../winston/winston.js';
import { buildSchema } from "graphql";
import {graphql} from 'graphql'

let schema = buildSchema(`
    type Product {
        id: Int
        name: String
        precio100gr: Float
        precioKg: Float
        hayStock: Boolean
        categoryId: Int
        }
        type Query {
            getAll: [Product]
            getById(id: Int): Product 
        }
        type Mutation {
            noHayStock(id: Int): Product
        }
`)

const rootValue = {
    getAll: () => productsDataBase.getAll(),
    getById: (data) => productsDataBase.getById(data.id),
    noHayStock: (data) => productsDataBase.noHayStock(data.id)
}


export const getProducts = async (req, res) => {
    logger.info(`Ruta: /products. Método: GET`)
    let products;
    try {
        const query = '{ getAll { id name precio100gr precioKg hayStock categoryId } }';
        const result = await graphql(schema, query, rootValue);
        products = result.data.getAll 
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
    let username = req.session?.user.username
    res.render('products', {name: username, products})
}

export const graphQL = graphqlHTTP({schema, rootValue, graphiql: true})


export const getProductById = async (req, res) => {
    let {idProductoSeleccionado} = req.body
    const GET_PRODUCT_BY_ID = `
  query {
    getById(id: ${idProductoSeleccionado}) {
      id
      name
      precio100gr
      precioKg
      hayStock
      categoryId
    }
  }
`;
    const result = await graphql(schema, GET_PRODUCT_BY_ID, rootValue);
    let product = result.data.getById
    res.send(product)
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