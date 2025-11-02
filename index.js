import express from "express";

const app = express();
import environments from "./src/api/config/environments.js";

const PORT = environments.port;

app.get("/", (req,res) => {
    res.send("TP INTEGRADOR")
})

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    
})

// ---------------------------------