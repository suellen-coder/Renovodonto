// Adicione no início do script.js para ativar a página de limite.
// Altere para true quando as cinco vagas forem preenchidas.

const limiteAtingido = false;

if (
  limiteAtingido &&
  !window.location.pathname.endsWith("limite.html")
) {
  window.location.replace("limite.html");
}

// script.js
const formulario = document.querySelector("#formulario");
const paginaTriagem = document.querySelector("#pagina-triagem");
const paginaRecompensa = document.querySelector("#pagina-recompensa");
const nomeRecompensa = document.querySelector("#nome-recompensa");
const mensagemErro = document.querySelector("#erro");
const botaoWhatsApp = document.querySelector(".reward-button");

const numeroWhatsApp = "5588994673004";

const respostasFormatadas = {
  clareamento: {
    sim: "Sim, já fiz",
    nao: "Não, seria a primeira vez"
  },
  sensibilidade: {
    frequente: "Frequentemente",
    "as-vezes": "Às vezes",
    nao: "Não sinto"
  },
  momento: {
    agora: "O quanto antes",
    mes: "Neste mês",
    pesquisando: "Estou pesquisando"
  }
};

// Adicione após as constantes no script.js

const elementosAnimados = document.querySelectorAll(
  ".intro, #formulario"
);

elementosAnimados.forEach((elemento) => {
  elemento.classList.add("reveal");
});

const observador = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("is-visible");
        observador.unobserve(entrada.target);
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -40px 0px"
  }
);

elementosAnimados.forEach((elemento) => {
  observador.observe(elemento);
});

function obterDadosFormulario() {
  const nome = document.querySelector("#nome").value.trim();

  const clareamento = formulario.querySelector(
    'input[name="clareamento"]:checked'
  )?.value;

  const sensibilidade = formulario.querySelector(
    'input[name="sensibilidade"]:checked'
  )?.value;

  const momento = formulario.querySelector(
    'input[name="momento"]:checked'
  )?.value;

  return {
    nome,
    clareamento: respostasFormatadas.clareamento[clareamento],
    sensibilidade: respostasFormatadas.sensibilidade[sensibilidade],
    momento: respostasFormatadas.momento[momento]
  };
}

function criarMensagemWhatsApp(dados) {
  return `Olá! Meu nome é *${dados.nome}*.

Acabei de responder à triagem da condição especial de sexta-feira da Clínica Renov e gostaria de aproveitar minha recompensa!

Minhas respostas:

🦷 Já fiz clareamento antes?
*${dados.clareamento}*

⚡ Sinto sensibilidade nos dentes?
*${dados.sensibilidade}*

📅 Quando gostaria de transformar meu sorriso?
*${dados.momento}*

Gostaria de saber mais sobre a Consulta Diagnóstica e o valor exclusivo para clareamento! 🦷✨`;
}

function atualizarLinkWhatsApp(dados) {
  const mensagem = criarMensagemWhatsApp(dados);

  botaoWhatsApp.href =
    `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
}

// Adicione estas linhas dentro da função abrirRecompensa()

function abrirRecompensa(dados) {
  nomeRecompensa.textContent = dados.nome;

  const mensagem = criarMensagemWhatsApp(dados);

  botaoWhatsApp.href =
    `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

  paginaTriagem.classList.add("hidden");
  paginaRecompensa.classList.remove("hidden");

  const rewardCard = document.querySelector(".reward-card");

  rewardCard.classList.remove("reward-visible");

  requestAnimationFrame(() => {
    rewardCard.classList.add("reward-visible");
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function abrirTriagem() {
  paginaRecompensa.classList.add("hidden");
  paginaTriagem.classList.remove("hidden");
}

function obterDadosFormulario() {
  const dados = new FormData(formulario);

  return {
    nome: dados.get("nome")?.trim(),
    clareamento:
      respostasFormatadas.clareamento[dados.get("clareamento")],
    sensibilidade:
      respostasFormatadas.sensibilidade[dados.get("sensibilidade")],
    momento:
      respostasFormatadas.momento[dados.get("momento")]
  };
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  if (!formulario.checkValidity()) {
    mensagemErro.classList.add("visible");
    formulario.querySelector(":invalid")?.focus();
    return;
  }

  mensagemErro.classList.remove("visible");

  const dados = obterDadosFormulario();

  sessionStorage.setItem(
    "renovTriagem",
    JSON.stringify(dados)
  );

  history.pushState(
    { pagina: "recompensa" },
    "",
    "#recompensa"
  );

  abrirRecompensa(dados);
});

window.addEventListener("popstate", () => {
  if (location.hash === "#recompensa") {
    const dadosSalvos = JSON.parse(
      sessionStorage.getItem("renovTriagem") || "null"
    );

    if (dadosSalvos) {
      abrirRecompensa(dadosSalvos);
    } else {
      abrirTriagem();
    }
  } else {
    abrirTriagem();
  }
});

if (location.hash === "#recompensa") {
  const dadosSalvos = JSON.parse(
    sessionStorage.getItem("renovTriagem") || "null"
  );

  if (dadosSalvos) {
    abrirRecompensa(dadosSalvos);
  } else {
    history.replaceState({}, "", location.pathname);
    abrirTriagem();
  }
}

