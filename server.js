const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la carpeta actual (donde está el index.html)
app.use(express.static(__dirname));

// Ruta principal para servir tu index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 1. Conexión a la Base de Datos
const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
    .then(() => console.log("Conectado a MongoDB Atlas"))
    .catch(err => console.error("Error de conexión:", err));

// 2. Modelo
const Usuario = mongoose.model('Usuario', new mongoose.Schema({
    nombre: String,
    rol: String,
    status: Boolean
}));

// 3. Rutas API
app.get('/datos', async (req, res) => {
    const usuarios = await Usuario.find();
    res.json(usuarios);
});

app.post('/guardar', async (req, res) => {
    const nuevo = new Usuario({ ...req.body, status: true });
    await nuevo.save();
    res.status(201).json(nuevo);
});

app.delete('/eliminar/:id', async (req, res) => {
    await Usuario.findByIdAndDelete(req.params.id);
    res.send("Eliminado");
});

app.get('/buscar/:nombre', async (req, res) => {
    const resultados = await Usuario.find({ nombre: { $regex: req.params.nombre, $options: 'i' } });
    res.json(resultados);
});

// 4. Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));