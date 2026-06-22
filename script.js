// 1. URL base de tu servidor en la nube (Render)
const API_URL = "https://inventario-backend-lwvi.onrender.com";

// 2. Selección de elementos
const btnAccion = document.getElementById('btn-accion');
const btnGuardar = document.getElementById('btn-guardar');
const contenedor = document.getElementById('contenedor-datos');
const btnBuscar = document.getElementById('btn-buscar');

// 3. Función para obtener y mostrar los datos
btnAccion.addEventListener('click', async () => {
    try {
        const respuesta = await fetch(`${API_URL}/datos`);
        const datos = await respuesta.json();
        
        contenedor.innerHTML = ""; // Limpiar contenedor
        
        datos.forEach(user => {
            contenedor.innerHTML += `
                <div class="tarjeta-usuario" style="border-bottom: 1px solid #ccc; margin-bottom: 10px;">
                    <h3>${user.nombre}</h3>
                    <p>Rol: ${user.rol}</p>
                    <p>ID: <small>${user._id}</small></p>
                    <button class="btn-borrar" onclick="eliminarUsuario('${user._id}')">
                        Eliminar
                    </button>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error al cargar datos:", error);
        contenedor.innerHTML = "<p>Error al conectar con el servidor.</p>";
    }
});

// 4. Función global para eliminar
async function eliminarUsuario(id) {
    try {
        const respuesta = await fetch(`${API_URL}/eliminar/${id}`, { method: 'DELETE' });
        if (respuesta.ok) {
            alert("Usuario eliminado");
            btnAccion.click(); // Recargar la vista automáticamente
        }
    } catch (error) {
        console.error("Error al eliminar:", error);
    }
}

// 5. Evento para guardar nuevos datos
btnGuardar.addEventListener('click', async () => {
    const nombre = document.getElementById('nombre').value;
    const rol = document.getElementById('rol').value;

    if (!nombre) return alert("Por favor, escribe un nombre.");

    try {
        const respuesta = await fetch(`${API_URL}/guardar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, rol })
        });

        if (respuesta.ok) {
            alert("¡Guardado exitosamente!");
            document.getElementById('nombre').value = ""; 
            btnAccion.click(); // Actualizar lista
        }
    } catch (error) {
        console.error("Error al guardar:", error);
    }
});

// 6. Evento para buscar
btnBuscar.addEventListener('click', async () => {
    const termino = document.getElementById('input-buscar').value;
    if (!termino) return alert("Ingresa un término de búsqueda");
    
    try {
        const respuesta = await fetch(`${API_URL}/buscar/${termino}`);
        const resultados = await respuesta.json();
        
        contenedor.innerHTML = `<h4>Resultados de: "${termino}"</h4>`;
        if (resultados.length === 0) {
            contenedor.innerHTML += "<p>No se encontraron coincidencias.</p>";
        }
        
        resultados.forEach(user => {
            contenedor.innerHTML += `
                <div class="tarjeta-usuario" style="border-left: 5px solid #ffc107; padding-left: 10px;">
                    <h3>${user.nombre}</h3>
                    <p>Rol: ${user.rol}</p>
                    <button class="btn-borrar" onclick="eliminarUsuario('${user._id}')">Eliminar</button>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error en la consulta:", error);
    }// La ruta es relativa al servidor actual
const API_URL = ""; 

const btnAccion = document.getElementById('btn-accion');
const btnGuardar = document.getElementById('btn-guardar');
const contenedor = document.getElementById('contenedor-datos');
const btnBuscar = document.getElementById('btn-buscar');

btnAccion.addEventListener('click', async () => {
    try {
        const res = await fetch(`${API_URL}/datos`);
        const datos = await res.json();
        contenedor.innerHTML = ""; 
        datos.forEach(user => {
            contenedor.innerHTML += `
                <div>
                    <h3>${user.nombre}</h3>
                    <p>Rol: ${user.rol}</p>
                    <button onclick="eliminarUsuario('${user._id}')">Eliminar</button>
                </div>`;
        });
    } catch (err) { contenedor.innerHTML = "<p>Error de conexión</p>"; }
});

async function eliminarUsuario(id) {
    await fetch(`${API_URL}/eliminar/${id}`, { method: 'DELETE' });
    btnAccion.click();
}

btnGuardar.addEventListener('click', async () => {
    const nombre = document.getElementById('nombre').value;
    const rol = document.getElementById('rol').value;
    await fetch(`${API_URL}/guardar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, rol })
    });
    btnAccion.click();
});
});