const express = require('express')
const multer = require('multer')
const productRouter = require('./src/routes/productRouter')
const app = express()
app.use(express.urlencoded({extended: true}))
function onInit(){
    console.log("Iniciando el servidor")
    try {
        app.listen(8080, () => console.log('Server Up'))
    } catch(error) {
        console.log("Error de conexion con el servidor...", error)
    }
}

onInit() 

app.use(express.json())
app.use('/', express.static('public'))
app.use('/api/productos', productRouter)

