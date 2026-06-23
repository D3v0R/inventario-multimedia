const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const Multimedia = require('./models/Multimedia');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const MONGO_URI = process.env.MONGODB_URI; 

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Conectado a la base de datos MongoDB"))
    .catch((err) => {
        console.error("❌ Error CRÍTICO al conectar a MongoDB:", err);
        process.exit(1);
    });

const upload = multer({ dest: 'uploads/' });

// --- RUTA PARA GUARDAR ---
app.post('/guardar', upload.fields([{ name: 'imagen' }, { name: 'audio' }]), async (req, res) => {
    try {
        const nuevo = new Multimedia({
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            archivos: {
                imagen: req.files['imagen'] ? req.files['imagen'][0].path : null,
                audio: req.files['audio'] ? req.files['audio'][0].path : null
            }
        });
        await nuevo.save();
        res.status(201).json(nuevo);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// --- RUTA PARA OBTENER TODOS LOS DATOS ---
app.get('/datos', async (req, res) => {
    try {
        const elementos = await Multimedia.find();
        res.json(elementos);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener los datos." });
    }
});

// --- RUTA PARA ACTUALIZAR (Corregida con soporte para archivos) ---
app.put('/actualizar/:id', upload.fields([{ name: 'imagen' }, { name: 'audio' }]), async (req, res) => {
    try {
        // 1. Buscamos el documento actual en la base de datos
        const elemento = await Multimedia.findById(req.params.id);
        if (!elemento) {
            return res.status(404).json({ error: "Elemento no encontrado" });
        }

        // 2. Actualizamos los textos (si vienen en la petición)
        if (req.body.titulo) elemento.titulo = req.body.titulo;
        if (req.body.descripcion !== undefined) elemento.descripcion = req.body.descripcion;

        // 3. Verificamos si se subieron archivos nuevos y los actualizamos
        if (req.files) {
            // Asegurarnos de que el objeto 'archivos' exista
            if (!elemento.archivos) elemento.archivos = {};

            if (req.files['imagen']) {
                elemento.archivos.imagen = req.files['imagen'][0].path;
            }
            if (req.files['audio']) {
                elemento.archivos.audio = req.files['audio'][0].path;
            }
        }

        // 4. Guardamos los cambios
        const actualizado = await elemento.save();
        res.json(actualizado);
    } catch (err) { 
        res.status(400).json({ error: err.message }); 
    }
});

// --- RUTA PARA ELIMINAR ---
app.delete('/eliminar/:id', async (req, res) => {
    try {
        await Multimedia.findByIdAndDelete(req.params.id);
        res.json({ message: "Eliminado correctamente" });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// --- RUTA PARA BUSCAR ---
app.get('/buscar/:term', async (req, res) => {
    try {
        const regex = new RegExp(req.params.term, 'i');
        const resultados = await Multimedia.find({
            $or: [{ nombre: regex }, { rol: regex }, { titulo: regex }, { descripcion: regex }]
        });
        res.json(resultados);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- RUTA PRINCIPAL (FRONT-END) ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor encendido en puerto ${PORT}`);
});