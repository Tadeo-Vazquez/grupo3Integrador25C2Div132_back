// imports
import express from "express";
const app = express();

import environments from "./src/api/config/environments.js";
const PORT = environments.port;

import connection from "./src/api/database/db.js";

import cors from "cors";
app.use(cors());

// app.use((req, res, next) =>{
//     console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
// })


app.use(express.json());

// endpoints
app.get("/", (req, res) => {
  res.send("TP INTEGRADOR");
});



//get all products
app.get("/productos", async (req, res) => {
  try {
        const sql = "SELECT * from productos";
        const [rows, fields] = await connection.query(sql);

        res.status(200).json({
        payload: rows,
        });
  } catch (error) {
        console.error("ERROR obteniendo productos: ", error.message);
        res.status(500).json({
        message: "Error interno al obtener productos",
    });
  }
});

//get product by id
app.get("/productos/:id", async (req, res) => {
  try {
    //let id =req.params.id;
        let { id } = req.params;

        let sql = "SELECT * from productos WHERE productos.id = ?";

        const [rows] = await connection.query(sql, [id]);

        res.status(200).json({
        payload: rows,
    });
  } catch (error) {
        console.error("ERROR obteniendo producto por ID: ", error.message);
        res.status(500).json({
        message: "Error interno al obtener producto por ID",
        error: error.message,
    });
  }
});


//crear nuevo producto
app.post("/productos", async (req, res) =>{
    try{

        let { nombre, img_url, tipo, precio } = req.body;

        console.log(req.body);
        console.log(`nombre prodcuto: ${nombre}`);

        let sql = "INSERT INTO productos (nombre, img_url, tipo, precio) VALUES (?, ?, ?, ?)";

        let [rows]= await connection.query(sql, [nombre, img_url, tipo, precio]);
        console.log(rows);

        res.status(201).json({
            message: "Producto creado con exito!",
        });

    }catch (error){
        console.log("error al crear producto: ", error);

          res.status(500).json({
            message:"error interno del servidor",
            error: error.message
        })

    }
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// ---------------------------------
//http://localhost:3000/products
