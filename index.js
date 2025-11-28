// imports
import express from "express";
import environments from "./src/api/config/environments.js";
import cors from "cors";
import { loggerUrl, requireLogin } from "./src/api/middlewares/middlewares.js";
import { rutasProductos, ventasProductos } from "./src/api/routes/index.js";
import { __dirname, join } from "./src/api/utils/index.js";
import connection from "./src/api/database/db.js";
import session from "express-session";

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



app.get("/",requireLogin, async (req,res)=>{
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




app.get("/login",(req,res)=>{
    res.render("login",{
            title:"login",
            about: "inciar sesion"
        })
})



app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;


        if(!email || !password) {
            return res.render("login", {
                title: "Login",
                about: "Login dashboard",
                error: "Todos los campos son obligatorios"
            });
        }

        const sql = "SELECT * FROM usuarios WHERE correo = ? AND password = ?";
        const [rows] = await connection.query(sql, [email, password]);

        if(rows.length === 0) {
            return res.render("login", {
                title: "Login",
                about: "Login dashboard",
                error: "Credenciales incorrectas"
            })
        }

 
        const user = rows[0];
        console.table(user);

       
        req.session.user = {
            id: user.id,
            nombre: user.nombre,
            email: user.email
        }

        res.redirect("/"); 
        

    } catch (error) {
        console.error("Error en el login", error);
    }
});


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
app.use("/api", ventasProductos)





app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    
})

// ---------------------------------
//http://localhost:3000/products
