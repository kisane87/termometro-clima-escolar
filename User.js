const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },

    rm: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    senha: {
        type: String,
        required: true
    },
    turma: {
    type: String,
    default: null
},
    codigoRecuperacao: {
    type: String,
    default: null
},

expiracaoCodigo: {
    type: Date,
    default: null
},

    role: {
        type: String,
        enum: ["aluno", "coordenacao"],
        default: "aluno"
    }
});

module.exports = mongoose.model("User", userSchema);