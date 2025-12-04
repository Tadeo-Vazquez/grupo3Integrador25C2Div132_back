// imports
import express from "express";
import environments from "./src/api/config/environments.js";
import cors from "cors";
import { loggerUrl, requireLogin } from "./src/api/middlewares/middlewares.js";
import { rutasProductos, ventasProductos } from "./src/api/routes/index.js";
import { __dirname, join } from "./src/api/utils/index.js";
import session from "express-session";
import { handleMulterError } from "./src/api/middlewares/multer-middleware.js";
import { selectProducts } from "./src/api/models/product.models.js";
import {requireFields, findUser, checkPassword } from "./src/api/middlewares/login-middlewares.js"
const app = express();

const PORT = environments.port;

const SESSION_KEY = environments.session_key;

app.use(cors())

// middleware logger (de aplicacion)
app.use(loggerUrl)

app.use(express.json())

app.use(express.urlencoded({extended: true}));

app.use(express.static(join(__dirname,"src","public")))

app.use(session({
    secret: SESSION_KEY,
    resave: false,
    saveUninitialized: true
}));



app.set("view engine", "ejs")
app.set("views", join(__dirname,"src","views"))



app.get("/", requireLogin, async (req,res)=>{
    try{
        const limit = parseInt(req.query.limit) || 10
        const offset = parseInt(req.query.offset) || 0
        const {total} = await selectProducts({limit:1,offset:0})
        const {rows} = await selectProducts({limit:total,offset})

        res.render("index",{
            title:"Indice",
            about:"Lista de productos",
            products: rows
        })

    }catch(error){
        console.log(error);
        
    }
})

app.get("/consultar", requireLogin,(req,res)=>{
    res.render("consultar",{
            title:"Consultar",
            about:"Consultar producto por ID",
        })
})

app.get("/crear", requireLogin,(req,res)=>{
    res.render("crear",{
            title:"Crear"
        }
        )
})
app.get("/eliminar", requireLogin,(req,res)=>{
    res.render("eliminar",{
            title:"Eliminar"
        })
})
app.get("/modificar", requireLogin,(req,res)=>{
    res.render("modificar",{
            title:"Modificar"
        })
})
app.get("/subirImagen", requireLogin,(req,res)=>{
    res.render("subirImagen",{
            title:"Subi tu imagen"
        })
})


app.get("/login",(req,res)=>{
    res.render("login",{
            title:"login",
            about: "inciar sesion"
        })
})



app.post(
    "/login",
    requireFields(["email", "password"]),  
    findUser,                             
    checkPassword,                        
    (req, res) => {                       
        const user = req.userDB;

        req.session.user = {
            id: user.id,
            nombre: user.nombre,
            email: user.correo,
        };

        res.redirect("/");
    }
);


app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if(err) { 
            console.log("Error al destruir la sesion", err);
            return res.status(500).json({
                error: "Error al cerrar la sesion"
            });
        } 
        res.redirect("/login");
    });
});

app.use("/api/productos", rutasProductos);
app.use(handleMulterError)
app.use("/api", ventasProductos)


app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    
})

// ---------------------------------
//http://localhost:3000/products
