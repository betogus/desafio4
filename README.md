# Desafio 16 

## TERCERA ENTREGA DEL PROYECTO FINAL

**Consigna:**
>>Se debe entregar:

Un menú de registro y autenticación de usuarios basado en passport local, guardando en la base de datos las credenciales y el resto de los datos ingresados al momento del registro. 

El registro de usuario consiste en crear una cuenta en el servidor almacenada en la base de datos, que contenga el email y password de usuario, además de su nombre, dirección, edad, número de teléfono (debe contener todos los prefijos internacionales) y foto ó avatar. La contraseña se almacenará encriptada en la base de datos.

La imagen se podrá subir al servidor y se guardará en una carpeta pública del mismo a la cual se tenga acceso por url.

Un formulario post de registro y uno de login. De modo que, luego de concretarse cualquiera de estas operaciones en forma exitosa, el usuario accederá a su home.

El usuario se logueará al sistema con email y password y tendrá acceso a un menú en su vista, a modo de barra de navegación. Esto le permitirá ver los productos totales con los filtros que se hayan implementado y su propio carrito de compras e información propia (datos de registro con la foto). Además, dispondrá de una opción para desloguearse del sistema.

Ante la incorporación de un usuario, el servidor enviará un email al administrador con todos los datos de registro y asunto 'nuevo registro', a una dirección que se encuentre por el momento almacenada en una constante global.

Envío de un email y un mensaje de whatsapp al administrador desde el servidor, a un número de contacto almacenado en una constante global.

El usuario iniciará la acción de pedido en la vista del carrito.

Será enviado una vez finalizada la elección para la realizar la compra de productos.

El email contendrá en su cuerpo la lista completa de productos a comprar y en el asunto la frase 'nuevo pedido de ' y el nombre y email del usuario que los solicitó. En el mensaje de whatsapp se debe enviar la misma información del asunto del email.

El usuario recibirá un mensaje de texto al número que haya registrado, indicando que su pedido ha sido recibido y se encuentra en proceso.

>>Aspectos a incluir:

El servidor trabajará con una base de datos DBaaS (Ej. MongoDB Atlas) y estará preparado para trabajar en forma local o en la nube a través de la plataforma PaaS Heroku.
Habilitar el modo cluster para el servidor, como opcional a través de una constante global.
Utilizar alguno de los loggers ya vistos y así reemplazar todos los mensajes a consola por logs eficientes hacia la misma consola. En el caso de errores moderados ó graves el log tendrá además como destino un archivo elegido.
Realizar una prueba de performance en modo local, con y sin cluster, utilizando Artillery en el endpoint del listado de productos (con el usuario vez logueado). Verificar los resultados.


> Solución:

> > Ejecutamos la base de datos de mongo desde el cmd:

```
Ejemplo: mongod --dbpath “C:\Program Files\MongoDB\miBaseDeDatos” 
```

> > Modificamos el archivo index.html que se encuentra en el directorio public/register para incluir la dirección, edad, teléfono y foto de perfil al registro (en el formulario debemos recordar agregar el enctype="multipart/form-data" para que me reconozca el file de la foto de perfil)


> > Importamos y configuramos Multer para el manejo de archivos en app.js

```
import multer from 'multer';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/avatar')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
app.use(multer({storage}).single('photo'))
```

> > Modificamos el "register" del passport.config para que además del username, email y password, reciba los demás datos

```
if (user) return done(null, false) {
    const newUser = {
        username,
        password: createHash(password),
        email: req.body.email,
        phone: req.body.phone,
        age: req.body.age,
        address: req.body.address,
        photo: req.file.filename
    }
```

> > El passport.config utiliza el modelo User para almacenar los datos en la base de datos, por lo que debemos incluir en la plantilla de éste la direccion, telefono, edad y foto.

```
const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    phone: Number,
    age: Number,
    photo: String,
    address: String

})
```

> > Generamos una barra de navegación. Agregamos en el main.handlebars lo siguiente:

```
<body>
    <nav class="header-nav">
        <ul class="header-nav-container">
            <li class="header-nav-item"><a href="/dashboard">Productos</a></li>
            <li class="header-nav-item"><a href="/user">Mis datos</a></li>
            <li class="header-nav-item"><a href="/carrito">Carrito</a></li>
            <li class="header-nav-item"><a href='/logout'>Desloguearse</a></li>
        </ul>
    </nav>
    <main>
        {{{body}}}
    </main>
</body>
```

