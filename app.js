const express = require('express')
const productRouter = require('./src/routes/productRouter')
const productTestRouter = require('./src/routes/productTestRouter')
const app = express()
app.use(express.urlencoded({extended: true}))

let server;
function onInit(){
    console.log("Iniciando el servidor")
    try {
        server = app.listen(8080, () => console.log('Server Up'))
    } catch(error) {
        console.log("Error de conexion con el servidor...", error)
    }
}

onInit() 

app.use(express.json())
app.use('/', express.static('public'))
app.use('/api/productos', productRouter)
app.use('/api/productos-test', productTestRouter)

const { Server} = require('socket.io')
//const PORT = process.env.PORT || 8080
//const server = app.listen(PORT, () => console.log('Server Up'))

//HANDLEBARS
const handlebars = require('express-handlebars')
app.engine('handlebars', handlebars.engine())
app.set('views', './public/views/handlebars')

app.set('view engine', 'handlebars')
const io = new Server(server)

const Api = require('./src/api')
const api = new Api()
const file = './productsTest.txt'


let productos = api.getAllProducts(file)
io.on('connection', socket => {
    console.log('Socket connected!')
    socket.emit('products', productos)   
})




