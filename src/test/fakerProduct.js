/* const express = require('express')
const router = express.Router()
const Api = require('../api')
const multer = require('multer')
const api = new Api()
const file = './productsTest.txt'


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

router.use(multer({storage}).single('thumbnail'))

router.get('/', (req, res) => {
    res.send(api.getAllProducts(file))
})

router.get('/:id', (req, res) => {
    let {id} = req.params
    let producto = api.findProduct(id, file)
    if (!producto) return res.status(400).send({error:'Producto no encontrado'})
    res.send({producto})
})

const validPost = (req, res, next) => {
    let producto = req.body
    let thumbnail = req.file
    if (!producto.title || !producto.price || !thumbnail) return res.status(400).send({error:'Debe completar todos los campos'})
    next()
}

 router.post('/', validPost, (req, res) => {
    let producto = req.body
    producto.thumbnail = req.file.filename
    api.createProduct(producto, file)
    res.send({message: 'Se añadio con exito', producto})
}) 

router.put('/:id', (req, res) => {
    let {id} = req.params
    let producto = req.body
    api.replaceProduct(id, producto, file)
     res.send({producto})

})

router.delete('/:id', (req, res) => {
    let {id} = req.params
    api.deleteProduct(id,file)
    res.send({message: "producto eliminado"})
})
module.exports = router */