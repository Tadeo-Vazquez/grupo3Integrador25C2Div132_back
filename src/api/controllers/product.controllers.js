import { deleteProduct, insertProduct, selectProductById, selectProducts, updateProduct, updateProductStatus } from "../models/product.models.js";

/**
 * Controlador de ruta (GET /).
 * Obtiene un listado paginado y filtrado de productos desde la base de datos.
 *
 * @param {object} req Objeto de solicitud de Express (contiene query params para paginación y filtro).
 * @param {object} res Objeto de respuesta de Express.
 * @returns  Respuesta HTTP 200 con el listado de productos o 500 si hay un error.
 * El cuerpo JSON incluye:
 * - payload: El objeto de paginación con 'rows' (productos) y 'total'.
 * - message: Mensaje de éxito o no encontrado.
 */
export const getAllProducts = async (req,res) => {
    try{
        let limit;
        let soloActivos;
        let categoria;
        let orderBy;
        if (req.query.limit !== undefined){
            limit = parseInt(req.query.limit) || 10
        }

         //si req.query.soloActivos ="true" o "1", se busca soloActivos
        if (req.query.soloActivos === "true" || req.query.soloActivos === "1"){
            soloActivos = true
        }
        //depende la categoria pasada por re1.query.categoria, se asigna a la categoria a buscar
        if (req.query.categoria !== undefined){
            categoria = req.query.categoria
        }
        //depende el tipo de ordenamiento pasado por req.query.orderBy se asigna a orderBy para realizar un ordenamiento.
        if (req.query.orderBy !== undefined){
            orderBy = req.query.orderBy
        }

        const offset = parseInt(req.query.offset) || 0
        const pagina = await selectProducts({limit,offset,soloActivos,categoria,orderBy})
        
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

/**
 * Controlador de ruta (GET /:id).
 * Busca y retorna un único producto de la base de datos por su ID.
 *
 * @param {object} req Objeto de solicitud de Express. Espera el ID del producto en `req.params`.
 * @param {object} res Objeto de respuesta de Express.
 * @returns Respuesta HTTP 200 con el producto, 404 si no existe, o 500 en caso de error.
 * El cuerpo JSON incluye:
 * - payload: El array con el objeto producto encontrado.
 * - message: Mensaje de error si el producto no existe.
 */
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
/**
 * Controlador de ruta (POST /).
 * Crea un nuevo producto en la base de datos con los datos recibidos y la ruta de la imagen.
 *
 * @param {object} req Objeto de solicitud de Express. Espera los datos del producto en `req.body`
 * y el archivo de imagen en `req.file`.
 * @param {object} res Objeto de respuesta de Express.
 * @returns Respuesta HTTP 201 si el producto se crea exitosamente, o 400/500 si hay errores de validación o servidor.
 * El cuerpo JSON incluye:
 * - message: Mensaje de éxito o error.
 */
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
/**
 * Controlador de ruta (PUT /).
 * Actualiza un producto existente en la base de datos. Requiere todos los campos y la imagen.
 *
 * @param {object} req Objeto de solicitud de Express. Espera todos los datos del producto a modificar en `req.body`
 * y el archivo de imagen en `req.file`.
 * @param {object} res Objeto de respuesta de Express.
 * @returns  Respuesta HTTP 200 si la actualización es exitosa, 400 si faltan campos o no se actualiza ninguna fila, o 500 en caso de error.
 * El cuerpo JSON incluye:
 * - message: Mensaje de éxito o error.
 */
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
/**
 * Controlador de ruta (DELETE /:id).
 * Elimina un producto de la base de datos usando el ID proporcionado en los parámetros de la URL.
 *
 * @param {object} req Objeto de solicitud de Express. Espera el ID del producto a eliminar en `req.params`.
 * @param {object} res Objeto de respuesta de Express.
 * @returns Respuesta HTTP 200 si la eliminación es exitosa, 400 si no se elimina ninguna fila (ID no encontrado), o 500 en caso de error.
 * El cuerpo JSON incluye:
 * - message: Mensaje de éxito o error.
 */
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
/**
 * Controlador de ruta (PUT /:id/toggleStatus).
 * Alterna el estado 'activo' (0 o 1) de un producto específico.
 *
 * @param {object} req Objeto de solicitud de Express. Espera el ID del producto en `req.params`.
 * @param {object} res Objeto de respuesta de Express.
 * @returns Respuesta HTTP 200 con el nuevo estado, 404 si el producto no existe, o 500 en caso de error.
 * El cuerpo JSON incluye:
 * - message: Mensaje de éxito.
 * - activo: El nuevo valor (0 o 1) del estado del producto.
 */
export const alternateProdStatus = async (req, res) => {
    const id = req.params.id;
    try {
        // Obtener valor actual
        const [rows] = await selectProductById(id)
        if (rows.length === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        const producto = rows[0]

        // Alternar (0 → 1, 1 → 0)
        const nuevoActivo = producto.activo == 1 ? 0 : 1;

        // Guardar
        updateProductStatus(nuevoActivo,id)

        res.json({ 
            message: "Actualizado", 
            activo: nuevoActivo 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error de servidor" });
    }
}