require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { GoogleGenAI } = require("@google/genai");

const User = require("./User");
const Voto = require("./Voto");

const app = express();
const gemini = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const port = process.env.PORT || 3000;

console.log("ESTE É O SERVER.JS CERTO");

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB conectado!"))
    .catch((erro) => console.log("Erro ao conectar:", erro));

app.use(express.json());

app.use((req, res, next) => {
    console.log("REQUISIÇÃO:", req.method, req.url);
    next();
});

app.get("/teste", (req, res) => {
    res.send("SERVIDOR NODE CORRETO!");
});

// =========================
// TESTE DE E-MAIL
// =========================

app.get("/teste-email", async (req, res) => {

    try {

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: "Teste - Termômetro do Clima Escolar",
            text: "Se você recebeu este e-mail, o envio pelo Node.js está funcionando!"
        });

        console.log("E-mail de teste enviado!");

        res.send("E-mail de teste enviado com sucesso!");

    } catch (erro) {

        console.error("Erro ao enviar e-mail:", erro);

        res.status(500).send(
            "Erro ao enviar e-mail. Veja o terminal."
        );
    }

});
// =========================
// VOTOS
// =========================

app.post("/api/votos", async (req, res) => {
    try {
        const {
            humor,
            desabafo,
            turma,
            materias
        } = req.body;

        if (!humor || !turma) {
            return res.status(400).json({
                erro: "Humor ou turma não informado."
            });
        }

        const novoVoto = new Voto({
            humor,
            desabafo: desabafo || "",
            turma,
            materias: materias || {}
        });

        await novoVoto.save();

        res.status(201).json({
            mensagem: "Voto salvo com sucesso!"
        });

    } catch (erro) {
        console.error("Erro ao salvar voto:", erro);

        res.status(500).json({
            erro: "Erro interno ao salvar voto."
        });
    }
});


app.get("/api/votos", async (req, res) => {
    try {
        const votos = await Voto.find()
            .sort({ data: -1 });

        res.json(votos);

    } catch (erro) {
        console.error("Erro ao buscar votos:", erro);

        res.status(500).json({
            erro: "Erro interno ao buscar votos."
        });
    }
});
app.delete("/api/votos", async (req, res) => {
    try {
        await Voto.deleteMany({});

        res.json({
            mensagem: "Todos os votos foram apagados com sucesso!"
        });

    } catch (erro) {
        console.error("Erro ao apagar votos:", erro);

        res.status(500).json({
            erro: "Erro interno ao apagar votos."
        });
    }
});

// =========================
// CADASTRO
// =========================

app.post("/api/cadastro", async (req, res) => {
    console.log("CADASTRO CHEGOU NO SERVIDOR!");

    try {
        const { nome, rm, email, senha, turma } = req.body;

        if (!nome || !rm || !email || !senha || !turma) {
            return res.status(400).json({
                erro: "Preencha todos os campos."
            });
        }

        if (senha.length < 6) {
            return res.status(400).json({
                erro: "A senha precisa ter pelo menos 6 caracteres."
            });
        }

        const usuarioExistente = await User.findOne({
            $or: [
                { rm: rm },
                { email: email.toLowerCase() }
            ]
        });

        if (usuarioExistente) {
            return res.status(409).json({
                erro: "RM ou e-mail já cadastrado."
            });
        }

        const senhaHash = await bcrypt.hash(senha, 12);

        const novoUsuario = new User({
    nome,
    rm,
    email: email.toLowerCase(),
    senha: senhaHash,
    turma
});

        await novoUsuario.save();

        res.status(201).json({
            mensagem: "Cadastro realizado com sucesso!"
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: "Erro interno ao realizar cadastro."
        });
    }
});
// =========================
// RECUPERAÇÃO DE SENHA
// =========================

