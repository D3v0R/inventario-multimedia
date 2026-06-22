const express = require('express');
const multer = require('multer');
const Multimedia = require('./models/Multimedia'); // Asegúrate de que este modelo tenga los campos 'nombre' y 'rol'
const router = express.Router();

// Configuración de almacenamiento local
const upload = multer({ dest: 'uploads/' });

// CREATE: Subir nuevo archivo (Alineado a la ruta /guardar del HTML)
router.post('/guardar', upload.fields([
    { name: 'imagen', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), async (req, res) => {
    try {
        // Adaptado para aceptar 'nombre' y 'rol' (del HTML) o 'titulo' y 'descripcion'
        const nuevoElemento = new Multimedia({
            nombre: req.body.nombre || req.body.titulo,
            rol: req.body.rol || req.body.descripcion,
            archivos: {
                // Validación para evitar errores si req.files viene vacío
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

// READ: Obtener todos los elementos (Alineado a la ruta /datos del HTML)
router.get('/datos', async (req, res) => {
    try {
        const elementos = await Multimedia.find();
        res.json(elementos);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener los datos de la base de datos." });
    }
});

// UPDATE: Actualizar elemento (Alineado a la ruta /actualizar/:id del HTML)
router.put('/actualizar/:id', async (req, res) => {
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

// DELETE: Borrar elemento (Alineado a la ruta /eliminar/:id del HTML)
router.delete('/eliminar/:id', async (req, res) => {
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

// SEARCH: Buscar elementos (Alineado a la ruta /buscar/:term del HTML)
router.get('/buscar/:term', async (req, res) => {
    try {
        const regex = new RegExp(req.params.term, 'i'); // Búsqueda insensible a mayúsculas/minúsculas
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

module.exports = router;