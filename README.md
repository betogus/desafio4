> > Se implementará GraphQL en los productos, de tal manera que en la ruta /products se haga una consulta a la base de datos (el cual es un archivo PRODUCTS.js) y renderice en el product.handlebars todos los productos. Además, para cargar los productos al carrito de compras (cuya persistencia será en el localStorage), debemos consultar el producto por su Id para agregarlo al carrito cuando le hacemos click a un producto. Por último, desde thunderClient probamos de modificar la variable "hayStock" de un producto en específico pasándole el id. 

> > En primer lugar, modificamos la clase Products para que utilice los métodos antes mencionados (getAll, getById y noHayStock)

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
```

> > Luego creamos en el product.router las rutas necesarias

```
router.get('/', isAuth,  getProducts)
router.post('/getProductById', getProductById)
router.get('/graphql', graphQL)
router.post('/graphql', graphQL)
```

> > En products.controller cuando ingresemos a /products, le enviaremos todos los productos de la base de datos a través de la variable getProducts. Además, para cuando hagamos click sobre un producto para añadirlo al carrito, haremos un fetch (utilizando axios) a /getProductById para que le envíe al cliente el producto seleccionado. Finalmente, tendremos el /graphQL para poder manejar ambas queries y la mutation a través de thunderclient:

```
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

```

> > En el script del products.handlebars, modificamos el eventListener para que me haga un fetch hacia la ruta getProductById y lo almacene en el localstorage:

```
let agregarAlCarrito = document.getElementById('products-container')
let productosEnElCarrito = JSON.parse(localStorage.getItem("productos")) || [];

agregarAlCarrito.addEventListener('click', (e) => {
    let productoSeleccionado;
    if (e.target.parentNode.className == "product-item") {
        let idProductoSeleccionado = e.target.parentNode.id        
        axios.post('/products/getProductById', {idProductoSeleccionado})
        .then(response => {
            productoSeleccionado = response.data
            console.log(productoSeleccionado)
            productosEnElCarrito.push(productoSeleccionado)
            localStorage.setItem("productos", JSON.stringify(productosEnElCarrito));
            //Toastify
            Toastify({
                text: `Se agregó ${productoSeleccionado.name} al carrito`,
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: "linear-gradient(to right, #fbb467, #f7d096)",
                },
            }).showToast();
        })
    }

})
```

> > Si ingresamos al localhost:8080/products (una vez estemos logueados), veremos los productos, y haciendo click en uno de ellos se agregará al carrito. Por último, probamos de utilizar thunderclient para modificar uno de los productos. Ingresamos por POST a http://localhost:8080/products/graphql, y hacemos la siguiente mutacion:

```
mutation {
    noHayStock(id: 4) {
      id
      name
      precio100gr
      precioKg
      hayStock
      categoryId
    }
  }
```

> > Nos devolverá el producto, con la variable "hayStock" en false.