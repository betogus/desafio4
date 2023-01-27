import express from 'express'
import { fork } from 'child_process' 
const router = express.Router()

router.get('/', (req, res) => {
    const result = fork('./src/random.js', [req.query.cant])
    result.on('message', data => {
        res.render('random', {
            data
        })
    })

})

router.use('/', express.static('public'))

export default router