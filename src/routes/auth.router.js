import { Router } from "express";
import passport from 'passport'
import { initializePassport } from "../passport.config.js";
import dotenv from 'dotenv'
import { getRegistro, getLogin, failRegistro, failLogin, postRegistro, postLogin, redirectLogin } from "../controllers/auth.controller.js";


const router = Router()
dotenv.config()
initializePassport()
router.use(passport.initialize())
router.use(passport.session())

//REGISTER

router.get("/register", getRegistro);
router.post('/register', postRegistro)
router.get('/failregister', failRegistro)


//LOGIN

router.get('/', redirectLogin);
router.get("/login", getLogin);
router.get('/faillogin', failLogin)
router.post('/login', postLogin);

export default router