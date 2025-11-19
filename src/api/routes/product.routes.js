import { createProduct, getAllProducts, getProductById, modifyProduct, removeProduct } from "../controllers/product.controllers.js";
import { validarId } from "../middlewares/middlewares.js";


import { Router } from "express";
const router = Router();

// get all products
router.get("/", getAllProducts)

// get product by id
router.get("/:id", validarId , getProductById)

// crear nuevo producto
router.post("/", createProduct)

// PUT actualizar productos
router.put("/", modifyProduct)

router.delete("/:id", validarId , removeProduct)


export default router;