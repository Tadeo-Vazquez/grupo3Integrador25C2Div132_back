const loggerUrl = (req,res,next)=>{
    console.log(`[${new Date().toLocaleString()}]  ${req.method}  ${req.url}`);
    next()
}

const validarId = (req,res,next) => {
    const {id} = req.params;
    if (!id || isNaN(id)){
        return res.status(400).json({
            message: "El id debe ser un numero"
        })
    }
    req.id = parseInt(id,10);
    console.log("id validado: " , req.id);

    next();
}





export{
    loggerUrl,
    validarId
}