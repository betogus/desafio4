import { Router } from "express";
import { addProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/products.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";

const router = Router()

router.get('/',  /* isAuth,  */  getProducts)
router.get('/:id', getProductById)
router.post('/', addProduct)
router.put('/', updateProduct)
router.delete('/:id', deleteProduct)

export default router;