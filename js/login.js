import {
  autenticar,
  redirecionarUsuarioAutenticado,
} from "./auth.js";

// =========================================================
// ELEMENTOS
// =========================================================

const formulario =
  document.getElementById("form-login");

const campoLogin =
  document.getElementById("login");

const campoSenha =
  document.getElementById("senha");

const mensagem =
  document.getElementById("mensagem-login");

// =========================================================
// MENSAGEM
// =========================================================

function mostrarMensagem(texto) {
  mensagem.textContent = texto;

  mensagem.className =
    "mensagem-login erro visivel";
}

// =========================================================
// LOGIN
// =========================================================

function realizarLogin(evento) {
  evento.preventDefault();

  const login =
    campoLogin.value.trim();

  const senha =
    campoSenha.value;

  mensagem.textContent = "";
  mensagem.className = "mensagem-login";

  const usuario =
    autenticar(login, senha);

  if (!usuario) {
    mostrarMensagem(
      "Login ou senha incorretos.",
    );

    campoSenha.value = "";

    campoSenha.focus();

    return;
  }

  if (usuario.perfil === "admin") {
    window.location.replace("./admin.html");

    return;
  }

  window.location.replace("./index.html");
}

// =========================================================
// INICIALIZAÇÃO
// =========================================================

redirecionarUsuarioAutenticado();

formulario.addEventListener(
  "submit",
  realizarLogin,
);

campoLogin.focus();