import connection from "../database/db.js";

export const selectAllVentas = () => { 
        const sql =  "SELECT * from ventas"
        return connection.query(sql);
    }
export const selectVentaById = (id) => {
        const sql = "SELECT * from ventas where ventas.id=?"
        return connection.query(sql,[id]);
}

export const insertVenta = (fecha,nombre_usuario,total) => {
    let consultaVentas = "INSERT INTO ventas(fecha,nombre_usuario,total) VALUES (?,?,?)"
    return connection.query(consultaVentas, [fecha,nombre_usuario,total])
}

export const insertVentaProducto = (venta_id, producto_id, precio, cantidad) => {
    let consultaVentasProducto = "INSERT INTO ventas_productos(venta_id, producto_id, precio, cantidad) VALUES (?,?,?,?)"
    return connection.query(consultaVentasProducto, [venta_id, producto_id, precio, cantidad])
}