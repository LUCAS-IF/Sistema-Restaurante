// =========================================================
// AUTENTICAÇÃO E CONTROLE DE ACESSO
// =========================================================

const CHAVE_SESSAO = "saborarte_sessao";

const USUARIOS = Object.freeze([
  {
    id: "admin",
    login: "admin",
    senha: "Admin123!",
    nome: "Administrador",
    perfil: "admin",
  },

  {
    id: "cliente",
    login: "cliente",
    senha: "Cliente123!",
    nome: "Cliente",
    perfil: "cliente",
  },
]);

// =========================================================
// LOGIN
// =========================================================

export function autenticar(login, senha) {
  const loginNormalizado = String(login || "").trim();

  const usuario = USUARIOS.find(
    (item) =>
      item.login === loginNormalizado &&
      item.senha === String(senha || ""),
  );

  if (!usuario) {
    return null;
  }

  const sessao = {
    id: usuario.id,
    login: usuario.login,
    nome: usuario.nome,
    perfil: usuario.perfil,
  };

  sessionStorage.setItem(
    CHAVE_SESSAO,
    JSON.stringify(sessao),
  );

  return { ...sessao };
}

// =========================================================
// RECUPERAR SESSÃO
// =========================================================

export function obterSessao() {
  const sessaoSalva =
    sessionStorage.getItem(CHAVE_SESSAO);

  if (!sessaoSalva) {
    return null;
  }

  try {
    const sessao = JSON.parse(sessaoSalva);

    if (
      !sessao ||
      typeof sessao !== "object" ||
      !sessao.id ||
      !sessao.login ||
      !sessao.nome ||
      !sessao.perfil
    ) {
      sessionStorage.removeItem(CHAVE_SESSAO);

      return null;
    }

    return sessao;
  } catch (erro) {
    console.error(
      "Erro ao recuperar a sessão:",
      erro,
    );

    sessionStorage.removeItem(CHAVE_SESSAO);

    return null;
  }
}

// =========================================================
// LOGOUT
// =========================================================

export function encerrarSessao() {
  sessionStorage.removeItem(CHAVE_SESSAO);
}

// =========================================================
// DESTINO DE CADA PERFIL
// =========================================================

export function obterPaginaDoPerfil(perfil) {
  if (perfil === "admin") {
    return "admin.html";
  }

  if (perfil === "cliente") {
    return "index.html";
  }

  return "login.html";
}

// =========================================================
// EXIGIR PERFIL
// =========================================================

export function exigirPerfil(perfilEsperado) {
  const sessao = obterSessao();

  if (!sessao) {
    window.location.replace("./login.html");

    return null;
  }

  if (sessao.perfil !== perfilEsperado) {
    const paginaCorreta =
      obterPaginaDoPerfil(sessao.perfil);

    window.location.replace(`./${paginaCorreta}`);

    return null;
  }

  return sessao;
}

// =========================================================
// PROTEGER TELA DE LOGIN
// =========================================================

export function redirecionarUsuarioAutenticado() {
  const sessao = obterSessao();

  if (!sessao) {
    return;
  }

  const paginaCorreta =
    obterPaginaDoPerfil(sessao.perfil);

  window.location.replace(`./${paginaCorreta}`);
}

// =========================================================
// CONFIGURAR INTERFACE DO USUÁRIO
// =========================================================

export function configurarInterfaceAutenticada(
  elementoNome,
  elementoSair,
) {
  const sessao = obterSessao();

  if (!sessao) {
    return;
  }

  const nome =
    typeof elementoNome === "string"
      ? document.getElementById(elementoNome)
      : elementoNome;

  const botaoSair =
    typeof elementoSair === "string"
      ? document.getElementById(elementoSair)
      : elementoSair;

  if (nome) {
    nome.textContent = `Olá, ${sessao.nome}`;
  }

  if (botaoSair) {
    botaoSair.addEventListener(
      "click",
      () => {
        encerrarSessao();

        window.location.replace("./login.html");
      },
    );
  }
}