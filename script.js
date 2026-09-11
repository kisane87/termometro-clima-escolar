document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       ELEMENTOS DAS TELAS
       ========================================================= */

    const telaLogin = document.getElementById("telaLogin");
const telaCadastro = document.getElementById("telaCadastro");
const telaAluno = document.getElementById("telaAluno");
const telaAvaliacoes = document.getElementById("telaAvaliacoes");
const telaCoordenacao = document.getElementById("telaCoordenacao");

const telaRecuperacao =
    document.getElementById("telaRecuperacao");


    /* =========================================================
       FORMULÁRIOS E BOTÕES
       ========================================================= */

    const formLogin = document.getElementById("formLogin");
    const formCadastro = document.getElementById("formCadastro");

    const btnLimparDados = document.getElementById("btnLimparDados");
    const btnProximaAvaliacao =
    document.getElementById("btnProximaAvaliacao");
    const btnSair = document.getElementById("btnSair");

    const linkIrParaCadastro =
        document.getElementById("linkIrParaCadastro");

    const linkIrParaLogin =
        document.getElementById("linkIrParaLogin");

        const linkEsqueciSenha =
    document.getElementById("linkEsqueciSenha");

const linkVoltarLoginRecuperacao =
    document.getElementById(
        "linkVoltarLoginRecuperacao"
    );

const formRecuperacao =
    document.getElementById("formRecuperacao");


if (formRecuperacao) {

    formRecuperacao.addEventListener("submit", async (evento) => {

        evento.preventDefault();

        const email =
            document
                .getElementById("emailRecuperacao")
                .value
                .trim();


        if (!email) {

            alert("Digite seu e-mail.");

            return;
        }


        try {

            const resposta =
                await fetch("/api/recuperacao", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email
                    })

                });


            const dados =
                await resposta.json();


            if (!resposta.ok) {

                alert(
                    dados.erro ||
                    "Erro ao solicitar recuperação."
                );

                return;
            }


            alert(dados.mensagem);


            console.log(
                "Código enviado para:",
                email
            );
            emailRecuperacaoAtual = email;

etapaEmailRecuperacao.classList.add("escondido");

etapaCodigoRecuperacao.classList.remove("escondido");


        } catch (erro) {

            console.error(
                "Erro na recuperação:",
                erro
            );


            alert(
                "Não foi possível conectar ao servidor."
            );

        }

    });

}


    /* =========================================================
       MENSAGENS
       ========================================================= */

    const msgErroLogin =
    document.getElementById("msgErroLogin");

const msgSucesso =
    document.getElementById("msgSucesso");

const msgSucessoMaterias =
    document.getElementById("msgSucessoMaterias");

const txtDesabafo =
    document.getElementById("txtDesabafo");


    /* =========================================================
       VARIÁVEIS
       ========================================================= */

    let humorSelecionado = null;
let turmaAtual = "";
let avaliacoesMaterias = {};
let emailRecuperacaoAtual = "";
let codigoRecuperacaoAtual = "";

const etapaEmailRecuperacao =
    document.getElementById("etapaEmailRecuperacao");

const etapaCodigoRecuperacao =
    document.getElementById("etapaCodigoRecuperacao");

const etapaNovaSenha =
    document.getElementById("etapaNovaSenha");

const formCodigoRecuperacao =
    document.getElementById("formCodigoRecuperacao");

const formNovaSenha =
    document.getElementById("formNovaSenha");
    if (formCodigoRecuperacao) {

    formCodigoRecuperacao.addEventListener(
        "submit",
        async (evento) => {

            evento.preventDefault();

            const codigo =
                document
                    .getElementById("codigoRecuperacao")
                    .value
                    .trim();

            if (!codigo) {

                alert("Digite o código de recuperação.");

                return;
            }

            try {

                const resposta =
                    await fetch("/api/verificar-codigo", {

                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            email: emailRecuperacaoAtual,
                            codigo: codigo
                        })

                    });

                const dados =
                    await resposta.json();

                if (!resposta.ok) {

                    alert(
                        dados.erro ||
                        "Código inválido."
                    );

                    return;
                }

                codigoRecuperacaoAtual = codigo;

                etapaCodigoRecuperacao.classList.add(
                    "escondido"
                );

                etapaNovaSenha.classList.remove(
                    "escondido"
                );

            } catch (erro) {

                console.error(
                    "Erro ao verificar código:",
                    erro
                );

                alert(
                    "Não foi possível conectar ao servidor."
                );

            }

        }
    );

}
if (formNovaSenha) {

    formNovaSenha.addEventListener(
        "submit",
        async (evento) => {

            evento.preventDefault();

            const novaSenha =
                document
                    .getElementById("novaSenha")
                    .value;

            const confirmarNovaSenha =
                document
                    .getElementById("confirmarNovaSenha")
                    .value;

            if (!novaSenha || !confirmarNovaSenha) {

                alert("Preencha os dois campos de senha.");

                return;
            }

            if (novaSenha.length < 6) {

                alert(
                    "A nova senha precisa ter pelo menos 6 caracteres."
                );

                return;
            }

            if (novaSenha !== confirmarNovaSenha) {

                alert("As senhas não coincidem.");

                return;
            }

            try {

                const resposta =
                    await fetch("/api/redefinir-senha", {

                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({

                            email: emailRecuperacaoAtual,

                            codigo: codigoRecuperacaoAtual,

                            novaSenha: novaSenha

                        })

                    });

                const dados =
                    await resposta.json();

                if (!resposta.ok) {

                    alert(
                        dados.erro ||
                        "Erro ao redefinir a senha."
                    );

                    return;
                }

                alert(
                    dados.mensagem
                );

                formNovaSenha.reset();

                emailRecuperacaoAtual = "";
                codigoRecuperacaoAtual = "";

                etapaNovaSenha.classList.add(
                    "escondido"
                );

                etapaEmailRecuperacao.classList.remove(
                    "escondido"
                );

                mudarTela(
                    telaRecuperacao,
                    telaLogin
                );

            } catch (erro) {

                console.error(
                    "Erro ao redefinir senha:",
                    erro
                );

                alert(
                    "Não foi possível conectar ao servidor."
                );

            }

        }
    );

}

    /* =========================================================
       NAVEGAÇÃO
       ========================================================= */

    if (linkIrParaCadastro) {

        linkIrParaCadastro.addEventListener("click", (e) => {

            e.preventDefault();

            msgErroLogin.classList.add("escondido");

            
            

            mudarTela(
                telaLogin,
                telaCadastro
            );

        });
    }


    if (linkIrParaLogin) {

        linkIrParaLogin.addEventListener("click", (e) => {

            e.preventDefault();

            mudarTela(
                telaCadastro,
                telaLogin
            );

        });
    }
    if (linkEsqueciSenha) {

    linkEsqueciSenha.addEventListener("click", (e) => {

        e.preventDefault();

        mudarTela(
            telaLogin,
            telaRecuperacao
        );

    });
}


