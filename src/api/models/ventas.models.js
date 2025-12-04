import connection from "../database/db.js";
/**
 * Consulta para obtener todos las ventas.
 *
 * @returns query promesa de consulta con array ventas de la db, donde el primer elemento son todas las filas de productos. (segundo es fields, los campos)
 */
export const selectAllVentas = () => { 
        const sql =  "SELECT * from ventas"
        return connection.query(sql);
    }
/**
 * Consulta para obtener una venta específica por su Id.
 *
 * @param {number} id El Id de la venta a buscar.
 * @returns query promesa con la venta segun el id de busqueda pasada por parametro
 */
export const selectVentaById = (id) => {
        const sql = "SELECT * from ventas where ventas.id=?"
        return connection.query(sql,[id]);
}
/**
 * Consulta para la creación de una nueva venta en la DB.
 *
 * @param {string} fecha La fecha de la venta.
 * @param {string} nombre_usuario El nombre del usuario asociado a la venta.
 * @param {number} total El monto total de la venta.
 * @returns query promesa objeto de resultado de la inserción en la Db.
 */
export const insertVenta = (fecha,nombre_usuario,total) => {
    let consultaVentas = "INSERT INTO ventas(fecha,nombre_usuario,total) VALUES (?,?,?)"
    return connection.query(consultaVentas, [fecha,nombre_usuario,total])
}
/**
 * consulta para creacion de venta_producto en db, la asociacion de la venta y el producto vendido
 * Asocia un producto vendido con una venta específica.
 *
 * @param {number} venta_id El ID de la venta principal a la que pertenece el registro.
 * @param {number} producto_id El ID del producto vendido.
 * @param {number} precio El precio unitario del producto al momento de la venta.
 * @param {number} cantidad La cantidad vendida de ese producto.
 * @returns query promesa objeto de resultado de la inserción en la Db
 */
export const insertVentaProducto = (venta_id, producto_id, precio, cantidad) => {
    let consultaVentasProducto = "INSERT INTO ventas_productos(venta_id, producto_id, precio, cantidad) VALUES (?,?,?,?)"
    return connection.query(consultaVentasProducto, [venta_id, producto_id, precio, cantidad])
}