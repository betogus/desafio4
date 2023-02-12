import express from 'express'
import productRouter from './src/routes/productRouter.js'
import randomRouter from './src/routes/randomRouter.js'
import session from 'express-session'
import passport from 'passport'
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'
import { initializePassport } from './src/passport.config.js'
import dotenv from 'dotenv'
import handlebars from 'express-handlebars'
import {PORT, MODO}  from './yargs.cjs'
import { Server} from 'socket.io'
import {Api} from './src/api.js'
import { users } from './src/models/User.js'
import cluster from 'cluster'
import os from 'os'
/* --------------------- SERVER --------------------------- */
const app = express()

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
    app.listen(puerto, () => {
        console.log(`Iniciando servidor en puerto ${puerto}`)
    })

    app.use('/api/randoms', randomRouter)
    app.use(express.static('public'))
    app.use(express.json())
    app.use('/api/productos', productRouter)
    app.use(express.urlencoded({
        extended: true
    }))
    dotenv.config()
    let server;



    mongoose.set('strictQuery', true);
    const io = new Server(server)

    const api = new Api()
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

    function isAuth(req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect("/login");
        }
    }

    /* --------------------- ROUTES --------------------------- */


    //REGISTER


    app.get("/register", (req, res) => {
        res.sendFile(__dirname + "/register/index.html");
    }); 

    app.post('/register', passport.authenticate('register', {
        failureRedirect: '/failregister',
        successRedirect: '/dashboard'
    })
    )


    app.get('/failregister', (req, res) => {
        res.sendFile(__dirname + "/failregister/index.html");
    })


    //LOGIN


    app.get("/login", (req, res) => {
        res.sendFile(__dirname + "/login/index.html");
    });

    app.post('/login', passport.authenticate('login', {
        failureRedirect: '/faillogin',
        successRedirect: '/dashboard'
    })
    );

    app.get('/faillogin', (req, res) => {
        res.sendFile(__dirname + "/faillogin/index.html");
    })



    // DASHBOARD

    app.get("/dashboard", isAuth, async (req, res) => {
        const userId = req.session.passport.user;
        try {
            const user = await users.findById(userId);
            res.render('dashboard', {
                name: user.username
            });

        } catch (err) {
            return res.status(500).json({
                error: err
            });
        }
    });

    // LOGOUT

    app.get('/logout', isAuth, async (req, res) => {
        const userId = req.session.passport.user;
        try {
            const user = await users.findById(userId);
            res.render('logout', {
                name: user.username
            });

        } catch (err) {
            return res.status(500).json({
                error: err
            });
        }
    });

    app.get('/clearCookie',  (req, res) => {
        req.logout(err => {
            if (err) {
                return res.status(500).json({
                    error: err
                });
            }
            req.session.destroy(err => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                }
                res.clearCookie('connect.sid');
                res.redirect('/');
            });
        });
    });

    // INICIO

    app.get('/', isAuth, (req, res) => {
        res.redirect('/dashboard')
    });


    // INFO 

    app.get('/info', (req, res) => {
        let info = {
            argumentosDeEntrada: process.argv[3]?.slice(8) || "nulo",
            plataforma: process.platform,
            versionNodeJs: process.version,
            memoriaUsada: process.memoryUsage(),
            pathDeEjecucion: process.execPath,
            processId: process.pid,
            carpetaDelProyecto: process.cwd(),
            cantidadDeProcesos: os.cpus().length
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
}