if (linkVoltarLoginRecuperacao) {

    linkVoltarLoginRecuperacao.addEventListener("click", (e) => {

        e.preventDefault();

        mudarTela(
            telaRecuperacao,
            telaLogin
        );

    });
}


    function mudarTela(telaAntiga, telaNova) {

    if (telaAntiga) {
        telaAntiga.classList.add("escondido");
    }

    if (telaNova) {

        telaNova.classList.remove("escondido");

        telaNova.style.animationDelay = "0s";
        telaNova.style.opacity = "1";

    }

    /* =====================================================
       BOTÃO SAIR GLOBAL
       ===================================================== */

    if (btnSair) {

        const mostrarBotaoSair =
            telaNova === telaAluno ||
            telaNova === telaAvaliacoes ||
            telaNova === telaCoordenacao;

        if (mostrarBotaoSair) {

            btnSair.classList.remove("escondido");

        } else {

            btnSair.classList.add("escondido");

        }

    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
    /* =========================================================
   ESCONDER TODAS AS TELAS
   ========================================================= */

function esconderTodasAsTelas() {

    [
        telaLogin,
        telaCadastro,
        telaAluno,
        telaAvaliacoes,
        telaCoordenacao,
        telaRecuperacao
    ].forEach((tela) => {

        if (tela) {
            tela.classList.add("escondido");
        }

    });

}
/* =========================================================
   BOTÃO SAIR GLOBAL
   ========================================================= */

if (btnSair) {

    btnSair.addEventListener("click", () => {

        /* Esconde todas as telas */
        esconderTodasAsTelas();

        /* Mostra o login */
        if (telaLogin) {
            telaLogin.classList.remove("escondido");
            telaLogin.style.opacity = "1";
        }

        /* Esconde o botão Sair */
        btnSair.classList.add("escondido");

        /* Limpa o estado do humor */
        humorSelecionado = null;
        turmaAtual = "";
        avaliacoesMaterias = {};

        /* Remove seleção dos humores */
        document
            .querySelectorAll(".btn-humor.selecionado")
            .forEach((botao) => {
                botao.classList.remove("selecionado");
            });

        /* Remove seleção das matérias */
        document
            .querySelectorAll(".opcao-materia.selecionado")
            .forEach((botao) => {
                botao.classList.remove("selecionado");
            });

        /* Remove a cor do fundo */
        document.body.classList.remove(
            "bg-produtivo",
            "bg-tranquilo",
            "bg-pouco",
            "bg-muito"
        );

        /* Limpa o campo de desabafo */
        if (txtDesabafo) {
            txtDesabafo.value = "";
        }

        /* Volta para o topo */
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


    /* =========================================================
       LOGIN
       ========================================================= */
if (formLogin) {

    formLogin.addEventListener("submit", async (evento) => {

        evento.preventDefault();

        const usuarioDigitado =
            document.getElementById("usuario").value.trim();

        const senhaDigitada =
            document.getElementById("senha").value;
        const turmaDigitada =
    document.getElementById("turmaLogin").value;

        if (!usuarioDigitado || !senhaDigitada) {

    msgErroLogin.textContent =
        "Preencha usuário e senha.";

    msgErroLogin.classList.remove("escondido");

    return;
}

        try {

            const resposta = await fetch("/api/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
    usuario: usuarioDigitado,
    senha: senhaDigitada,
    turma: turmaDigitada
})

            });

            const dados = await resposta.json();

            if (!resposta.ok) {

                msgErroLogin.textContent =
                    dados.erro || "Usuário ou senha incorretos.";

                msgErroLogin.classList.remove("escondido");

                return;
            }

            msgErroLogin.classList.add("escondido");
            turmaAtual = dados.usuario.turma;

            console.log(
                "Login realizado:",
                dados.usuario
            );

            if (dados.usuario.role === "coordenacao") {

    atualizarDashboard();

    mudarTela(
        telaLogin,
        telaCoordenacao
    );

} else {

    mudarTela(
        telaLogin,
        telaAluno
    );

}

        } catch (erro) {

            console.error("Erro no login:", erro);

            msgErroLogin.textContent =
                "Não foi possível conectar ao servidor.";

            msgErroLogin.classList.remove("escondido");

        }

    });

}


    /* =========================================================
       CADASTRO
       ========================================================= */

   if (formCadastro) {

    formCadastro.addEventListener("submit", async (evento) => {

        evento.preventDefault();

        const nomeDigitado =
            document.getElementById("nomeCadastro").value.trim();

        const senhaDigitada =
            document.getElementById("senhaCadastro").value;

        const rmDigitado =
            document.getElementById("rmCadastro").value.trim();

        const emailDigitado =
            document.getElementById("emailCadastro").value.trim();

        const turmaDigitada =
            document.getElementById("turmaCadastro").value;


        if (
    !nomeDigitado ||
    !senhaDigitada ||
    !rmDigitado ||
    !emailDigitado ||
    !turmaDigitada
) {

            alert("Preencha todos os campos.");
            return;
        }


        if (senhaDigitada.length < 6) {

            alert("A senha precisa ter pelo menos 6 caracteres.");
            return;
        }


        const nomeFormatado =
            nomeDigitado
                .toLowerCase()
                .split(" ")
                .filter(Boolean)
                .map(
                    palavra =>
                        palavra.charAt(0).toUpperCase() +
                        palavra.slice(1)
                )
                .join(" ");


        try {

            const resposta = await fetch("/api/cadastro", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
    nome: nomeFormatado,
    rm: rmDigitado,
    email: emailDigitado,
    senha: senhaDigitada,
    turma: turmaDigitada
})

            });


            const dados = await resposta.json();


            if (!resposta.ok) {

                alert(dados.erro || "Erro ao realizar cadastro.");
                return;

            }


            alert(
                `Cadastro de ${nomeFormatado} realizado com sucesso!`
            );


            formCadastro.reset();


            mudarTela(
                telaCadastro,
                telaLogin
            );


            document.getElementById("usuario").value =
                nomeFormatado;

            document.getElementById("senha").value = "";


        } catch (erro) {

            console.error(erro);

            alert(
                "Não foi possível conectar ao servidor."
            );

        }

    });

}


       /* =========================================================
       BOTÃO LIMPAR DADOS
       ========================================================= */

    if (btnLimparDados) {

        btnLimparDados.addEventListener(
            "click",
            async () => {

                try {

                    const resposta =
                        await fetch("/api/votos", {
                            method: "DELETE"
                        });

                    const dados =
                        await resposta.json();

                    if (!resposta.ok) {

                        console.error(
                            dados.erro ||
                            "Erro ao apagar os votos."
                        );

                        return;
                    }

                    // Atualiza o dashboard automaticamente
                    await atualizarDashboard();

                } catch (erro) {

                    console.error(
                        "Erro ao apagar votos:",
                        erro
                    );

                }

            }
        );

    }


    /* =========================================================
       SELEÇÃO DE HUMOR
       ========================================================= */

    const botoesHumor =
        document.querySelectorAll(
            ".btn-humor"
        );


    botoesHumor.forEach((botao) => {

        botao.addEventListener(
            "click",
            () => {

                botoesHumor.forEach(
                    (b) =>
                        b.classList.remove(
                            "selecionado"
                        )
                );


                document.body.classList.remove(
                    "bg-produtivo",
                    "bg-tranquilo",
                    "bg-pouco",
                    "bg-muito"
                );


                botao.classList.add(
                    "selecionado"
                );


                humorSelecionado =
                    botao.getAttribute(
                        "data-humor"
                    );


                document.body.classList.add(
                    `bg-${humorSelecionado}`
                );

            }
        );

    });
    /* =========================================================
   IR PARA AVALIAÇÃO DAS MATÉRIAS
   ========================================================= */

