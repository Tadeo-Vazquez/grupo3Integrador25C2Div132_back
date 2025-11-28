import bcrypt from "bcrypt"
const salt = 12;

export async function hashPassword(password) {
    if (password.length < 4){
        throw new Error("Contraseña con menos de 4 caracteres")
    }
    return await bcrypt.hash(password,salt)
}
export async function comparePassword(password, hash) {
    return await bcrypt.compare(password,hash)
}