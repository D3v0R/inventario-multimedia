const mongoose = require('mongoose');

const MultimediaSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descripcion: String,
    archivos: {
        imagen: String,
        audio: String,
        video: String
    },
    fechaSubida: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Multimedia', MultimediaSchema);