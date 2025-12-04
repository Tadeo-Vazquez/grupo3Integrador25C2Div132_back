import connection from "../database/db.js";
/**
 * consulta para obtener todos las ventas
 * @returns query promesa de consulta con las ventas de la db
 */
export const selectAllVentas = () => { 
        const sql =  "SELECT * from ventas"
        return connection.query(sql);
    }
/**
 *  consulta para obtener venta por Id
 * @param {*} id 
 * @returns retorna la query promesa con la venta segun el id de busqueda pasada por parametro
 */
export const selectVentaById = (id) => {
        const sql = "SELECT * from ventas where ventas.id=?"
        return connection.query(sql,[id]);
}
/**
 * consulta para creacion de venta en db
 * @param {*} fecha 
 * @param {*} nombre_usuario 
 * @param {*} total 
 * @returns query promesa objeto de resultado de la inserción en la Db
 */
export const insertVenta = (fecha,nombre_usuario,total) => {
    let consultaVentas = "INSERT INTO ventas(fecha,nombre_usuario,total) VALUES (?,?,?)"
    return connection.query(consultaVentas, [fecha,nombre_usuario,total])
}
/**
 * consulta para creacion de venta_producto en db, la asociacion de la venta y el producto vendido
 * @param {*} venta_id 
 * @param {*} producto_id 
 * @param {*} precio 
 * @param {*} cantidad 
 * @returns query promesa objeto de resultado de la inserción en la Db
 */
export const insertVentaProducto = (venta_id, producto_id, precio, cantidad) => {
    let consultaVentasProducto = "INSERT INTO ventas_productos(venta_id, producto_id, precio, cantidad) VALUES (?,?,?,?)"
    return connection.query(consultaVentasProducto, [venta_id, producto_id, precio, cantidad])
}