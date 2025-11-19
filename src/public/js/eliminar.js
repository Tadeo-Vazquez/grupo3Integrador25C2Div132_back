let contMensajeCreado = document.getElementById("contMensajeCreado")
let contenedorProductos = document.getElementById("listadoProductos");
let form = document.getElementById("getProductos-form")

form.addEventListener("submit", async event => {
    event.preventDefault() // prevenimos el envio por defecto del form

    // parseamos a un objeto formdata la info del form
    let formData = new FormData(event.target);

    let data = Object.fromEntries(formData.entries());

    let idProducto = data.idProd;
    console.log(idProducto);
    
    try{
        let respuesta = await fetch(`http://localhost:3000/api/productos/${idProducto}`);
        if (respuesta.ok){
            let datos = await respuesta.json();
            let producto = datos.payload[0];    
            mostrarProducto(producto)
            }else{
                alert(`No existe producto con id ${idProducto}`)
            }
    }catch(error){
        console.error(error)
    
    }

}
)

function mostrarProducto(p){
    let htmlProducto = `<li class="li-listados">
                        <img src="${p.img_url}" alt="${p.nombre}" class="img-listados">
                        <p>Id: ${p.id} &nbsp; Nombre: ${p.nombre}</p>
                        <strong>Precio: $${p.precio}</strong>
                        </li>
                        <li class="li-botonera">
                            <input type="button" id="botonEliminarProducto" value="Eliminar producto">
                        </li>`;
                        contenedorProductos.innerHTML = htmlProducto
                        let eliminar_producto_boton = document.getElementById("botonEliminarProducto")
                        eliminar_producto_boton.addEventListener("click", event => {
                            event.stopPropagation()
                            let confirmacion = confirm("Estas seguro que queres eliminar el producto?")
                            if (!confirmacion){
                                alert("Eliminación del producto cancelada")
                            }else{
                                eliminarProducto(p.id)
                            }
                        }
                    )
    
}

async function eliminarProducto(id) {
    let url = "http://localhost:3000/api/productos"
    try{
        let respuesta = await fetch(`${url}/${id}`, {
            method:"DELETE",
        }
        );
        console.log(respuesta);
        
        let resultado = await respuesta.json();
        console.log(resultado);
        
        if (respuesta.ok){
            console.log(resultado.message);
            contMensajeCreado.innerHTML = "<h1 id='prodCreado'>Producto Eliminado!</h1>";
            contMensajeCreado.style.display = "flex";
            setTimeout(() => {
                contMensajeCreado.style.display = "none";
            }, 5000);
            contenedorProductos.innerHTML = ""
        }else{
            console.error("Error al enviar los datos, ", resultado.message);
            contMensajeCreado.innerHTML = "<h1 id='prodNoCreado'>Error: Producto no Eliminado</h1>";
            contMensajeCreado.style.display = "flex";
            setTimeout(() => {
                contMensajeCreado.style.display = "none";
            }, 5000);
        }
    }catch(error){
        console.error("Error en la solicitud DELETE: " , error)
        alert("Error al procesar la solicitud")
    }
}