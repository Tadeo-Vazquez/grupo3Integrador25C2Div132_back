import connection from "../database/db.js";

/**
 * Consulta para obtener todos los productos.
 *
 * @returns query promesa de consulta con array productos de la db, donde el primer elemento son todas las filas de productos. (segundo es fields, los campos)
 */
export const selectAllProducts = () => {
    const sql = "SELECT * from productos";
    return connection.query(sql);
}
/**
 * Consulta para obtener productos bajo condiciones de filtro, orden y paginación.
 *
 * @param {object} param0 Parámetros de consulta.
 * @param {number} [param0.limit=10] Límite de productos por página.
 * @param {number} [param0.offset=0] Desplazamiento para la paginación.
 * @param {boolean} [param0.soloActivos=false] Filtra solo por productos activos.
 * @param {string} [param0.categoria="todos"] Filtra por tipo de producto.
 * @param {string} [param0.orderBy=""]  ordenar por.
 * @returns query promesa con los productos segun la condiciones de busqueda pasada por parametro y el total de productos sin paginar (`total`).
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
 * Consulta para obtener un producto específico por su Id.
 *
 * @param {number} id El ID del producto a buscar.
 * @returns  query promesa de consulta con el producto obtenido por id contiene las filas del producto encontrado (o array vacío).
 */
export const selectProductById = (id) => {
    const sql = `SELECT * from productos WHERE productos.id = ?`;
    return connection.query(sql,[id]);
}
/**
 * Consulta para la creación de un nuevo producto en la DB.
 *
 * @param {string} nombre Nombre del producto.
 * @param {string} categoria Categoría/tipo del producto.
 * @param {number} precio Precio del producto.
 * @param {string} imagen URL o ruta de la imagen.
 * @returns query promesa objeto de resultado de la inserción en la Db.
 */
export const insertProduct = (nombre,categoria,precio,imagen) => {
    let consulta = "INSERT INTO productos(nombre, tipo, precio, img_url) VALUES (?,?,?,?)"
    return connection.query(consulta, [nombre,categoria,precio,imagen])
}
/**
 * Consulta para la actualización completa de un producto en la DB.
 *
 * @param {number} activo Estado activo (1) o inactivo (0).
 * @param {string} nombre Nombre del producto.
 * @param {string} categoria Categoría/tipo del producto.
 * @param {number} precio Precio del producto.
 * @param {string} imagen URL o ruta de la imagen.
 * @param {number} id ID del producto a actualizar.
 * @returns query promesa objeto de resultado de la atualizacion del producto en la DB.
 */
export const updateProduct = (activo,nombre,categoria,precio,imagen,id) => {
    let consulta = "UPDATE productos SET activo=?,nombre=?,tipo=?,precio=?,img_url=? WHERE id = ?"
    return connection.query(consulta, [activo,nombre,categoria,precio,imagen,id])
}
/**
 * Consulta para eliminar un producto de la DB.
 *
 * @param {number} id El ID del producto a eliminar.
 * @returns query promesa con resultado de la eliminacion del producto de la db.
 */
export const deleteProduct = (id) => {
    let consulta = "delete from productos WHERE id = ?"
    return connection.query(consulta, [id])
}
/**
 * Consulta para actualizar solo el estado (activo/inactivo) de un producto.
 *
 * @param {number} nuevoActivo El nuevo estado (1 para activo, 0 para inactivo).
 * @param {number} id ID del producto.
 * @returns  query promesa con resultado de actualizacion de estado de producto en db.
 */
export const updateProductStatus = (nuevoActivo,id) => {
    return connection.query(
            "UPDATE productos SET activo = ? WHERE id = ?", 
            [nuevoActivo, id]
        );
}