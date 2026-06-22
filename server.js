const express = require('express');
const multer = require('multer');
const Multimedia = require('./models/Multimedia');
const router = express.Router();

// Configuración de almacenamiento local
const upload = multer({ dest: 'uploads/' });

// CREATE: Subir nuevo archivo
router.post('/', upload.fields([
    { name: 'imagen', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), async (req, res) => {
    try {
        const nuevoElemento = new Multimedia({
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            archivos: {
                imagen: req.files.imagen ? req.files.imagen[0].path : null,
                audio: req.files.audio ? req.files.audio[0].path : null,
                video: req.files.video ? req.files.video[0].path : null
            }
        });
        await nuevoElemento.save();
        res.status(201).json(nuevoElemento);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ: Obtener todos los elementos
router.get('/', async (req, res) => {
    const elementos = await Multimedia.find();
    res.json(elementos);
});

// UPDATE: Actualizar descripción
router.put('/:id', async (req, res) => {
    const actualizado = await Multimedia.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizado);
});

// DELETE: Borrar elemento
router.delete('/:id', async (req, res) => {
    await Multimedia.findByIdAndDelete(req.params.id);
    res.json({ message: "Elemento eliminado correctamente" });
});

module.exports = router;