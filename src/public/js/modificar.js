let contenedorProductos = document.getElementById("listadoProductos");
let form = document.getElementById("getProductos-form")
let contenedorFormulario = document.getElementById("contenedorFormulario")
const URL_BASE = "http://localhost:3000/";
form.addEventListener("submit", async event => {
    event.preventDefault() // prevenimos el envio por defecto del form

    // parseamos a un objeto formdata la info del form
    let formData = new FormData(event.target);

    let data = Object.fromEntries(formData.entries());

    let idProducto = data.idProd;
    console.log(idProducto);
    
    try{
        let respuesta = await fetch(`${URL_BASE}api/productos/${idProducto}`);
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
                        <img src="${URL_BASE}${p.img_url}" alt="${p.nombre}" class="img-listados">
                        <p>Id: ${p.id} &nbsp; Nombre: ${p.nombre}</p>
                        <strong>Precio: $${p.precio}</strong>
                        </li>
                            <li class="li-botonera">
                            <input type="button" id="updateProduct_button" value="">
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
        <div>
        <label for="nombre">Nombre</label>
        <input type="text" name="nombre" id="nombre" class="inTransColor" value="${producto.nombre}" required>
        </div>
        <div>
            <p>Imagen actual (arrastrar y soltar en caso de no modificarla):</p>
            <img src="${URL_BASE}${producto.img_url}" alt="Imagen actual" class="img-actual" style="width:150px; border-radius:8px">
            <label id="dropArea" class="drop-zone">
                <p class="drop-text">Arrastra un archivo aquí o <span>explora</span></p>
                <p class="drop-subtext">Tamaño máximo: 5MB</p>
                <input type="file" id="fileInput" name="image" />
            </label>

            <div class="file-preview" id="filePreview">
                <div id="fileName">Archivo: </div>
            </div>
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
        <input type="number" min="0" max="1" step="1" value="${producto.activo}" name="activo" required>
        </div>
        <input type="submit" value="Actualizar producto" id="boton-creaProd">
    </form>
    `;

    contenedorFormulario.innerHTML = updateFormHTML;

    let updateProducts_form = document.getElementById("updateProductos-form");

    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileInput');
    const filePreview = document.getElementById('filePreview');
    const fileName = document.getElementById('fileName');

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
        showFile(fileInput.files[0]);
        }
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, e => {
        e.preventDefault();
        dropArea.classList.add('dragover');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, e => {
        e.preventDefault();
        dropArea.classList.remove('dragover');
        });
    });

    dropArea.addEventListener('drop', e => {
        const files = e.dataTransfer.files;
        if (files.length) {
        fileInput.files = files;
        showFile(files[0]);
        }
    });

    
    updateProducts_form.addEventListener("submit", event => {
        actualizarProducto(event);
    });
}

async function actualizarProducto(event) {
    event.preventDefault();
    event.stopPropagation();
    
    let formData = new FormData(event.target);
    console.table(formData)
    
    try{
        let respuesta = await fetch("http://localhost:3000/api/productos", {
            method:"PUT",
            body: formData
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
        console.table(formData);
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

// multer subir imagen

const API_URL = "http://localhost:3000/";


function showFile(file) {
    filePreview.style.display = 'flex';
    fileName.textContent = `Archivo: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
}