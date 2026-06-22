const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// IMPORTANTE: Asegúrate de tener este modelo en models/Multimedia.js
const Multimedia = require('./models/Multimedia');
const app = express();

// Configuración de carpetas
if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');

// Configuración de Multer
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
    }
});
const upload = multer({ storage });

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(express.static(__dirname)); 

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ Conectado a MongoDB Atlas"))
    .catch(err => console.error("Error de conexión:", err));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// !!! LA RUTA QUE TE FALTA !!!
app.post('/api/multimedia', upload.fields([
    { name: 'imagen', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), async (req, res) => {
    try {
        const nuevoElemento = new Multimedia({
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            imagenUrl: req.files.imagen ? req.files.imagen[0].path : '',
            audioUrl: req.files.audio ? req.files.audio[0].path : '',
            videoUrl: req.files.video ? req.files.video[0].path : ''
        });

        await nuevoElemento.save();
        res.send('<h1>Guardado con éxito</h1><a href="/">Volver</a>');
    } catch (error) {
        res.status(500).send('Error al guardar: ' + error.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));