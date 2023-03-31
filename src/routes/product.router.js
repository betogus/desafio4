import { Router } from "express";
import { addProduct, deleteProduct, getProductById, getProducts, updateProduct, graphQL } from "../controllers/products.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";

const router = Router()

router.get('/', isAuth,  getProducts)
router.post('/getProductById', getProductById)
router.post('/', addProduct)
router.put('/', updateProduct)
router.delete('/:id', deleteProduct)
router.get('/graphql', graphQL)
router.post('/graphql', graphQL)

export default router;