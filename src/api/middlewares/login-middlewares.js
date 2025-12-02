import connection from "../database/db.js";
import { comparePassword } from "../utils/bcrypt.js";

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
