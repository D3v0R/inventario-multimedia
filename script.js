const API_URL = "https://inventario-multimedia.onrender.com";
const contenedor = document.getElementById('contenedor-datos');
const formulario = document.getElementById('uploadForm');

// Función para renderizar las tarjetas multimedia (Imagen, Audio, Título, Descripción)
function renderizar(datos) {
    contenedor.innerHTML = datos.length ? "" : "<p class='text-center text-gray-500 italic mt-8'>No se encontraron elementos.</p>";
    
    datos.forEach(item => {
        const rutaImagen = item.archivos && item.archivos.imagen ? item.archivos.imagen : null;
        const rutaAudio = item.archivos && item.archivos.audio ? item.archivos.audio : null;
        
        const imagenHTML = rutaImagen ? `<img src="${API_URL}/${rutaImagen}" class="w-full h-56 object-cover mb-3 rounded shadow-md" alt="Imagen">` : '';
        const audioHTML = rutaAudio ? `<audio controls class="w-full mt-3 rounded"><source src="${API_URL}/${rutaAudio}"></audio>` : '';

        contenedor.innerHTML += `
            <div class="bg-gray-800 p-5 rounded-lg border-l-4 border-purple-500 mb-4 shadow-xl hover:bg-gray-750 transition-all">
                ${imagenHTML}
                <h3 class="font-bold text-2xl text-white tracking-wide">${item.titulo}</h3>
                <p class="text-gray-400 mt-2 leading-relaxed">${item.descripcion}</p>
                ${audioHTML}
                <div class="mt-5 flex gap-3">
                    <button onclick="editar('${item._id}', '${item.titulo}')" class="bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded text-sm font-bold transition-colors shadow">Editar</button>
                    <button onclick="eliminar('${item._id}')" class="bg-red-600 hover:bg-red-500 px-4 py-1.5 rounded text-sm font-bold transition-colors shadow">Borrar</button>
                </div>
            </div>`;
    });
}

// CRUD: Create (Subir con archivos usando FormData)
formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target); 
    
    try {
        const res = await fetch(`${API_URL}/guardar`, { method: 'POST', body: formData });

        if (res.ok) { 
            formulario.reset(); 
            document.getElementById('texto-imagen').textContent = 'Ningún archivo';
            document.getElementById('texto-audio').textContent = 'Ningún archivo';
            document.getElementById('btn-accion').click(); 
        } else {
            alert("Error al guardar en el servidor.");
        }
    } catch (err) {
        console.error("Error de conexión:", err);
    }
});

// CRUD: Read (Cargar todos los elementos)
document.getElementById('btn-accion').addEventListener('click', async () => {
    try {
        const res = await fetch(`${API_URL}/datos`);
        renderizar(await res.json());
    } catch (err) {
        console.error("Error al cargar datos:", err);
    }
});

// Funcionalidad de BÚSQUEDA
document.getElementById('btn-buscar').addEventListener('click', async () => {
    const termino = document.getElementById('input-buscar').value;
    
    if (termino.trim() === '') {
        document.getElementById('btn-accion').click();
        return;
    }

    try {
        const res = await fetch(`${API_URL}/buscar/${termino}`);
        renderizar(await res.json());
    } catch (err) {
        console.error("Error en la búsqueda:", err);
    }
});

// CRUD: Update (Editar Título)
async function editar(id, tituloActual) {
    const nuevoTitulo = prompt("Ingresa el nuevo título:", tituloActual);
    
    if (nuevoTitulo && nuevoTitulo.trim() !== "" && nuevoTitulo !== tituloActual) {
        try {
            await fetch(`${API_URL}/actualizar/${id}`, { 
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ titulo: nuevoTitulo })
            });
            document.getElementById('btn-accion').click();
        } catch (err) {
            console.error("Error al actualizar:", err);
        }
    }
}

// CRUD: Delete (Borrar)
async function eliminar(id) {
    if(confirm("¿Seguro que quieres borrar este elemento?")) {
        try {
            await fetch(`${API_URL}/eliminar/${id}`, { method: 'DELETE' });
            document.getElementById('btn-accion').click();
        } catch (err) {
            console.error("Error al eliminar:", err);
        }
    }
}

// Carga inicial automática al abrir la página
document.getElementById('btn-accion').click();