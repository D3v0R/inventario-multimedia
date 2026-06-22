const API_URL = "https://inventario-multimedia.onrender.com";

// Evento para el Formulario (Guardar con archivos)
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // EVITA LA RECARGA
    
    const formData = new FormData(e.target);
    
    try {
        await fetch(`${API_URL}/api/multimedia`, { // Asegúrate que esta ruta coincida con tu backend
            method: 'POST',
            body: formData // FormData gestiona el multipart/form-data automáticamente
        });
        
        e.target.reset(); // Limpia el formulario
        btnAccion.click(); // Refresca la lista automáticamente
    } catch (err) {
        console.error("Error al guardar:", err);
    }
});

// Función de renderizado (Igual a la que tenías)
function renderizar(datos) {
    const contenedor = document.getElementById('contenedor-datos');
    contenedor.innerHTML = "";
    datos.forEach(item => {
        contenedor.innerHTML += `
            <div style="background: #2c2c2c; padding: 15px; margin: 10px 0; color: white;">
                <h3>${item.titulo}</h3>
                <p>${item.descripcion}</p>
                <button onclick="eliminarUsuario('${item._id}')">Borrar</button>
            </div>
        `;
    });
}

// Cargar todos
const btnAccion = document.getElementById('btn-accion');
btnAccion.addEventListener('click', async () => {
    const res = await fetch(`${API_URL}/api/multimedia`);
    renderizar(await res.json());
});

// Eliminar
async function eliminarUsuario(id) {
    await fetch(`${API_URL}/api/multimedia/${id}`, { method: 'DELETE' });
    btnAccion.click();
}