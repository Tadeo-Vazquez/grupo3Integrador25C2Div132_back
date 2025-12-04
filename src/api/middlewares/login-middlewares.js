import connection from "../database/db.js";
import { comparePassword } from "../utils/bcrypt.js";

/**
 * Middleware que verifica la presencia de campos obligatorios en req.body.
 * Si algún campo falta, detiene la solicitud y renderiza la página de login con un error.
 *
 * @param {string[]} fields Array de nombres de campos que deben estar presentes en req.body.
 * @returns Función de middleware (req, res, next) que ejecuta la validación.
 */
export function requireFields(fields) {
    return (req, res, next) => {
        for (const field of fields) {
            if (!req.body[field]) {
                return res.render("login", {
                    title: "Login",
                    about: "Login dashboard",
                    error: "Todos los campos son obligatorios"
                });
            }
        }
        next();
    };
}

/**
 * Middleware asíncrono para buscar un usuario en la base de datos por su correo electrónico.
 *
 * @param {object} req Objeto de solicitud de Express. Espera 'email' en `req.body`.
 * @param {object} res Objeto de respuesta de Express.
 * @param {function} next Función para pasar el control al siguiente middleware.
 * @returns Llama a `next()` si el usuario se encuentra, o renderiza 'login' con un error si no se encuentra.
 * El usuario encontrado se adjunta a la solicitud como `req.userDB`.
 */
export async function findUser(req, res, next) {
    try {
        const { email } = req.body;

        const [rows] = await connection.query(
            "SELECT * FROM usuarios WHERE correo = ?",
            [email]
        );

        if (rows.length === 0) {
            return res.render("login", {
                title: "Login",
                about: "Login dashboard",
                error: "Credenciales incorrectas"
            });
        }

        req.userDB = rows[0];
        next();

    } catch (error) {
        console.error("Error buscando usuario", error);
        next(error);
    }
}

/**
 * Middleware asíncrono para verificar la contraseña del usuario.
 * Compara la contraseña de `req.body` con el hash de la contraseña almacenada en `req.userDB`.
 *
 * @param {object} req Objeto de solicitud de Express. Requiere `req.userDB` (del middleware anterior)
 * y espera 'password' en `req.body`.
 * @param {object} res Objeto de respuesta de Express.
 * @param {function} next Función para pasar el control al siguiente middleware o ruta.
 * @returns Llama a `next()` si la contraseña es correcta, o renderiza 'login' con un error si no coincide.
 */
export async function checkPassword(req, res, next) {
    try {
        const { password } = req.body;
        const user = req.userDB;

        const ok = await comparePassword(password, user.password);

        if (!ok) {
            return res.render("login", {
                title: "Login",
                about: "Login dashboard",
                error: "Credenciales incorrectas"
            });
        }

        next();
    } catch (error) {
        console.error("Error verificando contraseña", error);
        next(error);
    }
}
