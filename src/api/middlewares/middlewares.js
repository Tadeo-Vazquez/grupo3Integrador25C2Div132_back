
/**
 * Middleware para registrar (loggear) la fecha, hora, de cada solicitud entrante.
 *
 * @param {object} req Objeto de solicitud de Express.
 * @param {object} res Objeto de respuesta de Express.
 * @param {function} next Función para pasar el control al siguiente middleware.
 * @returns  Llama a `next()` para continuar con la ejecución.
 */
const loggerUrl = (req,res,next)=>{
    console.log(`[${new Date().toLocaleString()}]  ${req.method}  ${req.url}`);
    next()
}
/**
 * Middleware para validar que el parámetro Id de la URL (req.params) sea un número entero válido.
 * Si es válido, lo convierte a entero y lo adjunta a `req.id`.
 *
 * @param {object} req Objeto de solicitud de Express. Espera 'id' en `req.params`.
 * @param {object} res Objeto de respuesta de Express.
 * @param {function} next Función para pasar el control al siguiente middleware o ruta.
 * @returns Llama a `next()` si el Id es válido, o envía un 400 JSON si no lo es.
 */
const validarId = (req,res,next) => {
    const {id} = req.params;
    if (!id || isNaN(id)){
        return res.status(400).json({
            message: "El id debe ser un numero"
        })
    }
    req.id = parseInt(id,10);
    console.log("id validado: " , req.id);

    next();
}

/**
 * Middleware de protección de ruta. Verifica si existe un usuario en la sesión (`req.session.user`).
 *
 * @param {object} req Objeto de solicitud de Express. Requiere el uso de sesiones.
 * @param {object} res Objeto de respuesta de Express.
 * @param {function} next Función para pasar el control al siguiente middleware o ruta.
 * @returns Llama a `next()` si el usuario está logueado, o redirige a '/login' si no lo está.
 */
const requireLogin = (req, res, next) => {
    if(!req.session.user) {
        return res.redirect("/login");
    }   
    next();
}



export{
    loggerUrl,
    validarId,
    requireLogin
}