if (btnProximaAvaliacao) {

    btnProximaAvaliacao.addEventListener("click", () => {

        mudarTela(
            telaAluno,
            telaAvaliacoes
        );

    });

}  
/* =========================================================
   AVALIAÇÃO DAS MATÉRIAS
   ========================================================= */

const materias = [
    "Português",
    "Matemática",
    "História",
    "Geografia",
    "Biologia",
    "Física",
    "Química",
    "Inglês"
];

const listaMaterias =
    document.getElementById("listaMaterias");

if (listaMaterias) {

    listaMaterias.innerHTML = "";

    materias.forEach((materia, index) => {

        const card =
            document.createElement("div");

        card.className = "card-materia";

        card.innerHTML = `
            <div class="cabecalho-materia">
                <h3>${materia}</h3>

                <span>
                    Como está sendo esta matéria?
                </span>
            </div>

            <div class="opcoes-materia">

                <button
                    type="button"
                    class="opcao-materia"
                    data-materia="${index}"
                    data-humor="produtivo"
                >
                    Super Produtivo
                </button>

                <button
                    type="button"
                    class="opcao-materia"
                    data-materia="${index}"
                    data-humor="tranquilo"
                >
                    Tranquilo
                </button>

                <button
                    type="button"
                    class="opcao-materia"
                    data-materia="${index}"
                    data-humor="pouco"
                >
                    Parcialmente
                </button>

                <button
                    type="button"
                    class="opcao-materia"
                    data-materia="${index}"
                    data-humor="muito"
                >
                    Sobrecarregado
                </button>

            </div>
        `;

        listaMaterias.appendChild(card);

    });


    /* -----------------------------------------------
       SELEÇÃO DAS OPÇÕES
    ------------------------------------------------ */

    const botoesMaterias =
        document.querySelectorAll(".opcao-materia");

    botoesMaterias.forEach((botao) => {

        botao.addEventListener("click", () => {

            const numeroMateria =
                botao.getAttribute("data-materia");

            const botoesDaMateria =
                document.querySelectorAll(
                    `.opcao-materia[data-materia="${numeroMateria}"]`
                );

            botoesDaMateria.forEach((b) => {
                b.classList.remove("selecionado");
            });

            botao.classList.add("selecionado");

            const humor =
                botao.getAttribute("data-humor");

            const materia =
                materias[numeroMateria];

            avaliacoesMaterias[materia] = humor;

            console.log(
                "Avaliação:",
                materia,
                humor
            );

        });

    });

}
    /* =========================================================
       ENVIAR AVALIAÇÕES DAS MATÉRIAS
       ========================================================= */

    const btnEnviarVotosMaterias =
        document.getElementById("btnEnviarVotosMaterias");

    if (btnEnviarVotosMaterias) {

        btnEnviarVotosMaterias.addEventListener(
            "click",
            async () => {

                /* -----------------------------------------
                   VERIFICAR HUMOR PRINCIPAL
                ----------------------------------------- */

                if (!humorSelecionado) {

                    alert(
                        "Selecione primeiro como está sendo sua semana."
                    );

                    return;
                }


                /* -----------------------------------------
                   PEGAR TODAS AS AVALIAÇÕES
                ----------------------------------------- */

                const materiasSelecionadas = {};

                let todasRespondidas = true;


                materias.forEach((materia, index) => {

                    const selecionada =
                        document.querySelector(
                            `.opcao-materia.selecionado[data-materia="${index}"]`
                        );


                    if (!selecionada) {

                        todasRespondidas = false;

                        return;
                    }


                    materiasSelecionadas[materia] =
                        selecionada.getAttribute(
                            "data-humor"
                        );

                });


                /* -----------------------------------------
                   VERIFICAR SE TODAS FORAM RESPONDIDAS
                ----------------------------------------- */

                if (!todasRespondidas) {

                    alert(
                        "Avalie todas as matérias antes de enviar seu registro."
                    );

                    return;
                }


                /* -----------------------------------------
                   PEGAR DESABAFO
                ----------------------------------------- */

                const desabafo =
                    txtDesabafo?.value.trim() || "";


                /* -----------------------------------------
                   VERIFICAR TURMA
                ----------------------------------------- */

                if (!turmaAtual) {

                    alert(
                        "Não foi possível identificar sua turma."
                    );

                    return;
                }


                /* -----------------------------------------
                   MONTAR REGISTRO
                ----------------------------------------- */

                const registro = {

                    turma: turmaAtual,

                    humor: humorSelecionado,

                    desabafo: desabafo,

                    materias: materiasSelecionadas

                };


                /* -----------------------------------------
                   DESABILITAR BOTÃO
                ----------------------------------------- */

                btnEnviarVotosMaterias.disabled = true;

                btnEnviarVotosMaterias.innerText =
                    "Enviando...";


                try {

                    const resposta =
                        await fetch("/api/votos", {

                            method: "POST",

                            headers: {
                                "Content-Type": "application/json"
                            },

                            body: JSON.stringify(registro)

                        });


                    const dados =
                        await resposta.json();


                    if (!resposta.ok) {

                        alert(
                            dados.erro ||
                            "Erro ao enviar seu registro."
                        );

                        return;
                    }


                    /* -------------------------------------
                       SUCESSO
                    ------------------------------------- */

                    if (msgSucessoMaterias) {

    msgSucessoMaterias.classList.add(
        "visivel"
    );

}


                    /* -------------------------------------
                       LIMPAR AVALIAÇÕES
                    ------------------------------------- */

                    document
                        .querySelectorAll(
                            ".opcao-materia.selecionado"
                        )
                        .forEach((botao) => {

                            botao.classList.remove(
                                "selecionado"
                            );

                        });


                    avaliacoesMaterias = {};


                    /* -------------------------------------
                       LIMPAR DESABAFO
                    ------------------------------------- */

                    if (txtDesabafo) {

                        txtDesabafo.value = "";

                    }


                    /* -------------------------------------
                       LIMPAR HUMOR PRINCIPAL
                    ------------------------------------- */

                    document
                        .querySelectorAll(
                            ".btn-humor.selecionado"
                        )
                        .forEach((botao) => {

                            botao.classList.remove(
                                "selecionado"
                            );

                        });


                    document.body.classList.remove(
                        "bg-produtivo",
                        "bg-tranquilo",
                        "bg-pouco",
                        "bg-muito"
                    );


                    humorSelecionado = null;


                    /* -------------------------------------
                       VOLTAR PARA LOGIN
                    ------------------------------------- */

                    setTimeout(() => {

                        if (msgSucessoMaterias) {

    msgSucessoMaterias.classList.remove(
        "visivel"
    );

}


                        esconderTodasAsTelas();

                        telaLogin.classList.remove(
                            "escondido"
                        );


                        window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        });

                    }, 1500);


                } catch (erro) {

                    console.error(
                        "Erro ao enviar voto:",
                        erro
                    );


                    alert(
                        "Não foi possível conectar ao servidor."
                    );

                } finally {

                    btnEnviarVotosMaterias.disabled =
                        false;

                    btnEnviarVotosMaterias.innerText =
                        "Enviar Registro Semanal";

                }

            }
        );

    }
    /* =========================================================
       DASHBOARD
       ========================================================= */

    async function atualizarDashboard() {

    try {

        const resposta = await fetch("/api/votos");

        const votos = await resposta.json();

        if (!resposta.ok) {
            throw new Error("Erro ao buscar votos.");
        }
        const seletorTurma =
    document.getElementById("turmaCoordenacao");

const turmaSelecionada =
    seletorTurma.value;

const nomeTurmaSelecionada =
    document.getElementById("nomeTurmaSelecionada");

if (nomeTurmaSelecionada) {

    nomeTurmaSelecionada.innerText =
        turmaSelecionada
            ? ` — ${seletorTurma.options[seletorTurma.selectedIndex].text}`
            : "";

}
const votosDaTurma =
    votos.filter(voto => voto.turma === turmaSelecionada);


        /* =====================================================
           CONTAGEM DOS VOTOS
           ===================================================== */

        const dadosAtuais = {
            produtivo: 0,
            tranquilo: 0,
            pouco: 0,
            muito: 0
        };


        votosDaTurma.forEach(voto => {

            if (dadosAtuais[voto.humor] !== undefined) {

                dadosAtuais[voto.humor]++;

            }

        });


        const total =
            dadosAtuais.produtivo +
            dadosAtuais.tranquilo +
            dadosAtuais.pouco +
            dadosAtuais.muito;


        document.getElementById(
            "indTotalVotos"
        ).innerText = total;


        document.getElementById(
            "indAlertaCritico"
        ).innerText =
            dadosAtuais.muito;


        /* =====================================================
           GRÁFICO
           ===================================================== */

        const escalaMax = 21;


        function calcularAltura(votos) {

            if (votos <= 0) {
                return "0%";
            }

            const altura =
                (votos / escalaMax) * 100;

            return Math.min(
                altura,
                100
            ) + "%";

        }


        atualizarBarra(
            "barraProdutivo",
            "valProdutivo",
            dadosAtuais.produtivo
        );


        atualizarBarra(
            "barraTranquilo",
            "valTranquilo",
            dadosAtuais.tranquilo
        );


        atualizarBarra(
            "barraPouco",
            "valPouco",
            dadosAtuais.pouco
        );


        atualizarBarra(
            "barraMuito",
            "valMuito",
            dadosAtuais.muito
        );


        function atualizarBarra(
            barraId,
            valorId,
            quantidade
        ) {

            const barra =
                document.getElementById(
                    barraId
                );


            const valor =
                document.getElementById(
                    valorId
                );


            if (barra) {

                barra.style.height =
                    calcularAltura(quantidade);

            }


            if (valor) {

                valor.innerText =
                    quantidade;

            }

        }
        /* =====================================================
   AVALIAÇÃO POR MATÉRIA
   ===================================================== */

atualizarMaterias(votosDaTurma);


        /* =====================================================
           MURAL DE DESABAFOS
           ===================================================== */

        const feedDesabafos =
            document.getElementById(
                "feedDesabafos"
            );


        if (feedDesabafos) {

            feedDesabafos.innerHTML = "";


            const desabafos =
                votosDaTurma.filter(
                    voto =>
                        voto.desabafo &&
                        voto.desabafo.trim() !== ""
                );


            if (desabafos.length === 0) {

                feedDesabafos.innerHTML = `
                    <p class="sem-dados">
                        Nenhum comentário ou desabafo
                        registrado até o momento.
                    </p>
                `;

            } else {

                desabafos.forEach(voto => {

                    const p =
                        document.createElement(
                            "p"
                        );


                    p.classList.add(
                        "item-desabafo"
                    );


                    p.innerText =
                        voto.desabafo;


                    feedDesabafos.appendChild(
                        p
                    );

                });

            }

        }


        } catch (erro) {

        console.error(
            "Erro ao atualizar dashboard:",
            erro
        );

    }

}


