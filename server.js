const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const Multimedia = require('./models/Multimedia');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 3. CONEXIÓN A LA BASE DE DATOS
const MONGO_URI = process.env.MONGODB_URI; 

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Conectado a la base de datos MongoDB"))
    .catch((err) => {
        console.error("❌ Error CRÍTICO al conectar a MongoDB:", err);
        process.exit(1);
    });

// USAMOS UPLOAD.ANY() PARA QUE NO RECHACE PETICIONES SI FALTA UN ARCHIVO
const upload = multer({ dest: 'uploads/' });

// --- RUTAS DE LA API ---

// CREATE: Ahora es flexible con los archivos
app.post('/guardar', upload.any(), async (req, res) => {
    try {
        const nuevoElemento = new Multimedia({
            titulo: req.body.titulo || req.body.nombre,
            descripcion: req.body.descripcion || req.body.rol,
            // Guardamos las rutas si existen archivos
            archivos: req.files ? req.files.map(f => f.path) : []
        });
        await nuevoElemento.save();
        res.status(201).json(nuevoElemento);
    } catch (err) {
        console.error("Error al guardar:", err);
        res.status(400).json({ error: err.message });
    }
});

app.get('/datos', async (req, res) => {
    try {
        const elementos = await Multimedia.find();
        res.json(elementos);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener los datos." });
    }
});

app.put('/actualizar/:id', async (req, res) => {
    try {
        const actualizado = await Multimedia.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(actualizado);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/eliminar/:id', async (req, res) => {
    try {
        await Multimedia.findByIdAndDelete(req.params.id);
        res.json({ message: "Eliminado correctamente" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/buscar/:term', async (req, res) => {
    try {
        const regex = new RegExp(req.params.term, 'i');
        const resultados = await Multimedia.find({
            $or: [{ nombre: regex }, { rol: regex }, { titulo: regex }, { descripcion: regex }]
        });
        res.json(resultados);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- RUTA PARA SERVIR TU PÁGINA WEB ---
app.use(express.static(path.join(__dirname))); 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ENCENDIDO
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor encendido en puerto ${PORT}`);
});

app.use('/uploads', express.static('uploads'));