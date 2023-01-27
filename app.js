import express from 'express'
import productRouter from './src/routes/productRouter.js'
import randomRouter from './src/routes/randomRouter.js'
import { initializePassport } from './src/passport.config.js'
import passport from 'passport'
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'
import session from 'express-session'
import dotenv from 'dotenv'
import handlebars from 'express-handlebars'

import argv  from './yargs.cjs'
const app = express()
dotenv.config()
app.use(express.urlencoded({extended: true}))
let server;
let PORT = argv?.title != undefined? argv.title : 8080
function onInit() {
    console.log("Iniciando el servidor")
    try {
        server = app.listen(PORT, () => console.log('Server Up'))
    } catch (error) {
        console.log("Error de conexion con el servidor...", error)
    }
}
onInit()
app.use(express.static('public'))
app.use(express.json())
app.use('/api/productos', productRouter)
app.use('/api/randoms', randomRouter)
app.use(express.urlencoded({
    extended: true
}))
import { Server} from 'socket.io'
mongoose.set('strictQuery', true);
const io = new Server(server)

import {Api} from './src/api.js'
const api = new Api()
const file = './products.txt'

app.engine('handlebars', handlebars.engine())
app.set('views', './public/views/handlebars')
app.set('view engine', 'handlebars')

//SESSION


let baseSession = session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL
    }),
    key: "user_sid",
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



app.post('/register', passport.authenticate('register'), (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).send({
            message: 'registered'
        })
    } else {
        res.status(401).send({
            message: 'error'
        });
    }
})

app.post('/failregister', (req, res) => {
    res.send({
        error: 'I cannot authenticate you'
    })
})

app.get('/currentUser', (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user)
    } 
});

app.get('/auth', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).send({message: 'logged in'})
    } else {
        res.status(401).send({message: 'not authorizaded'})
    } 
    
})


app.post('/login', passport.authenticate('login'), (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).send({message: 'logged in'})
    } else {
        res.status(401).send({message: 'not athorizaded'});
    }
});


app.get('/logout',  (req, res) => { 
    req.logout()
    req.session.destroy(function (err) {
        if (err) {
            return next(err);
        } else if (!req.isAuthenticated) {
            res.status(200).send({message: 'logged out'})
        }
        
    });

     
})

app.get('/info', (req, res) => {
    let info = {
        argumentosDeEntrada: process.argv[3]?.slice(8) || "nulo",
        plataforma: process.platform,
        versionNodeJs: process.version,
        memoriaUsada: process.memoryUsage(),
        pathDeEjecucion: process.execPath,
        processId: process.pid,
        carpetaDelProyecto: process.cwd()
    }
    res.render('info', {
        info
    })
})


io.on('connection', socket => {
    let productos = api.getAllProducts(file)
    console.log('Socket connected!')
    socket.emit('products', productos)  
})

