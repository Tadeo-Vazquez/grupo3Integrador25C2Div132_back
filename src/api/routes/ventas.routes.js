import { Router } from "express";
import { createVenta, getAllVentas, getVentaById } from "../controllers/ventas.controllers.js";


const router = Router();

// get all  ventas
router.get("/ventas", getAllVentas)

// get venta by id
router.get("/ventas/:id", getVentaById)

// crear nueva venta
router.post("/ventas", createVenta)



export default router;