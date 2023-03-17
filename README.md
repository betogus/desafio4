> > Creamos la carpeta daos donde se aloja el archivo authDaoArray.js. 


```
export default class AuthDaoArray {
    constructor(){
        this.users = []
    }
    authUser = async (username, password) => {
        let user = this.users.find(item => item.username === username)
        if (user.password === password) {
            return user
        }
        else return {status: 400, message: "El usuario y/o contraseña no coinciden"}
    }

    addUser = async (user) => {
        let findUser = this.users.find(item => item.username === user.username)
        if (findUser) return {status:400, message: "Ya existe un usuario con ese nombre"}
        else {
            this.users.push(user)
            return user
        }
    }

}
```


> > En auth.service.js se importa la clase AuthDaoArray y se utilizará este archivo service para la configuración según el dao que utilicemos. 

```
import AuthDaoArray from "../daos/authDaoArray.js";

export default class AuthService {
    constructor() {
        this.usersDao = new AuthDaoArray()
    }

    addUser = async (user) => {
        return await this.usersDao.addUser(user)
    }

    authUser = async (username, password) => {
        return await this.usersDao.authUser(username, password)
    }
}
```

> > Luego la clase AuthService se importará al auth.controller.js. Se modificará el postLogin y postRegistro de tal manera que ahora funcionen de acuerdo a los métodos del AuthService, y no con passport. Realizamos la autenticación del usuario guardando en session y en cookie el nombre de usuario. Para ello modificacmos las funciones postRegistro y postLogin agregando la session y cookie

```
export const postLogin = async (req, res) => {
    logger.info(`Ruta: /user. Método: POST`)
    let {username, password } = req.body
    //const userId = req.session.passport.user;
    try {
        const user = await authService.authUser(username, password)
        req.session.username = user.username //Almacenamos el nombre de usuario para usarlo en isAuth()
        res.cookie('username', user.username)
        res.redirect('/products') 
    } catch (err) {
        failLogin(req, res)
    } 
}

export const postRegistro = async (req, res) => {
    logger.info(`Ruta: /user. Método: POST`)
    let user = req.body
    try {
        await authService.addUser(user)
        req.session.username = user.username //Almacenamos el nombre de usuario para usarlo en isAuth()
        res.cookie('username', user.username)
        res.redirect('/products')
    } catch (err) {
        failRegistro(req, res)
    }
}
```

> > En el middleware isAuth consultamos si existe el username para permitir que el usuario ingrese a la ruta /products, /cart, o cualquier otra sin necesidad de volver a loguearse:

```
export function isAuth(req, res, next) {
    //if (req.isAuthenticated()) {
    let username = req.session?.username || req.cookies?.username;
    if (username) {
        console.log("se está autenticando") 
        next();
    } else {
        res.redirect("/auth/login");
    } 
}
```

> > En el logout.controller, agregamos en la ruta getClearCookie lo siguiente: res.clearCookie('username') y modificamos el getLogout para que reciba el username

```
export const getLogout = async (req, res) => {
    logger.info(`Ruta: /logout. Método: GET`)
    //const userId = req.session.passport.user;
    try {
        //const userName = await obtenerNombreUsuario(userId)
        const userName = req.session?.username || req.cookies?.username
        console.log(userName)
        res.render('logout', {name: userName});

    } catch (err) {
        return res.status(500).json({
            error: err
        });
    } 
};

export const getClearCookie = async (req, res) => {
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
            res.clearCookie('username')
            res.redirect('/');
        });
    });
};
```
> > Ahora realizaremos la persistencia de datos en un archivo. Primero agregamos lo siguiente en utils.js:

```
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export const publicPath = path.join(__dirname, '../public');
```

> > Creamos la carpeta file en src, y dentro de la carpeta daos creamos la clase AuthDaoFile:

