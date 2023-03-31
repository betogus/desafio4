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

    noHayStock(id) {
        let index = this.products.findIndex(item => item.id === id)
            if (index === -1) return {message: "No hubo coincidencias"}
        this.products[index].hayStock = false
        return this.products[index]
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