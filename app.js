import express from 'express'
import productRouter from './src/routes/productRouter.js'
import randomRouter from './src/routes/randomRouter.js'
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
import { users } from './src/models/User.js'
import cluster from 'cluster'
import os from 'os'
import compression from 'compression'
import { logger } from './src/winston/winston.js'
import { PRODUCTS } from './public/database/products.js';
import { createTransport } from "nodemailer";
import twilio from 'twilio'
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


    //app.use('/api/randoms', randomRouter)
    app.use(express.static('public'))
    app.use('/models', express.static('./src/models'));
    app.use('/configuration', express.static('./src/configuration'));
    app.use(express.json())
    app.use('/api/productos', productRouter)
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

    function isAuth(req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect("/login");
        }
    }

    //Configuracion para envio de email

    const transporter = createTransport({
        service: 'gmail',
        port: 587,
        auth: {
            user: process.env.TEST_MAIL,
            pass: process.env.TEST_PASS
        }
    });

    
    /* --------------------- ROUTES --------------------------- */

    //REGISTER


    app.get("/register", (req, res) => {
        logger.info(`Ruta: /register. Método: GET`)
        res.sendFile(__dirname + "/register/index.html");
    }); 

    app.post('/register', passport.authenticate('register', {
        failureRedirect: '/failregister',
        successRedirect: '/products'
    }), (req, res) => {
        logger.info(`Ruta: /register. Método: POST`)
    })


    app.get('/failregister', (req, res) => {
        logger.info(`Ruta: /failregister. Método: GET`)
        res.sendFile(__dirname + "/failregister/index.html");
    })

    // PRODUCTS

    app.get('/products', (req, res) => {
        logger.info(`Ruta: /products. Método: GET`)
        res.render('products', {PRODUCTS})
    })
    
    //LOGIN

    app.get("/login", (req, res) => {
        logger.info(`Ruta: /login. Método: GET`)
        res.sendFile(__dirname + "/login/index.html");
    });

    app.post('/login', passport.authenticate('login', {
        failureRedirect: '/faillogin',
        successRedirect: '/products'
    }), (req, res) => {
        logger.info(`Ruta: /login. Método: POST`)
    }
    );

    app.get('/faillogin', (req, res) => {
        logger.info(`Ruta: /faillogin. Método: GET`)
        res.sendFile(__dirname + "/faillogin/index.html");
    })

    // CART
    app.get('/cart', isAuth, async (req, res) => {    
        logger.info('Ruta: /cart. Método: GET')
        res.render('cart')
    })
    
    app.post('/cart', async (req, res) => {
        
        const userId = req.session.passport.user;
        const user = await users.findById(userId);
        let productosEnElCarrito = (req.body)
        let contenidoEmail = `
        <h3>Productos a enviar: <h3>
        <ul>
        `
        productosEnElCarrito.map(item => {
            contenidoEmail += `<li>nombre: ${item.name}, precio: ${item.precioKg}</li>`
        })
        contenidoEmail += `</ul>`
        let contenidoMensaje = ``
        productosEnElCarrito.map(item => contenidoMensaje += `nombre: ${item.name}, precio: ${item.precioKg}`)

         //nodemailer
        const mailOptions = {
            from: process.env.TEST_MAIL,
            to: user.email,
            subject: `Nuevo pedido de ${user.username}`,
            html: contenidoEmail
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.send('Error al enviar el correo electrónico');
            } else {
                console.log('Correo electrónico enviado: ' + info.response);
                res.status(200).send('Correo electrónico enviado con éxito');
            }
        });
        
        //twilio
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const client = twilio(accountSid, authToken);
        client.messages
            .create({
                from: 'whatsapp:+14155238886',
                body: `Nuevo pedido de ${user.username}. ${contenidoMensaje}`,
                to: `whatsapp:+${user.phone}`
            })
            .then(message => console.log(message.sid));

    });

    // DASHBOARD

    app.get("/dashboard", isAuth, async (req, res) => {
        logger.info(`Ruta: /dashboard. Método: GET`)
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
        logger.info(`Ruta: /logout. Método: GET`)
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
        logger.info(`Ruta: /. Método: GET`)
        res.redirect('/products')
    });


    //USER

    app.get('/user', isAuth, async (req, res) => {
        logger.info(`Ruta: /user. Método: GET`)
        const userId = req.session.passport.user;
        try {
            const user = await users.findById(userId);
            res.render('user', {
                username: user.username,
                email: user.email,
                photo: user.photo,
                address: user.address,
                age: user.age,
                phone: user.phone
            });

        } catch (err) {
            return res.status(500).json({
                error: err
            });
        }
    })
    // INFO 

    app.get('/info', (req, res) => {
        logger.info(`Ruta: /info. Método: GET`)
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
        console.log(info)
        res.render('info', {
            info
        })
    })

    const io = new Server(server)

    const api = new Api()
    io.on('connection', socket => {
        let productos = api.getAllProducts(file)
        console.log('Socket connected!')
        socket.emit('products', productos)
    })
    

    //RUTAS NO DEFINIDAS

  /*   app.use((req, res, next) => {
        logger.warn(`Ruta no encontrada: ${req.originalUrl}`);
        res.status(404).send("Ruta no encontrada");

    }); */
}

