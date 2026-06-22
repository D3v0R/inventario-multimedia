const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const Multimedia = require('./models/Multimedia');

const app = express();

// --- CONFIGURACIÓN ---
app.use(cors());
app.use(express.json());

// --- CONEXIÓN A LA BASE DE DATOS ---
// Asegúrate de que en Render, la variable de entorno se llame MONGODB_URI
const MONGO_URI = process.env.MONGODB_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Conectado a MongoDB"))
    .catch((err) => {
        console.error("❌ Error CRÍTICO al conectar:", err);
        process.exit(1);
    });

// --- SUBIDA DE ARCHIVOS ---
const upload = multer({ dest: 'uploads/' });

// --- RUTAS (CRUD) ---

// CREATE
app.post('/guardar', upload.any(), async (req, res) => {
    try {
        const nuevo = new Multimedia({
            titulo: req.body.titulo,
            descripcion: req.body.descripcion
        });
        await nuevo.save();
        res.status(201).json(nuevo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ
app.get('/datos', async (req, res) => {
    try {
        const data = await Multimedia.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener datos" });
    }
});

// DELETE
app.delete('/eliminar/:id', async (req, res) => {
    try {
        await Multimedia.findByIdAndDelete(req.params.id);
        res.json({ message: "Eliminado correctamente" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- RUTA PARA SERVIR TU HTML ---
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- ENCENDER EL SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor en puerto ${PORT}`);
});