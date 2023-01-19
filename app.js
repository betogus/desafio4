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
app.use('/api/productos', productRouter)
app.use('/api/productos-test', productTestRouter)
app.use(express.urlencoded({extended: true}))
const { Server} = require('socket.io')


//HANDLEBARS
/* const handlebars = require('express-handlebars')
app.engine('handlebars', handlebars.engine())
app.set('views', './public/views/handlebars') */

/* app.set('view engine', 'handlebars') */
const io = new Server(server)

const Api = require('./src/api')
const api = new Api()
const file = './products.txt'


//SESSION

const session = require('express-session')
const FileStore = require('session-file-store')
const cookieParser = require('cookie-parser')

const Store = FileStore(session)
app.use(cookieParser())

app.use(session({
    /* store: new Store({
        path: './session',
        ttl: 60,
    }), */
    cookie: {maxAge: 60000},
    key: 'user_sid', 
    secret: 'c0d3r',
    resave: true,
    saveUninitialized: true,
}))
app.use(express.static('public'))


app.get('/', (req, res) => {
    res.redirect('./login')
})


app.route('/login').get((req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard')
    } else {
        res.sendFile(__dirname + '/public/login.html')
    } 
}).post((req, res) => {
    req.session.user = {
        username : req.body.username
    }
    req.session.save()
    res.redirect('/dashboard')
})

app.get('/dashboard', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.sendFile(__dirname + '/public/dashboard.html')
    } else {
        res.redirect('/login')
    }
})

app.get('/logout', (req, res) => {
     if (req.session.user && req.cookies.user_sid) {
         res.sendFile(__dirname + '/public/logout.html')
     } else {
         res.redirect('/login')
     }
})


app.get('/currentUser', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        let {username } = req.session.user
        res.send({username})
    } else {
        res.redirect('/login')
    }

})


app.get('/logoutUser', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        let { username } = req.session.user
        res.send({username})
        req.session.destroy()
        res.clearCookie("user_sid");
    } else {
         res.redirect('/login')
    }  
})

io.on('connection', socket => {
    let productos = api.getAllProducts(file)
    console.log('Socket connected!')
    socket.emit('products', productos)  
})