/* =========================================================
   AVALIAÇÃO POR MATÉRIA
   ========================================================= */

function atualizarMaterias(votosDaTurma) {

    const gridMaterias =
        document.getElementById("gridMateriasDashboard");

    if (!gridMaterias) {
        return;
    }

    gridMaterias.innerHTML = "";

    const materiasDashboard = [
        "Português",
        "Matemática",
        "História",
        "Geografia",
        "Biologia",
        "Física",
        "Química",
        "Inglês"
    ];

    if (votosDaTurma.length === 0) {

        gridMaterias.innerHTML = `
            <p class="sem-dados">
                Nenhuma avaliação por matéria
                registrada até o momento.
            </p>
        `;

        return;
    }

    materiasDashboard.forEach(materia => {

        const contagem = {
            produtivo: 0,
            tranquilo: 0,
            pouco: 0,
            muito: 0
        };

       votosDaTurma.forEach(voto => {

    if (!voto.materias) {
        return;
    }

    const materiasObj =
        voto.materias instanceof Map
            ? Object.fromEntries(voto.materias)
            : voto.materias;

    const avaliacao =
        materiasObj[materia];

    if (contagem[avaliacao] !== undefined) {
        contagem[avaliacao]++;
    }

});

        const totalMateria =
            contagem.produtivo +
            contagem.tranquilo +
            contagem.pouco +
            contagem.muito;

        function porcentagem(valor) {

            if (totalMateria === 0) {
                return 0;
            }

            return Math.round(
                (valor / totalMateria) * 100
            );

        }

        const card =
            document.createElement("div");

        card.className =
            "card-materia-dashboard";

        card.innerHTML = `

            <div class="topo-materia-dashboard">

                <div>

                    <h4>${materia}</h4>

                    <span>
                        ${totalMateria}
                        avaliação${totalMateria !== 1 ? "ões" : ""}
                    </span>

                </div>

            </div>

            <div class="dados-materia-dashboard">

                <div class="linha-materia">

                    <div class="info-materia">

                        <span class="ponto-materia produtivo"></span>

                        <span>
                            Super Produtivo
                        </span>

                    </div>

                    <strong>
                        ${contagem.produtivo}
                    </strong>

                </div>

                <div class="barra-materia">

                    <div
                        class="preenchimento-materia produtivo"
                        style="width: ${porcentagem(contagem.produtivo)}%;"
                    ></div>

                </div>


                <div class="linha-materia">

                    <div class="info-materia">

                        <span class="ponto-materia tranquilo"></span>

                        <span>
                            Tranquilo
                        </span>

                    </div>

                    <strong>
                        ${contagem.tranquilo}
                    </strong>

                </div>

                <div class="barra-materia">

                    <div
                        class="preenchimento-materia tranquilo"
                        style="width: ${porcentagem(contagem.tranquilo)}%;"
                    ></div>

                </div>


                <div class="linha-materia">

                    <div class="info-materia">

                        <span class="ponto-materia pouco"></span>

                        <span>
                            Parcialmente
                        </span>

                    </div>

                    <strong>
                        ${contagem.pouco}
                    </strong>

                </div>

                <div class="barra-materia">

                    <div
                        class="preenchimento-materia pouco"
                        style="width: ${porcentagem(contagem.pouco)}%;"
                    ></div>

                </div>


                <div class="linha-materia">

                    <div class="info-materia">

                        <span class="ponto-materia muito"></span>

                        <span>
                            Sobrecarregado
                        </span>

                    </div>

                    <strong>
                        ${contagem.muito}
                    </strong>

                </div>

                <div class="barra-materia">

                    <div class="preenchimento-materia muito"
                        style="width: ${porcentagem(contagem.muito)}%;"
                    ></div>

                </div>

            </div>
        `;

        gridMaterias.appendChild(card);

    });

}


