import connection from "../database/db.js";

export const selectAllProducts = () => {
    const sql = "SELECT * from productos";
    return connection.query(sql);
}

export const selectProducts = async ({limit=10,offset=0,soloActivos=false,categoria="todos",orderBy=""}) => {
    let conditions = [];
    let params = [];
    let orderBySentence = "";
    if (soloActivos) conditions.push("activo = 1");

    if (categoria !== "todos") {
        conditions.push("tipo = ?");
        params.push(categoria);
    }
    if (orderBy === "nombre" || orderBy === "precio"){
        orderBySentence = `order by ${orderBy} ASC`
    }
    
    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    // COUNT (sin limit/offset)
    const sqlTotal = `SELECT COUNT(*) AS total FROM productos ${where}`;
    const [[{ total }]] = await connection.query(sqlTotal, params);

    // SELECT (con orden + paginado)
    const sql = `SELECT * FROM productos ${where} ${orderBySentence} LIMIT ? OFFSET ?`;
    const rowsParams = [...params, limit, offset];
    const [rows] = await connection.query(sql, rowsParams);

    return { rows, total };
};

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

export const updateProductStatus = (nuevoActivo,id) => {
    return connection.query(
            "UPDATE productos SET activo = ? WHERE id = ?", 
            [nuevoActivo, id]
        );
}