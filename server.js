const express = require('express');
const multer = require('multer');
const cors = require('cors'); // Vital para que el frontend pueda hablar con este backend
const mongoose = require('mongoose'); // Necesario para conectar a la base de datos
const Multimedia = require('./models/Multimedia');

// 1. INICIALIZAMOS EL MOTOR DEL SERVIDOR
const app = express();

// 2. MIDDLEWARES (Configuraciones base)
app.use(cors()); // Permite peticiones desde tu archivo HTML
app.use(express.json()); // Permite entender los datos en formato JSON

// 3. CONEXIÓN A LA BASE DE DATOS
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI; 
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Conectado a la base de datos MongoDB"))
    .catch((err) => {
        console.error("❌ Error CRÍTICO al conectar a MongoDB:", err);
        process.exit(1); // Esto ayuda a Render a entender que falló y reiniciar
    });
// Configuración de almacenamiento local
const upload = multer({ dest: 'uploads/' });

// ==========================================
// TUS RUTAS (Cambiamos 'router' por 'app')
// ==========================================

// CREATE: Subir nuevo archivo 
app.post('/guardar', upload.fields([
    { name: 'imagen', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), async (req, res) => {
    try {
        const nuevoElemento = new Multimedia({
            nombre: req.body.nombre || req.body.titulo,
            rol: req.body.rol || req.body.descripcion,
            archivos: {
                imagen: req.files && req.files.imagen ? req.files.imagen[0].path : null,
                audio: req.files && req.files.audio ? req.files.audio[0].path : null,
                video: req.files && req.files.video ? req.files.video[0].path : null
            }
        });
        await nuevoElemento.save();
        res.status(201).json(nuevoElemento);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ: Obtener todos los elementos
app.get('/datos', async (req, res) => {
    try {
        const elementos = await Multimedia.find();
        res.json(elementos);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener los datos de la base de datos." });
    }
});

// UPDATE: Actualizar elemento
app.put('/actualizar/:id', async (req, res) => {
    try {
        const actualizado = await Multimedia.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!actualizado) {
            return res.status(404).json({ error: "Elemento no encontrado." });
        }
        res.json(actualizado);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE: Borrar elemento
app.delete('/eliminar/:id', async (req, res) => {
    try {
        const eliminado = await Multimedia.findByIdAndDelete(req.params.id);
        if (!eliminado) {
            return res.status(404).json({ error: "Elemento no encontrado." });
        }
        res.json({ message: "Elemento eliminado correctamente" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// SEARCH: Buscar elementos
app.get('/buscar/:term', async (req, res) => {
    try {
        const regex = new RegExp(req.params.term, 'i');
        const resultados = await Multimedia.find({
            $or: [
                { nombre: regex }, 
                { rol: regex },
                { titulo: regex },
                { descripcion: regex }
            ]
        });
        res.json(resultados);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 4. ENCENDER EL SERVIDOR (LA PARTE QUE FALTABA)
// ==========================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor encendido y escuchando en el puerto ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('¡El backend del Gestor Multimedia está encendido y funcionando al 100%!');
});