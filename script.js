const API_URL = "https://inventario-backend-lwvi.onrender.com";

// Selección de elementos
const btnAccion = document.getElementById('btn-accion');
const btnGuardar = document.getElementById('btn-guardar');
const btnBuscar = document.getElementById('btn-buscar');
const contenedor = document.getElementById('contenedor-datos');

// 1. Función para renderizar los datos
function renderizar(datos) {
    contenedor.innerHTML = "";
    datos.forEach(user => {
        contenedor.innerHTML += `
            <div class="tarjeta-usuario" style="background: #2c2c2c; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 5px solid #bb86fc;">
                <h3>${user.nombre}</h3>
                <p>Rol: ${user.rol}</p>
                <p style="font-size: 0.7em; color: #888;">ID: ${user._id}</p>
                <button class="btn-editar" onclick="editarUsuario('${user._id}', '${user.nombre}', '${user.rol}')">Editar</button>
                <button class="btn-borrar" onclick="eliminarUsuario('${user._id}')">Eliminar</button>
            </div>
        `;
    });
}

// 2. Cargar todos
btnAccion.addEventListener('click', async () => {
    try {
        const res = await fetch(`${API_URL}/datos`);
        const datos = await res.json();
        renderizar(datos);
    } catch (err) {
        contenedor.innerHTML = "<p>Error al conectar con el servidor.</p>";
    }
});

// 3. Guardar
btnGuardar.addEventListener('click', async () => {
    const nombre = document.getElementById('nombre').value;
    const rol = document.getElementById('rol').value;
    if (!nombre) return alert("Escribe un nombre");

    await fetch(`${API_URL}/guardar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, rol })
    });
    document.getElementById('nombre').value = "";
    btnAccion.click();
});

// 4. Eliminar
async function eliminarUsuario(id) {
    await fetch(`${API_URL}/eliminar/${id}`, { method: 'DELETE' });
    btnAccion.click();
}

// 5. Editar
async function editarUsuario(id, nombreActual, rolActual) {
    const nuevoNombre = prompt("Edita el nombre:", nombreActual);
    const nuevoRol = prompt("Edita el rol:", rolActual);
    if (nuevoNombre && nuevoRol) {
        await fetch(`${API_URL}/actualizar/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: nuevoNombre, rol: nuevoRol })
        });
        btnAccion.click();
    }
}

// 6. Buscar
btnBuscar.addEventListener('click', async () => {
    const term = document.getElementById('input-buscar').value;
    if (!term) return alert("Escribe algo para buscar");
    const res = await fetch(`${API_URL}/buscar/${term}`);
    renderizar(await res.json());
});