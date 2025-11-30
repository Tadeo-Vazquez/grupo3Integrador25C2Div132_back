import { deleteProduct, insertProduct, selectAllProducts, selectProductById, selectProducts, updateProduct } from "../models/product.models.js";


export const getAllProducts = async (req,res) => {
    try{
        let limit;
        if (req.query.limite === undefined){
            limit = undefined;
        }else{
            limit = parseInt(req.query.limit) || 10
        }
        const offset = parseInt(req.query.offset) || 0
        const pagina = await selectProducts({limit,offset})
        
        res.status(200).json({
            payload: pagina,
            message: pagina.rows.length === 0 ? "no se encontraron productos":"productos obtenidos"
        })
        
    }catch(error){
        console.log(error);
        
        console.error("ERROR obteniendo productos: ", error.message);
        res.status(500).json({
            message: "Error interno al obtener productos"
        })
    }
}

export const getProductById = async (req,res) => {
    try{
        let {id} = req.params; // traemos el :id ingresado en la url 
        
        const [rows] = await selectProductById(id);
        
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
}

export const createProduct = async (req,res) => {
    try{
        let {nombre,categoria,precio} = req.body;
        let imagen = req.file;
        if (!nombre || !imagen || !categoria || !precio){
            return res.status(400).json({
                message: `Rellena todos los campos`
            })
        }
        let pathImagen = "img/" + imagen.filename;
        let [rows] = await insertProduct(nombre,categoria,precio,pathImagen)
        
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
}

export const modifyProduct = async (req,res) => {
    try{
        let {id,activo,nombre,categoria,precio} = req.body;
        let imagen = req.file
        if (!id || activo === undefined || !nombre || !imagen || !categoria || !precio){
            return res.status(400).json({
                message: `Rellena todos los campos`
            })
        }
        let pathImagen = "img/" + imagen.filename;

        let [result] = await updateProduct(activo,nombre,categoria,precio,pathImagen,id)
        
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
}

export const  removeProduct = async (req,res)=>{
    try{
        let {id} = req.params;

        let [rows] = await deleteProduct(id)

        if (rows.affectedRows === 0){
            return res.status(400).json({
                message: `No se elimino el producto con id ${id}`
            })
        }
        
        res.status(200).json({
            message: "producto eliminado exitosamente"
        });
    }catch(error){
        console.error("Error al eliminar el producto por su id: " , error);
        res.status(500).json({
            message: "Error interno al eliminar producto",
            error: error.message
        })
    }
}