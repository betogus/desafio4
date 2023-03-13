import { Router } from "express";
import { getClearCookie, getLogout } from "../controllers/logout.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";


const router = Router();

// LOGOUT

router.get('/', isAuth, getLogout);
router.get('/clearCookie', isAuth, getClearCookie);

export default router