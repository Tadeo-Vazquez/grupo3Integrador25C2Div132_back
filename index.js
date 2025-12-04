// Imports de módulos y configuraciones
import express from "express";
import environments from "./src/api/config/environments.js";
import cors from "cors";
// Middleware de registro (loggerUrl) y de autenticación (requireLogin)
import { loggerUrl, requireLogin } from "./src/api/middlewares/middlewares.js";
// Routers de productos y ventas
import { rutasProductos, ventasProductos } from "./src/api/routes/index.js";
// Utils para manejo de rutas de directorio
import { __dirname, join } from "./src/api/utils/index.js";
import session from "express-session";
// Middleware de manejo de errores de subida de archivos
import { handleMulterError } from "./src/api/middlewares/multer-middleware.js";
// Modelo para consulta de productos 
import { selectProducts } from "./src/api/models/product.models.js";
// Middlewares de autenticación (login)
import {requireFields, findUser, checkPassword } from "./src/api/middlewares/login-middlewares.js"

// Inicialización de la aplicación Express
const app = express();

// Definición de puerto y clave de sesión
const PORT = environments.port;
const SESSION_KEY = environments.session_key;

// --- Middlewares Globales y Configuración General ---

// Middleware para habilitar CORS (Cross-Origin Resource Sharing)
app.use(cors())

/** Middleware logger (de aplicación) */
// Se aplica a todas las solicitudes para registrar la actividad.
app.use(loggerUrl)

// Middleware para parsear cuerpos de solicitud entrantes en formato JSON
app.use(express.json())

// Middleware para parsear cuerpos de solicitud con URL-encoded data
app.use(express.urlencoded({extended: true}));

// Middleware para servir archivos estáticos (HTML, CSS, JS, imágenes) desde la carpeta 'public'
app.use(express.static(join(__dirname,"src","public")))

/** Configuración de Sesiones */
// Middleware para manejar sesiones de usuario. Usa la clave secreta para firmar la cookie de sesión.
app.use(session({
    secret: SESSION_KEY,
    resave: false,
    saveUninitialized: true
}));


/** Configuración de Vistas (EJS) */
app.set("view engine", "ejs")
// Define la carpeta donde se encuentran los archivos EJS
app.set("views", join(__dirname,"src","views"))


// --- Rutas de Vistas Protegidas (Requieren Login) ---

/**
 * Ruta Raíz (GET /)
 * Muestra la página principal con la lista completa de productos.
 * Requiere que el usuario esté logueado (`requireLogin`).
 */
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
/** Rutas de Vistas para la gestión de productos */
// Todas estas rutas requieren autenticación (`requireLogin`)
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
// --- Rutas de Autenticación (Login/Logout) ---

/**
 * Ruta de Login (GET /login)
 * Muestra la vista del formulario de inicio de sesión.
 */
app.get("/login",(req,res)=>{
    res.render("login",{
            title:"login",
            about: "inciar sesion"
        })
})
/**
 * Ruta de Autenticación (POST /login)
 * Procesa el formulario de inicio de sesión utilizando una cadena de middlewares.
 * 1. requireFields: Valida que 'email' y 'password' estén presentes.
 * 2. findUser: Busca el usuario por correo electrónico en la DB.
 * 3. checkPassword: Compara la contraseña.
 * 4. Función final: Crea la sesión del usuario si la autenticación es exitosa y redirige a la raíz.
 */
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

/**
 * Ruta de Cierre de Sesión (POST /logout)
 * Destruye la sesión de Express y redirige al usuario a la página de login.
 */
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
// --- Configuración de Routers de API ---

// Middleware para el router de productos (Rutas: /api/productos/...)
app.use("/api/productos", rutasProductos);
// Middleware para manejar errores de Multer (subida de archivos)
app.use(handleMulterError)
// Middleware para el router de ventas (Rutas: /api/ventas/...)
app.use("/api", ventasProductos)

// --- Inicialización del Servidor ---

/** Inicia el servidor de Express en el puerto definido. */
app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    
})

