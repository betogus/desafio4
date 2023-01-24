import express from 'express'
const router = express.Router()

router.get('/', (req, res) => {
    res.render('home')
    
})

router.use('/', express.static('public'))

module.exports = router