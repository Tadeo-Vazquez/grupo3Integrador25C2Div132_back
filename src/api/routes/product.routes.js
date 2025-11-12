import connection from "../database/db.js";
import { validarId } from "../middlewares/middlewares.js";


import { Router } from "express";
const router = Router();

// get all products
router.get("/", async (req,res) => {
    try{
        const sql = "SELECT * from productos";
        const [rows,fields] = await connection.query(sql);

        res.status(200).json({
            payload: rows,
            message: rows.length === 0 ? "no se encontraron productos":"productos obtenidos"
        })
        
    }catch(error){
        console.error("ERROR obteniendo productos: ", error.message);
        res.status(500).json({
            message: "Error interno al obtener productos"
        })
    }
})

// get product by id
router.get("/:id", validarId ,async (req,res) => {
    try{
        let {id} = req.params; // traemos el :id ingresado en la url 
        
        const sql = `SELECT * from productos WHERE productos.id = ?`;
        const [rows] = await connection.query(sql,[id]);
        if (rows.length == 0){
            console.error("No existe producto con ese id");
            return res.status(404).json({
                message: `No se encontro producto con id ${id}`
            })
        }
        res.status(200).json({
            payload: rows,
        })
    }catch(error){
        console.error("ERROR obteniendo producto por id: ", error.message);
        res.status(500).json({
            message: "Error interno al obtener producto por id",
            error: error.message
        })
    }
})

// crear nuevo producto
router.post("/", async (req,res) => {
    try{
        let {nombre,imagen,categoria,precio} = req.body;

        if (!nombre || !imagen || !categoria || !precio){
            return res.status(400).json({
                message: `Rellena todos los campos`
            })
        }

        let consulta = "INSERT INTO productos(nombre, tipo, precio, img_url) VALUES (?,?,?,?)"
        let [rows] = await connection.query(consulta, [nombre,categoria,precio,imagen])
        
        res.status(201).json({
            message: "producto creado exitosamente"
        });           
    }catch(error){
        console.log("Error al crear producto " , error);
        res.status(500).json({
            message: "Error interno al crear producto",
            error: error.message
        })
    }
})

// PUT actualizar productos
router.put("/", async (req,res) => {
    try{
        let {id,activo,nombre,imagen,categoria,precio} = req.body;
        
        if (!id || !activo || !nombre || !imagen || !categoria || !precio){
            return res.status(400).json({
                message: `Rellena todos los campos`
            })
        }

        let consulta = "UPDATE productos SET activo=?,nombre=?,tipo=?,precio=?,img_url=? WHERE id = ?"
        let [result] = await connection.query(consulta, [activo,nombre,categoria,precio,imagen,id])
        
        if (result.affectedRows === 0){
            return res.status(400).json({
                message: "No se actualizo el producto"
            })
        }
        
        res.status(200).json({
            message: "producto actualizado exitosamente"
        });           
    }catch(error){
        console.log("Error al actualizar producto " , error);
        res.status(500).json({
            message: "Error interno al actualizar producto",
            error: error.message
        })
    }
})

router.delete("/:id", validarId ,async (req,res)=>{
    try{
        let {id} = req.params;
        let consulta = "delete from productos WHERE id = ?"
        let [rows] = await connection.query(consulta, [id])
        if (rows.affectedRows === 0){
            return res.status(400).json({
                message: `No se elimino el producto con id ${id}`
            })
        }
        
        res.status(200).json({
            message: "producto actualizado exitosamente"
        });
    }catch(error){
        console.error("Error al eliminar el producto por su id: " , error);
        res.status(500).json({
            message: "Error interno al actualizar producto",
            error: error.message
        })
    }
})

export default router;