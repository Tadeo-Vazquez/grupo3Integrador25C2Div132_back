// imports 
import express from "express";
const app = express();

import environments from "./src/api/config/environments.js";
const PORT = environments.port;

import connection from "./src/api/database/db.js";

import cors from "cors";
app.use(cors())

// middleware logger (de aplicacion)
app.use((req,res,next)=>{
    console.log(`[${new Date().toLocaleString()}]  ${req.method}  ${req.url}`);
    next()
    
})

app.use(express.json())

// endpoints
app.get("/", (req,res) => {
    res.send("TP INTEGRADOR")
})
// get all products
app.get("/productos", async (req,res) => {
    try{
        const sql = "SELECT * from productos";
        const [rows,fields] = await connection.query(sql);

        res.status(200).json({
            payload: rows,
            message: "productos obtenidos"
        })
        
    }catch(error){
        console.error("ERROR obteniendo productos: ", error.message);
        res.status(500).json({
            message: "Error interno al obtener productos"
        })
    }
})

// get product by id
app.get("/productos/:id", async (req,res) => {
    try{
        let {id} = req.params; // traemos el :id ingresado en la url 
        
        const sql = `SELECT * from productos WHERE productos.id = ?`;
        const [rows] = await connection.query(sql,[id]);

        res.status(200).json({
            payload: rows,
        })
    }catch(error){
        console.error("ERROR obteniendo producto por id: ", error.message);
        res.status(500).json({
            message: "Error interno al obtener producto por id",
            error: error.message
        })
    }
})

// crear nuevo producto
app.post("/productos", async (req,res) => {
    try{
        let {nombre,imagen,categoria,precio} = req.body;

        let consulta = "INSERT INTO productos(nombre, tipo, precio, img_url) VALUES (?,?,?,?)"
        let [rows] = await connection.query(consulta, [nombre,categoria,precio,imagen])
        res.status(201).json({
            message: "producto creado exitosamente"
        });           
    }catch(error){
        console.log("Error al crear producto " , error);
        res.status(500).json({
            message: "Error interno al crear producto",
            error: error.message
        })
    }
})


app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    
})

// ---------------------------------