> > Creamos un user.handlebars en el cual se mostrarán los datos del usuario.

```
<div class="title-container">
    <h1 id="title">{{username}}</h1>
</div>

<div>
    <div class="img-container">
        <img src="/uploads/avatar/{{photo}}" />
    </div>
    <p>Email: {{email}}</p>
    <p>Dirección: {{address}}</p>
    <p>Edad: {{age}}</p>
    <p>teléfono: {{phone}}</p>
    
</div>
```

> > Creamos la ruta /user en el app.js

```
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
```

> > Creamos el products.handlebars el cual traeremos de nuestra carpeta database todos los productos. Para ello, debemos usar el siguiente script: <script type="module" src="../../index.js"></script> para que pueda importarlo en el index al PRODUCTS: import {PRODUCTS} from './database/products.js'. A su vez, usaremos toastify como modal para avisarle al cliente de que su producto fue añadido al carrito. Para ello, debemos instalarlo:
```
    npm install --save toastify-js
```

> > Ahora debemos incorporar el link en el head y el script al final del body en el archivo main.handlebars. Nos queda de la siguiente manera:

```
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Handlebars</title>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">
</head>

<body>
    <nav class="header-nav">
        <ul class="header-nav-container">
            <li class="header-nav-item"><a href="/dashboard">Productos</a></li>
            <li class="header-nav-item"><a href="/user">Mis datos</a></li>
            <li class="header-nav-item"><a href="/carrito">Carrito</a></li>
            <li class="header-nav-item"><a href='/logout'>Desloguearse</a></li>
        </ul>
    </nav>
    <main>
        {{{body}}}
    </main>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/toastify-js"></script>

</body>
</html>
```

> > Creamos la ruta products en app.js, y le asignaremos como página principal al loguearse y registrarse

```
app.get('/products', (req, res) => {
    logger.info(`Ruta: /products. Método: GET`)
    res.render('products', {PRODUCTS})
})
```

> > Generamos el products.handlebars

```
<div class="title-container">
    <h1 id="title">Bienvenido {{{name}}}</h1>
</div>
<h2>Productos</h2>
<div id="products-container">
    {{#each PRODUCTS}}
        <div class="product-item" id="{{id}}">
            <p class="product-text">Nombre: {{name}}</p>
            <p class="product-text">Precio: ${{precioKg}}</p>
        </div>
    {{/each}}
</div>
<script type="module" src="../../products.js"></script>
```

> > Creamos el products.js donde creamos el eventListener del carrito

```
import {PRODUCTS} from './database/products.js'

let agregarAlCarrito = document.getElementById('products-container')
let productosEnElCarrito = JSON.parse(localStorage.getItem("productos")) || [];


agregarAlCarrito.addEventListener('click', (e) => {
    if (e.target.parentNode.className == "product-item") {
        let idProductoSeleccionado = e.target.parentNode.id
        let productoSeleccionado = PRODUCTS.find(item => item.id === parseInt(idProductoSeleccionado))
        productosEnElCarrito.push(productoSeleccionado)
        localStorage.setItem("productos", JSON.stringify(productosEnElCarrito));
        //Toastify
        Toastify({
            text: `Se agregó ${productoSeleccionado.name} al carrito`,
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to right, #fbb467, #f7d096)",
            },
        }).showToast();
    }
})

```

> > De manera similar, creamos la ruta /cart en app.js, generamos el cart.handlebars y su cart.js donde traeremos los items del carrito que están almacenados en el localStorage. En app.js realizamos la configuración para utilizar nodemailer y twilio luego de haberlo instalado. Lo importamos y generamos las rutas de tipo GET Y POST de cart. En el POST, recibiremos la lista de los productos del carrito

```
import { createTransport } from "nodemailer";
import twilio from 'twilio'

    const transporter = createTransport({
        service: 'gmail',
        port: 587,
        auth: {
            user: process.env.TEST_MAIL,
            pass: process.env.TEST_PASS
        }
    });

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

```
