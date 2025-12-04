import { insertVenta, selectAllVentas, selectVentaById , insertVentaProducto } from "../models/ventas.models.js";


/**
 * Controlador de ruta (GET /ventas).
 * Obtiene y retorna un listado de todas las ventas registradas en la base de datos.
 *
 * @param {object} req Objeto de solicitud de Express. No espera parámetros de query.
 * @param {object} res Objeto de respuesta de Express.
 * @returns Respuesta HTTP 200 con el listado de ventas o 500 en caso de error.
 * El cuerpo JSON incluye:
 * - payload: El array con los objetos de venta.
 * - message: Mensaje de éxito o no encontrado.
 */
export const getAllVentas = async (req,res) => {
    try{
        const [rows] = await selectAllVentas();

        res.status(200).json({
            payload: rows,
            message: rows.length === 0 ? "no se encontraron ventas":"ventas obtenidas"
        })
    }catch(error){
        console.error("ERROR obteniendo ventas: ", error.message);
        res.status(500).json({
            message: "Error interno al obtener ventas"
        })
    }
}
/**
 * Controlador de ruta (GET /ventas/:id).
 * Busca y retorna una única venta de la base de datos por su ID.
 *
 * @param {object} req Objeto de solicitud de Express. Espera el ID de la venta en `req.params`.
 * @param {object} res Objeto de respuesta de Express.
 * @returns Respuesta HTTP 200 con la venta, 404 si no existe, o 500 en caso de error.
 * El cuerpo JSON incluye:
 * - payload: El objeto de venta encontrado.
 * - message: Mensaje de éxito o no encontrado.
 */
export const getVentaById = async (req,res) => {
    try{
        let {id} = req.params;

        const [rows] = await selectVentaById(id);

        res.status(200).json({
            payload: rows[0],
            message: rows.length === 0 ? `no se encontro producto con id ${id}` : "productos obtenidos"
        })
    }catch(error){
        console.error("ERROR obteniendo productos: ", error.message);
        res.status(500).json({
            message: "Error interno al obtener producto por id",
            error: error.message
        })
    }
}
/**
 * Controlador de ruta (POST /ventas).
 * Crea una nueva venta en la base de datos, calculando el total y registrando cada producto vendido.
 *
 * @param {object} req Objeto de solicitud de Express. Espera los detalles de la venta (`fecha`, `nombre_usuario`)
 * y un array de `productos` en `req.body`.
 * @param {object} res Objeto de respuesta de Express.
 * @returns Respuesta HTTP 201 si la venta se concreta exitosamente, o 400/500 si hay errores de validación o servidor.
 * El cuerpo JSON incluye:
 * - message: Mensaje de éxito o error.
 */
export const createVenta = async (req,res) => {
    try{
        let {fecha,nombre_usuario,productos} = req.body;
        console.log(req.body);
        
        if (!fecha || !nombre_usuario || !Array.isArray(productos) || !productos){
            return res.status(400).json({
                message: `Envia todos los campos completos de la venta`
            })
        }
        let total = productos.reduce((acum,p) => acum + p.precio * p.cantidad, 0)
                
        let [rows] = await insertVenta(fecha,nombre_usuario,total)
        console.log(rows);     
        const venta_id = rows.insertId;
        
        for (const p of productos){
            const {id,precio,cantidad} = p;
            let [result] = await insertVentaProducto(venta_id, id, precio, cantidad)
            console.log("producto vendido");
            
        }      
        res.status(201).json({
            message: `Venta concretada`
        });  
    }catch(error){
       console.log(error);
       
    }
}