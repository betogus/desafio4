import { logger } from "../winston/winston.js";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicPath = path.join(__dirname, '../../public');

export const redirectLogin = async (req, res) => {
    res.redirect("/login")
}
export const getRegistro = async (req, res) => {
    logger.info(`Ruta: /register. Método: GET`)
    res.sendFile("/register/index.html", {root: publicPath});
}

export const postRegistro = async (req, res) => {
    logger.info(`Ruta: /register. Método: POST`)
}

export const failRegistro = async (req, res) => {
    logger.info(`Ruta: /failregister. Método: GET`)
    res.sendFile("/failregister/index.html", {root: publicPath});
}

export const getLogin = async (req, res) => {
    logger.info(`Ruta: /login. Método: GET`)
    res.sendFile("/login/index.html", {root: publicPath})
}

export const postLogin = async (req, res) => {
    logger.info(`Ruta: /login. Método: POST`)
    res.redirect('/products')
}

export const failLogin = async (req, res) => {
    logger.info(`Ruta: /faillogin. Método: GET`)
    res.sendFile("/faillogin/index.html", {root: publicPath});
}
