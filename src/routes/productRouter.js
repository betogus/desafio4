import express from 'express'
const router = express.Router()
import {Api} from '../api.js'
import multer from 'multer'
const api = new Api()
const file = './products.txt'


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

router.use(multer({storage}).single('thumbnail'))
/*  router.post('/uploadfile', upload.single('thumbnail'), (req, res, next) => {
    const file = req.file
    console.log(file)
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(file)
})  */


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
    res.redirect('/dashboard')

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

export default router