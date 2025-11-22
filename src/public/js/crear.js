let url = `http://localhost:3000/api/productos`;
let altaProductos_form = document.getElementById("altaProductos-form")
let contMensajeCreado = document.getElementById("cont-mensaje-creado")
altaProductos_form.addEventListener("submit", event => {
    event.preventDefault();
    let formData = new FormData(event.target);
    let data = Object.fromEntries(formData.entries())

    enviarProducto(data)
})

async function enviarProducto(data){
    console.table(data)
    try{
        let respuesta = await fetch(url, {
            method:"POST",
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
            contMensajeCreado.innerHTML = "<h1 id='prodCreado'>Producto Creado</h1>";
            contMensajeCreado.style.display = "flex";
            setTimeout(() => {
                contMensajeCreado.style.display = "none";
            }, 5000);
        }else{
            console.error("Error al enviar los datos, ", resultado.message);
            contMensajeCreado.innerHTML = "<h1 id='prodNoCreado'>Error: Producto no creado</h1>";
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