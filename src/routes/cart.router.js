import { Router } from "express";
import { getCarrito, postCarrito } from "../controllers/cart.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";

const router = Router()

// CART
router.get('/', isAuth, getCarrito)
router.post('/', postCarrito);


export default router