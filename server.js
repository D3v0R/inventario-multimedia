const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Carga las variables desde el archivo .env

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 1. Conexión a la Base de Datos usando la variable de entorno
const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
    .then(() => console.log("Conectado a MongoDB Atlas exitosamente"))
    .catch(err => console.error("Error de conexión a MongoDB:", err));

// 2. Esquema y Modelo
const UsuarioSchema = new mongoose.Schema({
    nombre: String,
    rol: String,
    status: Boolean
});
const Usuario = mongoose.model('Usuario', UsuarioSchema);

// 3. Rutas de la API

// GET: Obtener todos
app.get('/datos', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener datos" });
    }
});

// POST: Guardar nuevo
app.post('/guardar', async (req, res) => {
    try {
        const nuevoUsuario = new Usuario({
            nombre: req.body.nombre,
            rol: req.body.rol,
            status: true
        });
        await nuevoUsuario.save();
        res.status(201).json({ mensaje: "Usuario guardado con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error al guardar" });
    }
});

// DELETE: Eliminar por ID
app.delete('/eliminar/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await Usuario.findByIdAndDelete(id);
        if (!resultado) return res.status(404).send("Usuario no encontrado");
        res.status(200).send("Usuario eliminado correctamente");
    } catch (error) {
        res.status(500).send("Error en el servidor");
    }
});

// GET: Buscar por nombre
app.get('/buscar/:nombre', async (req, res) => {
    try {
        const resultados = await Usuario.find({
            nombre: { $regex: req.params.nombre, $options: 'i' }
        });
        res.json(resultados);
    } catch (error) {
        res.status(500).json({ error: "Error en la búsqueda" });
    }
});

// 4. Iniciar servidor (Usando puerto dinámico para Render)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));