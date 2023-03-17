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
router.post('/register', /*  passport.authenticate('register', {
    failureRedirect: '/auth/failregister',
    successRedirect: '/auth/products'
}), */ postRegistro)
router.get('/failregister', failRegistro)


//LOGIN

router.get('/', redirectLogin);
router.get("/login", getLogin);
router.get('/faillogin', failLogin)
router.post('/login', /* (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        if (!user) {
            console.error(info);
            return res.status(401).send(info.message);
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error(err);
                return next(err);
            }
            return next();
        });
    })(req, res, next);
}, */ postLogin);

export default router