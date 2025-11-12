// imports 
import express from "express";
const app = express();

import environments from "./src/api/config/environments.js";
const PORT = environments.port;

import { rutasProductos } from "./src/api/routes/index.js";

import cors from "cors";
import { loggerUrl } from "./src/api/middlewares/middlewares.js";
app.use(cors())

// middleware logger (de aplicacion)
app.use(loggerUrl)

app.use(express.json())

// endpoints
app.get("/", (req,res) => {
    res.send("TP INTEGRADOR")
})

app.use("/api/productos", rutasProductos);






app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    
})

// ---------------------------------