app.post("/api/recuperacao", async (req, res) => {

    try {
        console.log("RECUPERAÇÃO INICIADA!");

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                erro: "Digite seu e-mail."
            });
        }

        const usuario = await User.findOne({
            email: email.toLowerCase()
        });

        if (!usuario) {
            return res.status(404).json({
                erro: "E-mail não encontrado."
            });
        }

        // Gera um código de 6 dígitos
        const codigo = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        // Código válido por 10 minutos
        const expiracao = new Date(
            Date.now() + 10 * 60 * 1000
        );

        // Salva o código no usuário
        usuario.codigoRecuperacao = codigo;
        usuario.expiracaoCodigo = expiracao;

        await usuario.save();
        console.log("TENTANDO ENVIAR E-MAIL PARA:", usuario.email);

        // Envia o código por e-mail
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: usuario.email,
            subject: "Código de recuperação - Termômetro do Clima Escolar",
            text: `Seu código de recuperação é: ${codigo}

Esse código é válido por 10 minutos.

Se você não solicitou a recuperação da senha, ignore este e-mail.`
        });

        console.log(
            "Código de recuperação enviado para:",
            usuario.email
        );

        res.json({
            mensagem:
                "Código de recuperação enviado para seu e-mail!"
        });

    } catch (erro) {

        console.error(
            "Erro na recuperação:",
            erro
        );

        res.status(500).json({
            erro: "Erro interno na recuperação de senha."
        });

    }

});
// VERIFICAR CÓDIGO DE RECUPERAÇÃO
app.post("/api/verificar-codigo", async (req, res) => {

    try {

        const { email, codigo } = req.body;

        if (!email || !codigo) {
            return res.status(400).json({
                erro: "Digite o e-mail e o código."
            });
        }

        const usuario = await User.findOne({
            email: email.toLowerCase()
        });

        if (!usuario) {
            return res.status(404).json({
                erro: "Usuário não encontrado."
            });
        }

        if (
            !usuario.codigoRecuperacao ||
            !usuario.expiracaoCodigo
        ) {
            return res.status(400).json({
                erro: "Nenhum código de recuperação ativo."
            });
        }

        if (usuario.expiracaoCodigo < new Date()) {

            usuario.codigoRecuperacao = null;
            usuario.expiracaoCodigo = null;

            await usuario.save();

            return res.status(400).json({
                erro: "O código expirou. Solicite um novo código."
            });
        }

        if (usuario.codigoRecuperacao !== codigo.trim()) {
            return res.status(400).json({
                erro: "Código de recuperação incorreto."
            });
        }

        res.json({
            mensagem: "Código verificado com sucesso!"
        });

    } catch (erro) {

        console.error(
            "Erro ao verificar código:",
            erro
        );

        res.status(500).json({
            erro: "Erro interno ao verificar o código."
        });
    }

});
// =========================
// REDEFINIR SENHA
// =========================

app.post("/api/redefinir-senha", async (req, res) => {

    try {

        const {
            email,
            codigo,
            novaSenha
        } = req.body;

        if (!email || !codigo || !novaSenha) {

            return res.status(400).json({
                erro: "Preencha todos os campos."
            });

        }

        if (novaSenha.length < 6) {

            return res.status(400).json({
                erro: "A nova senha precisa ter pelo menos 6 caracteres."
            });

        }

        const usuario = await User.findOne({
            email: email.toLowerCase()
        });

        if (!usuario) {

            return res.status(404).json({
                erro: "Usuário não encontrado."
            });

        }

        if (
            !usuario.codigoRecuperacao ||
            !usuario.expiracaoCodigo
        ) {

            return res.status(400).json({
                erro: "Nenhum código de recuperação ativo."
            });

        }

        if (usuario.expiracaoCodigo < new Date()) {

            usuario.codigoRecuperacao = null;
            usuario.expiracaoCodigo = null;

            await usuario.save();

            return res.status(400).json({
                erro: "O código expirou. Solicite um novo código."
            });

        }

        if (usuario.codigoRecuperacao !== codigo.trim()) {

            return res.status(400).json({
                erro: "Código de recuperação incorreto."
            });

        }

        const senhaHash =
            await bcrypt.hash(novaSenha, 12);

        usuario.senha = senhaHash;

        usuario.codigoRecuperacao = null;
        usuario.expiracaoCodigo = null;

        await usuario.save();

        console.log(
            "Senha redefinida com sucesso para:",
            usuario.email
        );

        res.json({
            mensagem: "Senha redefinida com sucesso!"
        });

    } catch (erro) {

        console.error(
            "Erro ao redefinir senha:",
            erro
        );

        res.status(500).json({
            erro: "Erro interno ao redefinir a senha."
        });

    }

});
// =========================
// LOGIN
// =========================

