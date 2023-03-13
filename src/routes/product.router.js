import { Router } from "express";
import { getProducts } from "../controllers/products.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";

const router = Router()

router.get('/', isAuth, getProducts)

export default router;