```
import { __dirname } from "../utils.js"
import fs from 'fs'

export default class AuthDaoFile {
    constructor() {
        this.path = __dirname + "/files/users.json"
        this.#init()
    }

    #init = async() => { //el # significa que es un metodo privado
        if (!fs.existsSync(this.path)) await fs.promises.writeFile(this.path, JSON.stringify([]))
    }

    #readFile = async() => {
        let data = await fs.promises.readFile(this.path, 'utf-8')
        return JSON.parse(data)
        
    }

    authUser = async (username, password) => {
        let users = await this.#readFile()
        let user = users.find(item => item.username === username)
        if (user.password === password) return user
        else return { status: 400, message: "El usuario y/o contraseña no coinciden" }
    }

    addUser = async(user) => {
        let users = await this.#readFile()
        let findUser = users.find(item => item.username === user.username)
        if (findUser) return {status:400, message: "Ya existe un usuario con ese nombre"}
        else {
            users.push(user)
            await fs.promises.writeFile(this.path, JSON.stringify(users, null, '\t'))
            return user
        }
    }
}

```

> > Para probarlo, reemplazamos el AuthDaoArray en el auth.service, y ponemos el AuthDaoFile

```
constructor() {
        this.usersDao = new AuthDaoFile()
    }
```

> > Implementaremos un userDTO. Para ello creamos la carpeta dtos y creamos la clase UserDTO

```
export default class UserDTO {
    constructor(user) {
        this.username = user.username,
        this.age = user.age,
        this.email= user.email
    }
}
```

> > Modificamos el auth.controller para que en vez de almacenar en session el username, almacene el userDTO así luego podemos mostrarlos en pantalla en la pestaña User.

```
export const postLogin = async (req, res) => {
    logger.info(`Ruta: /user. Método: POST`)
    let {username, password } = req.body
    //const userId = req.session.passport.user;
    try {
        const user = await authService.authUser(username, password)
        let userDTO = new UserDTO(user)
        req.session.user = userDTO //Almacenamos el usuario para usarlo en isAuth()
        res.cookie('user', userDTO)
        res.redirect('/products') 
    } catch (err) {
        failLogin(req, res)
    }  
}

export const postRegistro = async (req, res) => {
    logger.info(`Ruta: /user. Método: POST`)
    let user = req.body
    console.log("user", user)
    try {
        await authService.addUser(user)
        let userDTO = new UserDTO(user)
        req.session.user = userDTO //Almacenamos el usuario para usarlo en isAuth()
        res.cookie('user', userDTO)
        res.redirect('/products')
     } catch (err) {
        failRegistro(req, res)
    } 
}
```

> > Además debemos modificar el isAuth middleware, y el logout.controller para que utilice el req.session.user y no el req.session.username. Ahora aplicaremos Factory. Definiremos en el archivo .env si queremos que los datos del usuario se almacenen en memoria o en un archivo:

```
PERSISTENCE="ARRAY"
```

> > En src/config.js:

```
import dotenv from 'dotenv'
dotenv.config()

export default {
    app: {
        persistence: process.env.PERSISTENCE
    }
}
```

> > daos/persistenceFactory.js:

```
import config from '../config.js'

export default class PersistenceFactory {
    static getPersistence = async() => {
        switch(config.app.persistence) {
            case "ARRAY":
                let { default: AuthDaoArray } = await import('./authDaoArray.js') //importacion dinamica
                return new AuthDaoArray()
            case "FILE":
                let { default: AuthDaoFile } = await import('./authDaoFile.js')
                return new AuthDaoFile()
        }
    }
}
```

> > auth.service.js:

```
import PersistenceFactory from "../daos/PersistenceFactory.js"

export default class AuthService {
    constructor() {
        this.usersDao
        this.#init()
    }

    #init = async() => {
        this.usersDao = await PersistenceFactory.getPersistence()
    }
...
}
```

> > Por último modificamos el user.controller para que en la pestaña "mis datos" se visualice lo almacenado en las cookies.

```
export const getUser = async (req, res) => {
    logger.info(`Ruta: /user. Método: GET`)
    //const userId = req.session.passport.user;
    try {
        //const user = await obtenerUsuario(userId)
        const user = req.session?.user || req.cookies?.user
        res.render('user', user)
    } catch (err) {
        res.status(500).send({message: "Error al traer los datos del usuario"})
    }
}
```

> > Queda pendiente mostrar en "Mis Datos" la imagen del usuario, la cual debería almacenarse con multer.