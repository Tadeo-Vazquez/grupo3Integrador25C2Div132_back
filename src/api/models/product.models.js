import connection from "../database/db.js";

/**
 * consulta para obtener todos los productos
 * @returns query promesa de consulta con los prodcutos de la db
 */
export const selectAllProducts = () => {
    const sql = "SELECT * from productos";
    return connection.query(sql);
}

/**
 * consulta para obtener productos bajo condiciones segun parametro
 * @param {*} param0 parametros limit y offset para paginado, por defecto siendo limit=10 y offset=0 y pudiendo cambiarse luego. 
 * @returns retorna la query promesa con los productos segun la condiciones de busqueda pasada por parametro
 */
export const selectProducts = async ({limit=10,offset=0,soloActivos=false,categoria="todos",orderBy=""}) => {
    let conditions = [];
    let params = [];
    let orderBySentence = "";
    //si por parametro se pasa soloActivos=1, se consulta por productos activos, por defecto se obtienen los inactivos.
    if (soloActivos) conditions.push("activo = 1");
    //depende la categoria pasada por parametro, se consulta el tipo de producto, todos, fisico o digital, por defecto es todos.
    if (categoria !== "todos") {
        conditions.push("tipo = ?");
        params.push(categoria);
    }
    //parametro para dirigir el tipo de ordenamiento. este quda por defecto vacio, y solo se llama especificamente a la hora de realizar un ordenamiento.
    if (orderBy === "nombre" || orderBy === "precio"){
        orderBySentence = `order by ${orderBy} ASC`
    }
    
    //se realiza el join de las condiciones para activo o inactivo y categoria.
    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    // COUNT (sin limit/offset), devuelve total de productos.
    const sqlTotal = `SELECT COUNT(*) AS total FROM productos ${where}`;
    const [[{ total }]] = await connection.query(sqlTotal, params);

    // SELECT (con orden + paginado)
    const sql = `SELECT * FROM productos ${where} ${orderBySentence} LIMIT ? OFFSET ?`;
    const rowsParams = [...params, limit, offset];
    const [rows] = await connection.query(sql, rowsParams);

    return { rows, total };
};
/**
 * consulta para obtener producto por Id.
 * @param {*} id 
 * @returns query promesa de consulta con el producto obtenido por id
 */
export const selectProductById = (id) => {
    const sql = `SELECT * from productos WHERE productos.id = ?`;
    return connection.query(sql,[id]);
}
/**
 * consulta para creacion de producto en db
 * @param {*} nombre 
 * @param {*} categoria 
 * @param {*} precio 
 * @param {*} imagen 
 * @returns query promesa objeto de resultado de la inserción en la Db
 */
export const insertProduct = (nombre,categoria,precio,imagen) => {
    let consulta = "INSERT INTO productos(nombre, tipo, precio, img_url) VALUES (?,?,?,?)"
    return connection.query(consulta, [nombre,categoria,precio,imagen])
}
/**
 * consulta para actualizar productos en la db
 * @param {*} activo 
 * @param {*} nombre 
 * @param {*} categoria 
 * @param {*} precio 
 * @param {*} imagen 
 * @param {*} id 
 * @returns query promesa objeto de resultado de la atualizacion del producto en la DB.
 */
export const updateProduct = (activo,nombre,categoria,precio,imagen,id) => {
    let consulta = "UPDATE productos SET activo=?,nombre=?,tipo=?,precio=?,img_url=? WHERE id = ?"
    return connection.query(consulta, [activo,nombre,categoria,precio,imagen,id])
}
/**
 * consulta para eliminar productos en la db
 * @param {*} id 
 * @returns query promesa con resultado de la eliminacion del producto de la db
 */
export const deleteProduct = (id) => {
    let consulta = "delete from productos WHERE id = ?"
    return connection.query(consulta, [id])
}
/**
 * consulta para actualizar el estado de los productos , pasar de activo a inactivo y visceversa
 * @param {*} nuevoActivo 
 * @param {*} id 
 * @returns query promesa con resultado de actualizacion de estado de producto en db
 */
export const updateProductStatus = (nuevoActivo,id) => {
    return connection.query(
            "UPDATE productos SET activo = ? WHERE id = ?", 
            [nuevoActivo, id]
        );
}