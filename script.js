// 1. Selección de elementos
const btnAccion = document.getElementById('btn-accion');
const btnGuardar = document.getElementById('btn-guardar');
const contenedor = document.getElementById('contenedor-datos');
const btnBuscar = document.getElementById('btn-buscar');

// 2. Función para obtener y mostrar los datos
btnAccion.addEventListener('click', async () => {
    try {
        const respuesta = await fetch('http://localhost:3000/datos');
        const datos = await respuesta.json(); // La variable se crea aquí
        
        contenedor.innerHTML = ""; // Limpiar contenedor
        
        // Un solo ciclo para renderizar todo
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

// 3. Función global para eliminar (debe estar fuera del addEventListener para que el botón la encuentre)
async function eliminarUsuario(id) {
    try {
        const respuesta = await fetch(`http://localhost:3000/eliminar/${id}`, { method: 'DELETE' });
        if (respuesta.ok) {
            alert("Usuario eliminado");
            btnAccion.click(); // Recargar la vista automáticamente
        }
    } catch (error) {
        console.error("Error al eliminar:", error);
    }
}

// 4. Evento para guardar nuevos datos
btnGuardar.addEventListener('click', async () => {
    const nombre = document.getElementById('nombre').value;
    const rol = document.getElementById('rol').value;

    if (!nombre) return alert("Por favor, escribe un nombre.");

    try {
        const respuesta = await fetch('http://localhost:3000/guardar', {
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

btnBuscar.addEventListener('click', async () => {
const termino = document.getElementById('input-buscar').value;
if (!termino) return alert("Ingresa un término de búsqueda");
try {
const respuesta = await fetch(`http://localhost:3000/buscar/${termino}`);
const resultados = await respuesta.json();
const contenedor = document.getElementById('contenedor-datos');
contenedor.innerHTML = `<h4>Resultados de: "${termino}"</h4>`;
if (resultados.length === 0) {
contenedor.innerHTML += "<p>No se encontraron coincidencias.</p>";
}
resultados.forEach(user => {
contenedor.innerHTML += `
<div class="tarjeta-usuario" style="border-left-color: #ffc107;">
<h3>${user.nombre}</h3>
<p>Rol: ${user.rol}</p>
<button class="btn-borrar" onclick="eliminarUsuario('${user._id}')">Eliminar</button>
</div>
`;
});
} catch (error) {
console.error("Error en la consulta:", error);
}
});