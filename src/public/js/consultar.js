let contenedorMensaje = document.getElementById("contenedorMensaje")
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
        let datos = await respuesta.json();
        if (respuesta.ok){
            let producto = datos.payload[0];    
            mostrarProducto(producto)
            }else{
                mostrarError(datos.message)
            }

    }catch(error){
        console.error(error)
    
    }

}
)

function mostrarProducto(p){
    let htmlProducto = `<li class="li-listados">
                        <img src="https://nftcalendar.io/storage/uploads/2022/02/21/image-not-found_0221202211372462137974b6c1a.png" alt="${p.nombre}" class="img-listados">
                        <p>Id: ${p.id}</p>  <p>Nombre: ${p.nombre}</p>
                        <strong>Precio: $${p.precio}</strong>
                        </li>`;

    contenedorProductos.innerHTML = htmlProducto;
    contenedorMensaje.innerHTML = ``
}

function mostrarError(message){
    contenedorProductos.innerHTML = "";
    contenedorMensaje.innerHTML = `<span id="span-mensaje-error"> ${message} </span>`
}