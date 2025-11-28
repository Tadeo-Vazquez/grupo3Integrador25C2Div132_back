import { createProduct, getAllProducts, getProductById, modifyProduct, removeProduct } from "../controllers/product.controllers.js";
import { validarId } from "../middlewares/middlewares.js";
import { Router } from "express";
import { multerUploader } from "../middlewares/multer-middleware.js";

const router = Router();

// get all products
router.get("/", getAllProducts)

// get product by id
router.get("/:id", validarId , getProductById)

// crear nuevo producto
router.post("/", createProduct)
router.post("/upload", multerUploader.single("image"), (req,res) => {
    try{
    console.log("Imagen subida correctamente")
    console.log(req.file);
    }catch(err){
        console.error("ERROR: " + err)
    }
})

// PUT actualizar productos
router.put("/", modifyProduct)

router.delete("/:id", validarId , removeProduct)


export default router;