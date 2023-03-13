import express from 'express'

import productRouter from './src/routes/product.router.js'
import authRouter from './src/routes/auth.router.js'
import cartRouter from './src/routes/cart.router.js'
import userRouter from './src/routes/user.router.js'
import logoutRouter from './src/routes/logout.router.js'

import session from 'express-session'
import multer from 'multer';
import passport from 'passport'
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'
import { initializePassport } from './src/passport.config.js'
import dotenv from 'dotenv'
import handlebars from 'express-handlebars'
import {PORT, MODO}  from './yargs.cjs'
import { Server} from 'socket.io'
import {Api} from './src/api.js'
import cluster from 'cluster'
import os from 'os'
import compression from 'compression'


/* --------------------- SERVER --------------------------- */
const app = express()
let server;
const NUM_CPUS = os.cpus().length
let puerto = PORT || 8080;
if (MODO === "cluster" && cluster.isPrimary) {
    console.log(`Proceso principal ${process.pid} está corriendo`) 
    for (let i = 0; i < NUM_CPUS; i++) {
        cluster.fork()
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Proceso ${worker.process.pid} murió`)
    })
} else {
    server = app.listen(puerto, () => {
        console.log(`Iniciando servidor en puerto ${puerto}`)
    })

    app.use(express.static('public'))
    app.use('/models', express.static('./src/models'));
    app.use('/configuration', express.static('./src/configuration'));
    app.use(express.json())

    app.use(express.urlencoded({
        extended: true
    }))
    app.use(compression())
    dotenv.config()

   
    /* MULTER */
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/uploads/avatar')
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
        }
    })
    app.use(multer({storage}).single('photo'))



    mongoose.set('strictQuery', true);
    
    const file = './products.txt'

    app.engine('handlebars', handlebars.engine())
    app.set('views', './public/views/handlebars')
    app.set('view engine', 'handlebars')

    let baseSession = session({
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URL
        }),
        cookie: {
            maxAge: 600000,
        },
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })

    app.use(baseSession)
    initializePassport()
    app.use(passport.initialize())
    app.use(passport.session())

    const connection = mongoose.connect(process.env.MONGOOSE_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })


    /* --------------------- ROUTES --------------------------- */
    app.use('/products', productRouter)
    app.use('/auth', authRouter)
    app.use('/cart', cartRouter)
    app.use('/user', userRouter)
    app.use('/logout', logoutRouter)
    
    app.get('/', (req, res) => {
        res.redirect('/auth/login')
    })

    
    const io = new Server(server)

    const api = new Api()
    io.on('connection', socket => {
        let productos = api.getAllProducts(file)
        console.log('Socket connected!')
        socket.emit('products', productos)
    })
    
}

