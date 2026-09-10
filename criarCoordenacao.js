require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./User");

async function criarCoordenacao() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB conectado!");

        const senhaHash = await bcrypt.hash("admin", 12);

        const coordenacao = new User({
            nome: "coordenacao",
            rm: "COORD001",
            email: "coordenacao@escola.local",
            senha: senhaHash,
            role: "coordenacao"
        });

        await coordenacao.save();

        console.log("Conta da coordenação criada com sucesso!");

    } catch (erro) {
        console.error("Erro:", erro);

    } finally {
        await mongoose.disconnect();
    }
}

criarCoordenacao();