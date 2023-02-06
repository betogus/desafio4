import express from 'express'

const app = express()

app.listen(8081, () => console.log(`Worker process ${process.pid} running...`))

app.get('/', (req, res) => {
    res.send('Hola Mundo!')
})
