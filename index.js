// imports 
import express from "express";
const app = express();

import environments from "./src/api/config/environments.js";
const PORT = environments.port;

import connection from "./src/api/database/db.js";

import cors from "cors";
app.use(cors())

// endpoints
app.get("/", (req,res) => {
    res.send("TP INTEGRADOR")
})

app.get("/productos", async (req,res) => {
    try{
        const sql = "SELECT * from productos";
        const [rows,fields] = await connection.query(sql);

        res.status(200).json({
            payload: rows
        })
        
    }catch(error){
        console.error("ERROR obteniendo productos: ", error.message);
        res.status(500).json({
            message: "Error interno al obtener productos"
        })
    }
})

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    
})

// ---------------------------------