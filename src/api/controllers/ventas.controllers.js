import { insertVenta, selectAllVentas, selectVentaById , insertVentaProducto } from "../models/ventas.models.js";

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