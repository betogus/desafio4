import { logger } from "../winston/winston.js";
import AuthService from '../services/auth.service.js'
import { publicPath } from "../utils.js";
import UserDTO from "../dtos/userDTO.js";

const authService = new AuthService()

console.log(publicPath)
export const redirectLogin = async (req, res) => {
    res.redirect("/login")
}
export const getRegistro = async (req, res) => {
    logger.info(`Ruta: /register. Método: GET`)
    res.sendFile("/register/index.html", {root: publicPath});
}

/* export const postRegistro = async (req, res) => {
    logger.info(`Ruta: /register. Método: POST`)
} */

export const failRegistro = async (req, res) => {
    logger.info(`Ruta: /failregister. Método: GET`)
    res.sendFile("/failregister/index.html", {root: publicPath});
}

export const getLogin = async (req, res) => {
    logger.info(`Ruta: /login. Método: GET`)
    res.sendFile("/login/index.html", {root: publicPath})
}

/* export const postLogin = async (req, res) => {
    logger.info(`Ruta: /login. Método: POST`)
    res.redirect('/products')
} */

export const failLogin = async (req, res) => {
    logger.info(`Ruta: /faillogin. Método: GET`)
    res.sendFile("/faillogin/index.html", {root: publicPath});
}


export const postLogin = async (req, res) => {
    logger.info(`Ruta: /login. Método: POST`)
    let {username, password } = req.body
    //const userId = req.session.passport.user;
    const result = await authService.authUser(username, password)
    try {
        console.log("try")
        let userDTO = new UserDTO(result)
        req.session.user = userDTO //Almacenamos el usuario para usarlo en isAuth()
        res.cookie('user', userDTO)
        //res.redirect('/products')
        res.send(result)
    } catch (err) {
        //failLogin(req, res)
        res.send(result)
    }
}

export const postRegistro = async (req, res) => {
    logger.info(`Ruta: /register. Método: POST`)
    let user = req.body
    try {
        let result = await authService.addUser(user, res)
        let userDTO = new UserDTO(user)
        req.session.user = userDTO //Almacenamos el usuario para usarlo en isAuth()
        res.cookie('user', userDTO)
        //res.redirect('/products')
        res.send(result)
     } catch (err) {
        //failRegistro(req, res)
        res.send(err)
    } 
}