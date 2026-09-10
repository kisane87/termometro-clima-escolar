const mongoose = require("mongoose");

const votoSchema = new mongoose.Schema({
    humor: {
        type: String,
        required: true
    },

    desabafo: {
        type: String,
        default: ""
    },

    turma: {
        type: String,
        required: true
    },

    materias: {
        type: Map,
        of: String,
        default: {}
    },

    data: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Voto", votoSchema);