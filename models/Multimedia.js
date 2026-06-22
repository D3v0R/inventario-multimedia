const mongoose = require('mongoose');

const ElementoMultimediaSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descripcion: String,
    imagenUrl: String,
    audioUrl: String,
    videoUrl: String,
    fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Multimedia', ElementoMultimediaSchema);