import connection from "../database/db.js";

export const selectAllProducts = () => {
    const sql = "SELECT * from productos";
    return connection.query(sql);
}

export const selectProducts = async ({limit=10,offset=0}) => {
    const sqlTotalProd = "SELECT count(*) as total from productos"
    const [[{ total }]] = await connection.query(sqlTotalProd)
    console.log(total); 
    const sql = "SELECT * from productos limit ? offset ?";
    const [rows] = await connection.query(sql,[limit,offset]);    
    return {rows,total}
}

export const selectProductById = (id) => {
    const sql = `SELECT * from productos WHERE productos.id = ?`;
    return connection.query(sql,[id]);
}

export const insertProduct = (nombre,categoria,precio,imagen) => {
    let consulta = "INSERT INTO productos(nombre, tipo, precio, img_url) VALUES (?,?,?,?)"
    return connection.query(consulta, [nombre,categoria,precio,imagen])
}

export const updateProduct = (activo,nombre,categoria,precio,imagen,id) => {
    let consulta = "UPDATE productos SET activo=?,nombre=?,tipo=?,precio=?,img_url=? WHERE id = ?"
    return connection.query(consulta, [activo,nombre,categoria,precio,imagen,id])
}

export const deleteProduct = (id) => {
    let consulta = "delete from productos WHERE id = ?"
    return connection.query(consulta, [id])
}