app.post("/api/login", async (req, res) => {
    try {
        const { usuario, senha, turma } = req.body;

        if (!usuario || !senha) {
    return res.status(400).json({
        erro: "Preencha usuário e senha."
    });
}

        const usuarioEncontrado = await User.findOne({
            $or: [
                { nome: usuario },
                { rm: usuario }
            ]
        });

        if (!usuarioEncontrado) {
            return res.status(401).json({
                erro: "Usuário ou senha incorretos."
            });
        }
        if (
    usuarioEncontrado.role !== "coordenacao" &&
    usuarioEncontrado.turma !== turma
) {
    return res.status(401).json({
        erro: "A turma selecionada não corresponde ao seu cadastro."
    });
}

        const senhaCorreta = await bcrypt.compare(
            senha,
            usuarioEncontrado.senha
        );

        if (!senhaCorreta) {
            return res.status(401).json({
                erro: "Usuário ou senha incorretos."
            });
        }

        res.json({
            mensagem: "Login realizado com sucesso!",
            usuario: {
    nome: usuarioEncontrado.nome,
    rm: usuarioEncontrado.rm,
    email: usuarioEncontrado.email,
    turma: usuarioEncontrado.turma,
    role: usuarioEncontrado.role
}
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: "Erro interno ao realizar login."
        });
    }
});


// =========================
// SITE
// =========================

app.use(express.static("."));

app.listen(port, "0.0.0.0", () => {
    console.log(`Site rodando na porta ${port}`);
});
// =========================
// CHAT COM IA
// =========================

app.post("/api/chat", async (req, res) => {

    try {

        const { mensagem } = req.body;

        if (!mensagem) {
            return res.status(400).json({
                erro: "Mensagem não informada."
            });
        }

        const resposta = await gemini.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: `
Você é a assistente virtual do projeto "Termômetro do Clima Escolar".

Seu objetivo é acolher e conversar com estudantes de forma segura, respeitosa e amigável.

REGRAS:
- Responda sempre em português do Brasil.
- Seja acolhedora, paciente e empática.
- Use uma linguagem simples e natural, adequada para estudantes.
- Não julgue, critique ou faça o estudante se sentir culpado.
- Quando o estudante estiver triste, preocupado, ansioso ou com algum problema, demonstre compreensão e ofereça sugestões simples que possam ajudar.
- Incentive o estudante a conversar com pessoas de confiança, professores, coordenação, familiares ou outros adultos responsáveis quando isso for apropriado.
- Se o estudante mencionar bullying, violência, abuso, ameaças ou perigo, incentive que procure imediatamente um adulto de confiança ou a coordenação da escola.
- Se houver indicação de que o estudante pode machucar a si mesmo ou outra pessoa, priorize a segurança e incentive a busca imediata de ajuda de um adulto de confiança ou serviço de emergência.
- Não diga que você é psicóloga, médica ou profissional de saúde.
- Não invente informações sobre a escola.
- Não peça senhas, códigos de recuperação, documentos ou outras informações pessoais desnecessárias.
- Mantenha as respostas objetivas, mas converse naturalmente.
- Você pode usar emojis com moderação.

Mensagem do estudante:
${mensagem}
`
});

        res.json({
            resposta: resposta.text
        });

    } catch (erro) {

        console.error("Erro na IA:", erro);

        res.status(500).json({
            erro: "Não foi possível obter uma resposta da assistente."
        });

    }

});