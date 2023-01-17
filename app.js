const express = require('express')
const productRouter = require('./src/routes/productRouter')
const productTestRouter = require('./src/routes/productTestRouter')
const app = express()
app.use(express.urlencoded({extended: true}))

let server;
function onInit(){
    console.log("Iniciando el servidor")
    try {
        server = app.listen(8080, () => console.log('Server Up'))
    } catch(error) {
        console.log("Error de conexion con el servidor...", error)
    }
}

onInit() 

app.use(express.json())
app.use('/dashboard', express.static('public'))
app.use('/api/productos', productRouter)
app.use('/api/productos-test', productTestRouter)

const { Server} = require('socket.io')


//HANDLEBARS
const handlebars = require('express-handlebars')
app.engine('handlebars', handlebars.engine())
app.set('views', './public/views/handlebars')

app.set('view engine', 'handlebars')
const io = new Server(server)

const Api = require('./src/api')
const api = new Api()
const file = './productsTest.txt'


let productos = api.getAllProducts(file)
io.on('connection', socket => {
    console.log('Socket connected!')
    socket.emit('products', productos)   
})

//SESSION

const session = require('express-session')
const FileStore = require('session-file-store')
const cookieParser = require('cookie-parser')

const Store = FileStore(session)
app.use(cookieParser())

app.use(session({
    store: new Store({
        path: './session',
        ttl: 36000,
    }),
    key: 'user_sid', 
    secret: 'c0d3r',
    resave: true,
    saveUninitialized: true,
}))

const sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard')
    } else {
        next()
    }
}

app.get('/', sessionChecker, (req, res) => {
    res.redirect('./login')
})


app.route('/login').get(sessionChecker, (req, res) => {
    res.sendFile(__dirname + '/public/login.html')
}).post((req, res) => {
    req.session.username = req.body.username
    res.redirect('/dashboard')
})

app.get('/currentUser', (req, res) => {
    res.send(req.session.username)
})
