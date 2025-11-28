const API_URL = "http://localhost:3000/";

 const dropArea = document.getElementById('dropArea');
const fileInput = document.getElementById('fileInput');
const uploadForm = document.getElementById('uploadForm');
const filePreview = document.getElementById('filePreview');
const fileName = document.getElementById('fileName');
const progressFill = document.getElementById('progressFill');

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
    progressFill.style.width = '0%';
    progressFill.style.backgroundColor = '#2563eb';
}

document
  .getElementById("uploadForm")
  .addEventListener("submit", async (evn) => {
    evn.preventDefault();
    console.log("hola");
    
    const file = fileInput.files[0];
    if (!file) return alert("seleccione un archivo.");

    const data = new FormData();
    data.append("image", file);

    console.log(data);
    try {
      const resp = await fetch(API_URL + "api/productos/upload", {
        method: "POST",
        body: data,
      });

      const dataRes = await resp.json();

      if (resp.ok) {
        progressFill.style.backgroundColor = "#22c55e";
        progressFill.style.width = "100%";

        const image = await fetch(API_URL + `images/${dataRes.payload.url}`);
        const blob = await image.blob();
        const objectURL = URL.createObjectURL(blob);
        const imagen = `<br> <img style="width:200px" src="${objectURL}"/>`;

        document.body.innerHTML += imagen;
      }
    } catch (error) {
      progressFill.style.backgroundColor = "#ef4444";
      progressFill.style.width = "100%";
      console.log(error.message);
    }
  });

  

  