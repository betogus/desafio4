> CLIENTE HTTP

> > Instalamos axios y creamos dentro de src una carpeta clienteHTTP con el archivo http.axios.local.js.

```
import axios from "axios"

async function getProducts () {
    try {
        const response = await axios.get('http://localhost:8080/products')
        console.log(`Status Code: ${response.status}`)
        console.log(response.data)
    } catch (err) {
        console.log(err)
    }
} 

//getProducts()

let userRegister = {
    username: "Benja",
    address: "Calle falsa 123",
    age: 28,
    phone: "123123123",
    email: "gus@hotmail.com",
    password: "123"
}

async function postRegistro () {
    try {
        const response = await axios.post('http://localhost:8080/auth/register', userRegister)
        console.log(`Status Code: ${response.status}`)
        console.log(response.data)
    } catch (err) {
        console.log(err)
    }
}

//postRegistro()


let userLogin = {
    username: "Gus",
    password: "123"
}


async function postLogin() {
    try {
        const response = await axios.post('http://localhost:8080/auth/login', userLogin)
        console.log(`Status Code: ${response.status}`)
        console.log(response.data)
    } catch (err) {
        console.log(err)
    }
}

//postLogin()

```

> > Modificamos el auth.controller y el product.controller para que en vez de renderizar una página, me envíe la info (res.send())

> TEST 

> > Instalamos mocha, chai y supertest (npm i -D mocha chai supertest). Agregamos en el package.json lo siguiente: "test": "mocha src/test/products.test.js". Para realizar el test, creamos una clase Products dentro de la carpeta models con los métodos de CRUD. 

```
import { PRODUCTS } from "../../public/database/products.js"

class Products {
    constructor(products) {
        this.products = products
    }
    add(product) {
        if (product.name && product.precio100gr && product.precioKg && product.hayStock && product.categoryId) {
            let newProduct = {...product}
            newProduct.id = this.products[this.products.length-1].id+1
            this.products.push(newProduct)
            return {message: "El producto se añadió con éxito"}
        } else {
            return {message: "Faltan datos"}
        }
    } 

    getAll() {
        return this.products
    }

    getById(id) {
        let product = this.products.find(item => item.id === id)
        if (!product) return {message: "No hubo coincidencias"}
        return product
    }

    update(product) {
        if (product.name && product.precio100gr && product.precioKg && product.hayStock && product.categoryId) {
            let productUpdated = this.products.find(item => item.id === product.id)
            if (!productUpdated) return {message: "No hubo coincidencias"}
            this.products.filter(item => item.id !== product.id)
            this.products.push(product)
            return {message: "El producto se modificó con éxito"}
        } else {
            return {message: "Faltan datos"}
        }
    }

    delete(id) {
        let product = this.products.find(item => item.id === id)
        if (!product) return {message: "No hubo coincidencias"}
        let arrayProducts = this.products.filter(item => item.id !== id)
        this.products = arrayProducts
        return {message: "El producto se eliminó con éxito"}
    }

}

export const productsDataBase = new Products(PRODUCTS)
```

> > En el product.controller utilizamos la instancia

```
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
```

> > En el product.router traemos las funciones que creamos en el product.controller

```
import { Router } from "express";
import { addProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/products.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";

const router = Router()

router.get('/',  /* isAuth,  */  getProducts)
router.get('/:id', getProductById)
router.post('/', addProduct)
router.put('/', updateProduct)
router.delete('/:id', deleteProduct)

export default router;
```

> > product.test.js:

```
import supertest from 'supertest'
import { expect } from 'chai'

const request = supertest('http://localhost:8080')

describe('test Products', () => {
    describe('GET', () => {
        it('Debe verificar que no devuelva un array vacío', async () => {
            let res = await request.get('/products')
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array').that.is.not.empty;
        })
        it('Debe devolver un producto si se le pasa un ID válido', async () => {
            const productId = 1;
            const res = await request.get(`/products/${productId}`);
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('id', productId);
        });
    })
})
describe('POST', () => {
    it('Verificamos que el producto se añadió con éxito si éste cumple con todos los campos', async () => {
        const producto = {
            name: 'Banana deshidratada',
            precio100gr: 27,
            precioKg: 250,
            hayStock: true,
            categoryId: 5,
        }
        let res = await request.post('/products').send(producto)
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message', 'El producto se añadió con éxito');

    })
})

describe('PUT', () => {
    it('Verificamos que el producto se actualizó con éxito si éste cumple con todos los campos', async () => {
        const producto = {
            name: 'Banana deshidratada',
            precio100gr: 27,
            precioKg: 250,
            hayStock: true,
            categoryId: 5,
            id: 80
        }
        let res = await request.put('/products').send(producto)
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message', 'El producto se modificó con éxito');

    })
})

describe('DELETE', () => {
    let productId = 80
    it('Verificamos que el producto se eliminó con éxito', async () => {
        let res = await request.delete(`/products/${productId}`)
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message', 'El producto se eliminó con éxito');
    })
})
```

