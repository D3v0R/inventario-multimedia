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
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.delete('/eliminar/:id', async (req, res) => {
    try {
        await Multimedia.findByIdAndDelete(req.params.id);
        res.json({ message: "Eliminado correctamente" });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.get('/buscar/:term', async (req, res) => {
    try {
        const regex = new RegExp(req.params.term, 'i');
        const resultados = await Multimedia.find({
            $or: [{ nombre: regex }, { rol: regex }, { titulo: regex }, { descripcion: regex }]
        });
        res.json(resultados);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor encendido en puerto ${PORT}`);
});