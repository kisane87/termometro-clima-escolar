const mongoose = require("mongoose");

const avaliacaoSchema = new mongoose.Schema({
    rm: {
        type: String,
        required: true,
        trim: true
    },

    turma: {
        type: String,
        required: true
    },

    humor: {
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

module.exports = mongoose.model("Avaliacao", avaliacaoSchema);