// imports
import express from "express";
import environments from "./src/api/config/environments.js";
import cors from "cors";
import { loggerUrl } from "./src/api/middlewares/middlewares.js";
import { rutasProductos, ventasProductos } from "./src/api/routes/index.js";
import { __dirname, join } from "./src/api/utils/index.js";
import connection from "./src/api/database/db.js";


const app = express();

const PORT = environments.port;

app.use(cors())

// middleware logger (de aplicacion)
app.use(loggerUrl)

app.use(express.json())

app.use(express.static(join(__dirname,"src","public")))

//configuracion

app.set("view engine", "ejs")
app.set("views", join(__dirname,"src","views"))


app.get("/index", async (req,res)=>{
    try{
        const [rows] = await connection.query("SELECT * FROM productos")

        res.render("index",{
            title:"Indice",
            about:"Lista de productos",
            products: rows
        })

    }catch(error){
        console.log(error);
        
    }
})
app.get("/consultar",(req,res)=>{
    res.render("consultar",{
            title:"Consultar",
            about:"Consultar producto por ID",
        })
})
app.get("/crear",(req,res)=>{
    res.render("crear")
})
app.get("/eliminar",(req,res)=>{
    res.render("eliminar")
})
app.get("/modificar",(req,res)=>{
    res.render("modificar")
})






// endpoints
app.get("/", (req,res) => {
    res.send("TP INTEGRADOR")
})

app.use("/api/productos", rutasProductos);
app.use("/api", ventasProductos)






app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    
})

// ---------------------------------
//http://localhost:3000/products
