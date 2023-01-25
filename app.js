import express from 'express'
import productRouter from './src/routes/productRouter.js'
import { initializePassport } from './src/passport.config.js'
import passport from 'passport'
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'
import session from 'express-session'

const app = express()
app.use(express.urlencoded({extended: true}))
let server;
function onInit() {
    console.log("Iniciando el servidor")
    try {
        server = app.listen(8080, () => console.log('Server Up'))
    } catch (error) {
        console.log("Error de conexion con el servidor...", error)
    }
}
onInit()
app.use(express.static('public'))
app.use(express.json())
app.use('/api/productos', productRouter)
app.use(express.urlencoded({
    extended: true
}))
import { Server} from 'socket.io'
mongoose.set('strictQuery', true);
const io = new Server(server)

import {Api} from './src/api.js'
const api = new Api()
const file = './products.txt'


//SESSION


let baseSession = session({
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/backsessions'
    }),
    key: "user_sid",
    cookie: {
        maxAge: 600000,
    },
    secret: 'c0d3r',
    resave: true,
    saveUninitialized: true
})

app.use(baseSession)
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

const connection = mongoose.connect('mongodb://localhost:27017/backusers', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.post('/register', passport.authenticate('register', {
    failureRedirect: '/failedRegister'
}), (req, res) => {
    res.send({
        message: 'signed up'
    })
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
         req.logout(function  (err) {
            if (err) {
                 return res.send('error de deslogueo')
            }
             res.status(200).send({
                message: 'logged out'
            })
        })

     
})


io.on('connection', socket => {
    let productos = api.getAllProducts(file)
    console.log('Socket connected!')
    socket.emit('products', productos)  
})

