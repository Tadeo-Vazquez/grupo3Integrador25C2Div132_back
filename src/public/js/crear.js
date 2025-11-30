let url = `http://localhost:3000/api/productos`;
let altaProductos_form = document.getElementById("altaProductos-form")
let contMensajeCreado = document.getElementById("cont-mensaje-creado")
altaProductos_form.addEventListener("submit", event => {
    event.preventDefault();
    let formData = new FormData(event.target);
    enviarProducto(formData)
})

async function enviarProducto(data){
    console.table(data)
    try{
        let respuesta = await fetch(url, {
            method:"POST",
            body: data
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

// multer subir imagen

const API_URL = "http://localhost:3000/";

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

function showFile(file) {
    filePreview.style.display = 'flex';
    fileName.textContent = `Archivo: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
}
