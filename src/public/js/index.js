async function alternarActivoProducto(p) {            
    // Cambiar el valor
    p.activo = p.activo == 0 ? 1 : 0;
    // Llamar al update
    let resultado = await actualizarProducto(p);
    console.log(resultado);
    
    const textoEstado = document.getElementById(`estado-${p.id}`);
    textoEstado.textContent = p.activo ? "ACTIVO" : "INACTIVO";
    // Actualizar el texto del botón
    const boton = document.getElementById(`boton-${p.id}`);
    console.log(p.activo);
    
    boton.textContent = p.activo ? "Desactivar" : "Activar";
}

async function actualizarProducto(p) {  
    try{
        let respuesta = await fetch(`http://localhost:3000/api/productos/${p.id}`, {
            method:"PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(p)
        }
    );
        console.log(respuesta);
        
        let resultado = await respuesta.json();
        console.log(resultado);
        
        if (respuesta.ok){
            console.log(resultado.message);
            return resultado
        }else{
            console.error("Error al enviar los datos, ", resultado.message);
        }
    }catch(error){
        console.error("Error al enviar los datos: " , error)
        alert("Error al procesar la solicitud")
    }
    }

