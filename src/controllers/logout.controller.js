import { obtenerNombreUsuario } from "../services/logout.service.js";
import { logger } from "../winston/winston.js";


export const getLogout = async (req, res) => {
    logger.info(`Ruta: /logout. Método: GET`)
    //const userId = req.session.passport.user;
    try {
        //const userName = await obtenerNombreUsuario(userId)
        const user = req.session?.user || req.cookies?.user
        console.log(user.username)
        res.render('logout', {name: user.username});

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
            res.clearCookie('user')
            res.redirect('/');
        });
    });
};