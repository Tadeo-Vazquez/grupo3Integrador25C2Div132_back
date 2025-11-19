let contenedorProductos = document.getElementById("listadoProductos");
let form = document.getElementById("getProductos-form")
let contenedorFormulario = document.getElementById("contenedorFormulario")

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
                            <input type="button" id="updateProduct_button" value="Actualizar producto">
                        </li>`;
    contenedorProductos.innerHTML = htmlProducto
    let updateProduct_button = document.getElementById("updateProduct_button");

    updateProduct_button.addEventListener("click", event => {
        crearFormularioPut(event, p);
    })

}
async function crearFormularioPut(event, producto) {
    event.stopPropagation();
    console.table(producto);

    let updateFormHTML = `
    <form id="updateProductos-form" style="display: flex; flex-direction: column;">
        <input type="hidden" name="id" id="idProd" value="${producto.id}">
        <input type="hidden" name="activo" id="idProd" value="${producto.activo}">
        <div>
        <label for="nombre">Nombre</label>
        <input type="text" name="nombre" id="nombre" class="inTransColor" value="${producto.nombre}" required>
        </div>
        <div>
        <label for="imagenProdForm">Imagen</label>
        <input type="text" name="imagen" id="imagenProdForm" class="inTransColor" value="${producto.img_url}" required>
        </div>
        <div>
        <label for="catProducto">Categoria</label>
        <select name="categoria" id="catProducto" class="inTransColor" required>
            <option value="digital">DIGITAL</option>
            <option value="fisico">FISICO</option>
        </select>
        </div>
        <div>
        <label for="precioProdForm">Precio</label>
        <input type="number" name="precio" id="precioProdForm" class="inTransColor" value="${producto.precio}"required>
        </div>
        <div>
        <label for="activo">Activo</label>
        <input type="checkbox" name="activo" id="activo" class="inTransColor" value="${producto.activo}" required>
        </div>
        <input type="submit" value="Actualizar producto" id="boton-creaProd">
    </form>
    `;

    contenedorFormulario.innerHTML = updateFormHTML;

    let updateProducts_form = document.getElementById("updateProductos-form");

    updateProducts_form.addEventListener("submit", event => {
        actualizarProducto(event);
    });
}

async function actualizarProducto(event) {
    event.preventDefault();
    event.stopPropagation();

    let formData = new FormData(event.target);
    let data = Object.fromEntries(formData.entries())
    console.table(data)
    
    try{
        let respuesta = await fetch("http://localhost:3000/api/productos", {
            method:"PUT",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
        );
        console.log(respuesta);
        
        let resultado = await respuesta.json();
        console.log(resultado);
        
        if (respuesta.ok){
            console.log(resultado.message);
            contMensajeCreado.innerHTML = "<h1 id='prodCreado'>Producto Actualizado</h1>";
            contMensajeCreado.style.display = "flex";
            setTimeout(() => {
                contMensajeCreado.style.display = "none";
            }, 5000);
            contenedorProductos.innerHTML = ""
            contenedorFormulario.innerHTML = ""
        }else{
            console.error("Error al enviar los datos, ", resultado.message);
            contMensajeCreado.innerHTML = "<h1 id='prodNoCreado'>Error: Producto no actualizado</h1>";
            contMensajeCreado.style.display = "flex";
            setTimeout(() => {
                contMensajeCreado.style.display = "none";
            }, 5000);
        }
    }catch(error){
        console.error("Error al enviar los datos: " , error)
        alert("Error al procesar la solicitud")
    }
}