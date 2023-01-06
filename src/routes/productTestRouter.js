const express = require('express')
const router = express.Router()
const multer = require('multer')

router.get('/', (req, res) => {
    res.render('home')
    //res.send(api.getAllProducts(file))
    
})



module.exports = router