/* =========================================================
   CHAT VIRTUAL DE ACOLHIMENTO
   ========================================================= */
    criarChatAcolhimento();


    function criarChatAcolhimento() {

        /*
         * Cria o botão do chat automaticamente.
         * Não precisa adicionar HTML manualmente.
         */

        const botaoChat =
            document.createElement("button");

        botaoChat.id =
            "botaoChatAcolhimento";

        botaoChat.type =
            "button";

        botaoChat.setAttribute(
            "aria-label",
            "Abrir chat de acolhimento"
        );

        botaoChat.innerHTML =
            `
            <span class="chat-icone">💬</span>
            <span class="chat-ponto"></span>
            `;


        /* -----------------------------------------------
           JANELA
        ------------------------------------------------ */

        const janelaChat =
            document.createElement("div");

        janelaChat.id =
            "janelaChatAcolhimento";

        janelaChat.className =
            "chat-fechado";


        janelaChat.innerHTML =
            `
            <div class="chat-cabecalho">

                <div>
                    <strong>
                        💜 Acolhimento Escolar
                    </strong>

                    <small>
                        Assistente virtual
                    </small>
                </div>

                <button
                    type="button"
                    id="fecharChat"
                    aria-label="Fechar chat"
                >
                    ×
                </button>

            </div>


            <div
                class="chat-mensagens"
                id="chatMensagens"
            >

                <div class="mensagem-chat bot">
                    <span class="avatar-chat">
                        🤖
                    </span>

                    <div class="balao-chat">
                        Oi! 💜
                        Estou aqui para ouvir você.
                        Pode conversar comigo sem medo.
                    </div>
                </div>


                <div class="mensagem-chat bot">

                    <span class="avatar-chat">
                        🤖
                    </span>

                    <div class="balao-chat">
                        Como você está se sentindo hoje?
                    </div>

                </div>

            </div>


            <div class="chat-opcoes">

                <button
                    type="button"
                    data-resposta="bem"
                >
                    😊 Estou bem
                </button>

                <button
                    type="button"
                    data-resposta="cansado"
                >
                    😔 Estou cansado
                </button>

                <button
                    type="button"
                    data-resposta="sobrecarregado"
                >
                    😣 Estou sobrecarregado
                </button>

                <button
                    type="button"
                    data-resposta="conversar"
                >
                    💬 Quero conversar
                </button>

            </div>


            <form
                class="chat-form"
                id="chatForm"
            >

                <input
                    type="text"
                    id="chatInput"
                    placeholder="Digite uma mensagem..."
                    maxlength="300"
                    autocomplete="off"
                >

                <button
                    type="submit"
                    aria-label="Enviar mensagem"
                >
                    ➤
                </button>

            </form>

            <div class="chat-aviso">
                💜 Este é um assistente virtual.
                Se estiver em uma situação de risco,
                procure imediatamente um adulto de confiança
                ou o serviço de emergência adequado.
            </div>
            `;


        document.body.appendChild(
            botaoChat
        );

        document.body.appendChild(
            janelaChat
        );


        /* -----------------------------------------------
           ABRIR CHAT
        ------------------------------------------------ */

        botaoChat.addEventListener(
            "click",
            () => {

                janelaChat.classList.toggle(
                    "chat-fechado"
                );

                janelaChat.classList.toggle(
                    "chat-aberto"
                );


                if (
                    janelaChat.classList.contains(
                        "chat-aberto"
                    )
                ) {

                    setTimeout(() => {

                        const input =
                            document.getElementById(
                                "chatInput"
                            );

                        if (input) {
                            input.focus();
                        }

                    }, 200);

                }

            }
        );


        /* -----------------------------------------------
           FECHAR CHAT
        ------------------------------------------------ */

        document
            .getElementById("fecharChat")
            .addEventListener(
                "click",
                () => {

                    janelaChat.classList.remove(
                        "chat-aberto"
                    );

                    janelaChat.classList.add(
                        "chat-fechado"
                    );

                }
            );


        /* -----------------------------------------------
           BOTÕES DE RESPOSTA
        ------------------------------------------------ */

        const opcoes =
            janelaChat.querySelectorAll(
                ".chat-opcoes button"
            );


        opcoes.forEach(
            (opcao) => {

                opcao.addEventListener(
                    "click",
                    () => {

                        const tipo =
                            opcao.dataset.resposta;

                        adicionarMensagemUsuario(
                            opcao.innerText
                        );

                        responderChat(
                            tipo
                        );

                    }
                );

            }
        );


        /* -----------------------------------------------
           ENVIO DE TEXTO
        ------------------------------------------------ */

        const chatForm =
            document.getElementById(
                "chatForm"
            );


        chatForm.addEventListener(
    "submit",
    async (evento) => {

        evento.preventDefault();

        const input =
            document.getElementById(
                "chatInput"
            );

        const texto =
            input.value.trim();

        if (!texto) {
            return;
        }

        adicionarMensagemUsuario(texto);

        input.value = "";

        mostrarDigitando();

        try {

            const resposta = await fetch(
                "/api/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        mensagem: texto
                    })
                }
            );

            const dados =
                await resposta.json();

            removerDigitando();

            if (!resposta.ok) {

                adicionarMensagemBot(
                    dados.erro ||
                    "Não consegui responder agora. 😔"
                );

                return;
            }

            adicionarMensagemBot(
                dados.resposta
            );

        } catch (erro) {

            console.error(
                "Erro ao conversar com a IA:",
                erro
            );

            removerDigitando();

            adicionarMensagemBot(
                "Não consegui me conectar à assistente agora. 😔"
            );

        }

    }
);

    }
    /* =========================================================
       ADICIONAR MENSAGEM DO USUÁRIO
       ========================================================= */

    function adicionarMensagemUsuario(
        texto
    ) {

        const mensagens =
            document.getElementById(
                "chatMensagens"
            );


        if (!mensagens) {
            return;
        }


        const mensagem =
            document.createElement(
                "div"
            );


        mensagem.className =
            "mensagem-chat usuario";


        mensagem.innerHTML =
            `
            <div class="balao-chat">
                ${escaparHTML(texto)}
            </div>
            `;


        mensagens.appendChild(
            mensagem
        );


        rolarChatParaBaixo();

    }


    /* =========================================================
       RESPOSTAS DO CHAT
       ========================================================= */

    function responderChat(tipo) {

        let resposta = "";


        switch (tipo) {

            case "bem":

                resposta =
                    "Que bom saber disso! 💜 Continue cuidando de você e aproveite esse momento positivo.";

                break;


            case "cansado":

                resposta =
                    "Entendo. 😔 Às vezes o cansaço acumula mesmo. Se puder, tente fazer uma pausa, respirar um pouco e conversar com alguém de confiança.";

                break;


            case "sobrecarregado":

                resposta =
                    "Sinto muito que você esteja se sentindo assim. 💜 Você não precisa enfrentar tudo sozinho. Considere conversar com um professor, responsável, coordenação ou psicologia escolar.";

                break;


            case "conversar":

                resposta =
                    "Claro. 💜 Pode me contar o que está acontecendo. Vou te ouvir sem julgamentos.";

                break;


            default:

                resposta =
                    "Estou aqui para ouvir você. 💜";

        }


        mostrarRespostaComDelay(
            resposta
        );

    }


    /* =========================================================
       RESPOSTA BASEADA NO TEXTO
       ========================================================= */

    function responderPorTexto(
        texto
    ) {

        const mensagem =
            texto.toLowerCase();


        let resposta;


        if (
            mensagem.includes("ansioso") ||
            mensagem.includes("ansiedade") ||
            mensagem.includes("ansiosa")
        ) {

            resposta =
                "Entendo. 💜 A ansiedade pode deixar tudo mais pesado. Tente respirar devagar e, se isso estiver atrapalhando muito você, procure alguém de confiança para conversar.";


        } else if (
            mensagem.includes("cansado") ||
            mensagem.includes("cansada") ||
            mensagem.includes("exausto") ||
            mensagem.includes("exausta")
        ) {

            resposta =
                "Parece que você está precisando de um pouco de cuidado. 💜 Se puder, faça uma pausa e converse com alguém que possa te apoiar.";


        } else if (
            mensagem.includes("prova") ||
            mensagem.includes("trabalho") ||
            mensagem.includes("tarefa") ||
            mensagem.includes("escola")
        ) {

            resposta =
                "A rotina escolar pode ficar pesada. 📚 Talvez dividir as tarefas em pequenas etapas ajude. E lembre: pedir ajuda também faz parte do processo.";


        } else if (
            mensagem.includes("triste") ||
            mensagem.includes("tristeza")
        ) {

            resposta =
                "Sinto muito que você esteja passando por isso. 💜 Não precisa guardar tudo sozinho. Procure alguém de confiança para conversar.";


        } else if (
            mensagem.includes("sozinho") ||
            mensagem.includes("sozinha")
        ) {

            resposta =
                "Você merece ter apoio. 💜 Tente procurar um amigo, professor, responsável ou alguém da equipe escolar em quem confie.";


        } else if (
            mensagem.includes("obrigado") ||
            mensagem.includes("obrigada")
        ) {

            resposta =
                "Por nada! 💜 Sempre que precisar organizar seus pensamentos, você pode conversar por aqui.";


        } else {

            resposta =
                "Obrigado por compartilhar isso comigo. 💜 Quer me contar um pouco mais sobre como você está se sentindo?";

        }


        mostrarRespostaComDelay(
            resposta
        );

    }


    /* =========================================================
       MOSTRAR RESPOSTA
       ========================================================= */

    function mostrarRespostaComDelay(
        texto
    ) {

        mostrarDigitando();


        setTimeout(
            () => {

                removerDigitando();

                adicionarMensagemBot(
                    texto
                );

            },
            700
        );

    }


    /* =========================================================
       MENSAGEM DO BOT
       ========================================================= */

    function adicionarMensagemBot(
        texto
    ) {

        const mensagens =
            document.getElementById(
                "chatMensagens"
            );


        if (!mensagens) {
            return;
        }


        const mensagem =
            document.createElement(
                "div"
            );


        mensagem.className =
            "mensagem-chat bot";


        mensagem.innerHTML =
            `
            <span class="avatar-chat">
                🤖
            </span>

            <div class="balao-chat">
                ${escaparHTML(texto)}
            </div>
            `;


        mensagens.appendChild(
            mensagem
        );


        rolarChatParaBaixo();

    }


    /* =========================================================
       "DIGITANDO..."
       ========================================================= */

    function mostrarDigitando() {

        const mensagens =
            document.getElementById(
                "chatMensagens"
            );


        if (!mensagens) {
            return;
        }


        const digitando =
            document.createElement(
                "div"
            );


        digitando.id =
            "chatDigitando";


        digitando.className =
            "mensagem-chat bot";


        digitando.innerHTML =
            `
            <span class="avatar-chat">
                🤖
            </span>

            <div class="balao-chat digitando">
                <span></span>
                <span></span>
                <span></span>
            </div>
            `;


        mensagens.appendChild(
            digitando
        );


        rolarChatParaBaixo();

    }


    function removerDigitando() {

        const digitando =
            document.getElementById(
                "chatDigitando"
            );


        if (digitando) {

            digitando.remove();

        }

    }


    /* =========================================================
       ROLAGEM DO CHAT
       ========================================================= */

    function rolarChatParaBaixo() {

        const mensagens =
            document.getElementById(
                "chatMensagens"
            );


        if (!mensagens) {
            return;
        }


        setTimeout(() => {

            mensagens.scrollTop =
                mensagens.scrollHeight;

        }, 50);

    }


    /* =========================================================
       PROTEÇÃO CONTRA HTML
       ========================================================= */

    function escaparHTML(texto) {

        const div =
            document.createElement(
                "div"
            );

        div.textContent =
            texto;

        return div.innerHTML;

    }


    /* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

const turmaCoordenacao =
    document.getElementById("turmaCoordenacao");

if (turmaCoordenacao) {

    turmaCoordenacao.addEventListener(
        "change",
        () => {

            atualizarDashboard();

        }
    );

}

atualizarDashboard();

});
