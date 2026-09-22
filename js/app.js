import {
  exigirPerfil,
  configurarInterfaceAutenticada,
} from "./auth.js";

import { Carrinho } from "./models/Carrinho.js";
import { Pedido } from "./models/Pedido.js";
import { Gerenciador } from "./Gerenciador.js";
import { criarProdutosIniciais } from "./dadosIniciais.js";

// =========================================================
// CONTROLE DE ACESSO
// =========================================================

const usuarioAtual =
  exigirPerfil("cliente");

configurarInterfaceAutenticada(
  "usuario-logado",
  "btn-sair",
);

// =========================================================
// OBJETOS PRINCIPAIS
// =========================================================

const gerenciador = new Gerenciador();

const carrinho =
  new Carrinho();

const CHAVE_CARRINHO =
  `restaurante_carrinho_${usuarioAtual.id}`;

// =========================================================
// ELEMENTOS DA PÁGINA
// =========================================================

const listaProdutos = document.getElementById("lista-produtos");

const filtrosCategoria = document.getElementById("filtros-categoria");

const listaCarrinho = document.getElementById("lista-carrinho");

const resumoCarrinho = document.getElementById("resumo-carrinho");

const contadorCarrinho = document.getElementById("contador-carrinho");

const mensagem = document.getElementById("mensagem");

const slideCarrossel = document.getElementById("slide-carrossel");

const indicadoresCarrossel = document.getElementById("indicadores-carrossel");

const btnAnterior = document.getElementById("btn-anterior");

const btnProximo = document.getElementById("btn-proximo");

const btnLimparCarrinho = document.getElementById("btn-limpar-carrinho");

const btnFinalizar = document.getElementById("btn-finalizar");

const modalCheckout = document.getElementById("modal-checkout");

const formCheckout = document.getElementById("form-checkout");

const campoNomeCliente = document.getElementById("nome-cliente");

const resumoCheckout = document.getElementById("resumo-checkout");

const btnFecharCheckout = document.getElementById("btn-fechar-checkout");

const btnCancelarCheckout = document.getElementById("btn-cancelar-checkout");

const listaPedidos = document.getElementById("lista-pedidos");

const modalConfirmacao = document.getElementById("modal-confirmacao");

const tituloConfirmacao = document.getElementById("titulo-confirmacao");

const textoConfirmacao = document.getElementById("texto-confirmacao");

const btnFecharConfirmacao = document.getElementById("btn-fechar-confirmacao");

const btnCancelarConfirmacao = document.getElementById(
  "btn-cancelar-confirmacao",
);

const btnConfirmarConfirmacao = document.getElementById(
  "btn-confirmar-confirmacao",
);

// =========================================================
// ESTADO DA INTERFACE
// =========================================================

let categoriaAtual = "Todos";
let indiceCarrossel = 0;
let intervaloCarrossel = null;
let acaoConfirmacao = null;

// =========================================================
// FUNÇÕES AUXILIARES
// =========================================================

function formatarMoeda(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function mostrarMensagem(texto, tipo = "sucesso") {
  mensagem.textContent = texto;

  mensagem.className = `mensagem ${tipo} visivel`;

  setTimeout(() => {
    mensagem.className = "mensagem";
  }, 3000);
}

// =========================================================
// CONFIRMAÇÃO DE AÇÕES
// =========================================================

function abrirConfirmacao(titulo, texto, acao) {
  tituloConfirmacao.textContent = titulo;

  textoConfirmacao.textContent = texto;

  acaoConfirmacao = acao;

  modalConfirmacao.showModal();
}

function fecharConfirmacao() {
  acaoConfirmacao = null;

  modalConfirmacao.close();
}

function executarConfirmacao() {
  if (typeof acaoConfirmacao === "function") {
    const acao = acaoConfirmacao;

    fecharConfirmacao();

    acao();
  }
}

// =========================================================
// PERSISTÊNCIA DO CARRINHO
// =========================================================

function salvarCarrinho() {
  const dados = {
    tipoEntrega: carrinho.tipoEntrega,

    itens: carrinho.itens.map((item) => ({
      produtoId: item.produto.id,

      quantidade: item.quantidade,
    })),
  };

  localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(dados));
}

function carregarCarrinho() {
  const dadosSalvos = localStorage.getItem(CHAVE_CARRINHO);

  if (!dadosSalvos) {
    return;
  }

  try {
    const dados = JSON.parse(dadosSalvos);

    if (dados.tipoEntrega) {
      carrinho.tipoEntrega = dados.tipoEntrega;
    }

    if (!Array.isArray(dados.itens)) {
      return;
    }

    dados.itens.forEach((itemSalvo) => {
      const produto = gerenciador.buscarProdutoPorId(itemSalvo.produtoId);

      if (!produto) {
        return;
      }

      const quantidade = Number(itemSalvo.quantidade);

      if (!Number.isInteger(quantidade) || quantidade <= 0) {
        return;
      }

      let contador = 0;

      while (contador < quantidade) {
        carrinho.adicionar(produto);

        contador++;
      }
    });
  } catch (erro) {
    console.error("Erro ao carregar o carrinho:", erro);

    localStorage.removeItem(CHAVE_CARRINHO);
  }
}

// =========================================================
// CADASTRAR PRODUTOS INICIAIS
// =========================================================

function carregarProdutosIniciais() {
  const produtos =
    gerenciador.listarProdutos();

  if (produtos.length > 0) {
    return;
  }

  const produtosIniciais =
    criarProdutosIniciais();

  produtosIniciais.forEach(
    (produto) => {
      gerenciador.adicionarProduto(
        produto,
      );
    },
  );
}

// =========================================================
// RENDERIZAR CARDÁPIO
// =========================================================

function renderizarProdutos() {
  const produtos = gerenciador.listarProdutos();

  let produtosParaMostrar = produtos;

  if (categoriaAtual !== "Todos") {
    produtosParaMostrar = produtos.filter(
      (produto) => produto.categoria === categoriaAtual,
    );
  }

  listaProdutos.innerHTML = "";

  if (produtosParaMostrar.length === 0) {
    listaProdutos.innerHTML = `
            <div class="estado-vazio">

                <h3>
                    Nenhum produto encontrado
                </h3>

                <p>
                    Não existem produtos nesta categoria.
                </p>

            </div>
        `;

    return;
  }

  produtosParaMostrar.forEach((produto) => {
    const card = document.createElement("article");

    card.className = "card-produto";

    card.innerHTML = `

                <div class="card-produto-imagem">

                    <img
                        src="${produto.imagem}"
                        alt="${produto.nome}"
                        loading="lazy"
                    >

                </div>


                <div class="card-produto-conteudo">

                    <span class="card-produto-categoria">
                        ${produto.categoria}
                    </span>


                    <h3>
                        ${produto.nome}
                    </h3>


                    <p>
                        ${produto.descricao}
                    </p>


                    <div class="card-produto-preco">
                        ${formatarMoeda(produto.preco)}
                    </div>


                    <button
                        class="btn btn-principal"
                        type="button"
                        data-produto-id="${produto.id}"
                        aria-label="Adicionar ${produto.nome} ao carrinho"
                    >
                        Adicionar ao carrinho
                    </button>

                </div>

            `;

    const botao = card.querySelector("[data-produto-id]");

    botao.addEventListener("click", () => {
      adicionarAoCarrinho(produto.id);
    });

    listaProdutos.appendChild(card);
  });
}

// =========================================================
// FILTROS DE CATEGORIA
// =========================================================

function renderizarFiltros() {
  const produtos = gerenciador.listarProdutos();

  const categorias = [
    "Todos",
    ...new Set(produtos.map((produto) => produto.categoria)),
  ];

  filtrosCategoria.innerHTML = "";

  categorias.forEach((categoria) => {
    const botao = document.createElement("button");

    botao.type = "button";

    botao.className = "btn-filtro";

    const filtroAtivo =
      categoria === categoriaAtual;

    if (filtroAtivo) {
      botao.classList.add("ativo");
    }

    botao.setAttribute(
      "aria-pressed",
      String(filtroAtivo),
    );

    botao.setAttribute(
      "aria-label",
      `Filtrar cardápio por ${categoria}`,
    );

    botao.textContent = categoria;

    botao.addEventListener("click", () => {
      categoriaAtual = categoria;

      renderizarFiltros();

      renderizarProdutos();
    });

    filtrosCategoria.appendChild(botao);
  });
}

// =========================================================
// CARRINHO
// =========================================================

function adicionarAoCarrinho(idProduto) {
  const produto = gerenciador.buscarProdutoPorId(idProduto);

  if (!produto) {
    mostrarMensagem("Produto não encontrado.", "erro");

    return;
  }

  try {
    carrinho.adicionar(produto);

    salvarCarrinho();

    renderizarCarrinho();

    mostrarMensagem(`${produto.nome} foi adicionado ao carrinho.`);
  } catch (erro) {
    console.error(erro);

    mostrarMensagem("Não foi possível adicionar o produto.", "erro");
  }
}

// =========================================================
// MOSTRAR CARRINHO
// =========================================================

function renderizarCarrinho() {
  const itens = carrinho.itens;

  listaCarrinho.innerHTML = "";

  if (itens.length === 0) {
    listaCarrinho.innerHTML = `

            <div class="estado-vazio">

                <h3>
                    Seu carrinho está vazio
                </h3>

                <p>
                    Adicione produtos do cardápio
                    para começar seu pedido.
                </p>

            </div>

        `;
  }

  itens.forEach((item) => {
    const produto = item.produto;

    const elemento = document.createElement("article");

    elemento.className = "item-carrinho";

    elemento.innerHTML = `

                <div class="item-carrinho-imagem">

                    <img
                        src="${produto.imagem}"
                        alt="${produto.nome}"
                    >

                </div>


                <div class="item-carrinho-info">

                    <h3>
                        ${produto.nome}
                    </h3>

                    <p>
                        ${formatarMoeda(produto.preco)}
                        por unidade
                    </p>

                </div>


                <div class="controles-quantidade">

                    <button
                        class="btn-quantidade"
                        type="button"
                        data-diminuir="${produto.id}"
                        aria-label="Diminuir quantidade de ${produto.nome}"
                    >
                        −
                    </button>


                    <span class="quantidade">
                        ${item.quantidade}
                    </span>


                    <button
                        class="btn-quantidade"
                        type="button"
                        data-aumentar="${produto.id}"
                        aria-label="Aumentar quantidade de ${produto.nome}"
                    >
                        +
                    </button>

                </div>


                <div class="item-carrinho-subtotal">

                    ${formatarMoeda(item.subtotal)}

                </div>


                <button
                    class="btn-remover"
                    type="button"
                    data-remover="${produto.id}"
                    aria-label="Remover ${produto.nome} do carrinho"
                >
                    Remover
                </button>

            `;

    const btnDiminuir = elemento.querySelector("[data-diminuir]");

    const btnAumentar = elemento.querySelector("[data-aumentar]");

    const btnRemover = elemento.querySelector("[data-remover]");

    btnDiminuir.addEventListener("click", () => {
      carrinho.alterarQuantidade(produto.id, -1);

      salvarCarrinho();

      renderizarCarrinho();
    });

    btnAumentar.addEventListener("click", () => {
      carrinho.alterarQuantidade(produto.id, 1);

      salvarCarrinho();

      renderizarCarrinho();
    });

    btnRemover.addEventListener("click", () => {
      abrirConfirmacao(
        "Remover item",
        `Deseja remover "${produto.nome}" do carrinho?`,
        () => {
          carrinho.remover(produto.id);

          salvarCarrinho();

          renderizarCarrinho();

          mostrarMensagem(`${produto.nome} removido do carrinho.`);
        },
      );
    });

    listaCarrinho.appendChild(elemento);
  });

  resumoCarrinho.innerHTML = `

        <div class="resumo-linha">

            <span>
                Subtotal
            </span>

            <strong>
                ${formatarMoeda(carrinho.subtotal)}
            </strong>

        </div>


        <div class="resumo-linha">

            <span>
                Taxa de entrega
            </span>

            <strong>
                ${formatarMoeda(carrinho.taxa)}
            </strong>

        </div>


        <div class="resumo-linha resumo-total">

            <span>
                Total
            </span>

            <strong>
                ${formatarMoeda(carrinho.total)}
            </strong>

        </div>

    `;

  const quantidadeTotal = itens.reduce(
    (total, item) => total + item.quantidade,
    0,
  );

  contadorCarrinho.textContent = quantidadeTotal;
}

// =========================================================
// LIMPAR CARRINHO
// =========================================================

function limparCarrinho() {
  if (carrinho.itens.length === 0) {
    mostrarMensagem("O carrinho já está vazio.", "aviso");

    return;
  }

  abrirConfirmacao(
    "Limpar carrinho",
    "Deseja realmente remover todos os itens do carrinho?",
    () => {
      carrinho.limpar();

      salvarCarrinho();

      renderizarCarrinho();

      mostrarMensagem("Carrinho limpo com sucesso.");
    },
  );
}

// =========================================================
// TIPO DE ENTREGA
// =========================================================

function configurarTipoEntrega() {
  const opcoes = document.querySelectorAll('input[name="tipo-entrega"]');

  opcoes.forEach((opcao) => {
    opcao.checked = opcao.value === carrinho.tipoEntrega;

    opcao.addEventListener("change", () => {
      carrinho.tipoEntrega = opcao.value;

      salvarCarrinho();

      renderizarCarrinho();
    });
  });
}

// =========================================================
// RESUMO DO CHECKOUT
// =========================================================

function renderizarResumoCheckout() {
  resumoCheckout.innerHTML = "";

  carrinho.itens.forEach((item) => {
    const linha = document.createElement("div");

    linha.className = "resumo-checkout-item";

    linha.innerHTML = `
                <span>
                    ${item.produto.nome}
                    × ${item.quantidade}
                </span>

                <strong>
                    ${formatarMoeda(item.subtotal)}
                </strong>
            `;

    resumoCheckout.appendChild(linha);
  });

  const linhaTaxa = document.createElement("div");

  linhaTaxa.className = "resumo-checkout-item";

  linhaTaxa.innerHTML = `
        <span>
            Taxa de entrega
        </span>

        <strong>
            ${formatarMoeda(carrinho.taxa)}
        </strong>
    `;

  resumoCheckout.appendChild(linhaTaxa);

  const linhaTotal = document.createElement("div");

  linhaTotal.className = "resumo-checkout-total";

  linhaTotal.innerHTML = `
        <span>
            Total
        </span>

        <strong>
            ${formatarMoeda(carrinho.total)}
        </strong>
    `;

  resumoCheckout.appendChild(linhaTotal);
}

// =========================================================
// ABRIR CHECKOUT
// =========================================================

function abrirCheckout() {
  if (!usuarioAtual) {
    mostrarMensagem(
      "Faça login para realizar um pedido.",
      "erro",
    );

    window.location.replace(
      "./login.html",
    );

    return;
  }

  if (carrinho.itens.length === 0) {
    mostrarMensagem(
      "Adicione pelo menos um produto antes de finalizar.",
      "aviso",
    );

    return;
  }

  campoNomeCliente.value =
    usuarioAtual.nome;

  campoNomeCliente.readOnly = true;

  renderizarResumoCheckout();

  modalCheckout.showModal();

  campoNomeCliente.focus();
}

// =========================================================
// FECHAR CHECKOUT
// =========================================================

function fecharCheckout() {
  formCheckout.reset();

  modalCheckout.close();
}

// =========================================================
// CRIAR O PEDIDO
// =========================================================

function finalizarPedido(evento) {
  evento.preventDefault();

  if (!usuarioAtual) {
    mostrarMensagem(
      "Sua sessão expirou. Faça login novamente.",
      "erro",
    );

    fecharCheckout();

    window.location.replace(
      "./login.html",
    );

    return;
  }

  if (carrinho.itens.length === 0) {
    mostrarMensagem(
      "O carrinho está vazio.",
      "aviso",
    );

    fecharCheckout();

    return;
  }

  try {
    const pedido = new Pedido(
      usuarioAtual.nome,
      carrinho.itens,
      carrinho.tipoEntrega,
      carrinho.total,
      usuarioAtual.id,
    );

    gerenciador.adicionarPedido(
      pedido,
    );

    carrinho.limpar();

    salvarCarrinho();

    renderizarCarrinho();

    renderizarPedidos();

    fecharCheckout();

    mostrarMensagem(
      `Pedido #${pedido.id} realizado com sucesso!`,
    );

    document
      .getElementById("pedidos")
      .scrollIntoView({
        behavior: "smooth",
      });

  } catch (erro) {
    console.error(erro);

    mostrarMensagem(
      erro.message ||
        "Não foi possível finalizar o pedido.",
      "erro",
    );
  }
}

// =========================================================
// MEUS PEDIDOS
// =========================================================

function renderizarPedidos() {
  if (!usuarioAtual) {
    return;
  }

  const pedidos =
    gerenciador.listarPedidos(
      usuarioAtual.id,
    );

  listaPedidos.innerHTML = "";

  if (pedidos.length === 0) {
    listaPedidos.innerHTML = `
      <div class="estado-vazio">

        <h3>
          Você ainda não possui pedidos
        </h3>

        <p>
          Seus pedidos finalizados
          aparecerão aqui.
        </p>

      </div>
    `;

    return;
  }

  pedidos
    .slice()
    .reverse()
    .forEach((pedido) => {
      const card =
        document.createElement(
          "article",
        );

      card.className =
        "card-pedido";

      const itensHtml =
        pedido.itens
          .map(
            (item) => `
              <li>
                ${item.produto.nome}
                × ${item.quantidade}
              </li>
            `,
          )
          .join("");

      let tipoEntregaTexto =
        "Retirada";

      if (
        pedido.tipoEntrega ===
        "local"
      ) {
        tipoEntregaTexto =
          "Consumo no local";
      }

      if (
        pedido.tipoEntrega ===
        "entrega"
      ) {
        tipoEntregaTexto =
          "Delivery";
      }

      let classeStatus =
        "status-realizado";

      if (
        pedido.status ===
        "Em preparo"
      ) {
        classeStatus =
          "status-preparo";
      }

      if (
        pedido.status ===
        "Pronto"
      ) {
        classeStatus =
          "status-pronto";
      }

      if (
        pedido.status ===
        "Entregue"
      ) {
        classeStatus =
          "status-entregue";
      }

      if (
        pedido.status ===
        "Cancelado"
      ) {
        classeStatus =
          "status-cancelado";
      }

      card.innerHTML = `
        <div
          class="card-pedido-cabecalho"
        >

          <div>

            <span class="subtitulo">
              Pedido #${pedido.id}
            </span>

            <h3>
              ${pedido.cliente}
            </h3>

            <span
              class="card-pedido-data"
            >
              ${pedido.data}
            </span>

          </div>

          <span
            class="status-pedido ${classeStatus}"
          >
            ${pedido.status}
          </span>

        </div>

        <p>
          <strong>
            Recebimento:
          </strong>

          ${tipoEntregaTexto}
        </p>

        <div>
          <strong>
            Itens:
          </strong>

          <ul>
            ${itensHtml}
          </ul>
        </div>

        <div
          class="resumo-linha resumo-total"
        >

          <span>
            Total
          </span>

          <strong>
            ${formatarMoeda(
              pedido.total,
            )}
          </strong>

        </div>
      `;

      listaPedidos.appendChild(
        card,
      );
    });
}

// =========================================================
// CARROSSEL
// =========================================================

function renderizarCarrossel() {
  const produtos = gerenciador.listarProdutos();

  if (produtos.length === 0) {
    return;
  }

  if (indiceCarrossel >= produtos.length) {
    indiceCarrossel = 0;
  }

  const produto = produtos[indiceCarrossel];

  slideCarrossel.innerHTML = `

        <div class="slide-conteudo">

            <img
                src="${produto.imagem}"
                alt="${produto.nome}"
            >


            <div class="slide-overlay">

                <span class="card-produto-categoria">
                    ${produto.categoria}
                </span>


                <h3>
                    ${produto.nome}
                </h3>


                <p>
                    ${produto.descricao}
                </p>


                <div class="slide-preco">

                    ${formatarMoeda(produto.preco)}

                </div>

                <button
                    class="btn btn-principal btn-slide-adicionar"
                    type="button"
                    data-slide-adicionar="${produto.id}"
                    aria-label="Adicionar ${produto.nome} ao carrinho"
                >
                    Adicionar ao carrinho
                </button>

            </div>

        </div>

    `;

  const btnAdicionarSlide = slideCarrossel.querySelector(
    "[data-slide-adicionar]",
  );

  btnAdicionarSlide.addEventListener("click", () => {
    adicionarAoCarrinho(produto.id);
  });

  indicadoresCarrossel.innerHTML = "";

  produtos.forEach((produtoAtual, indice) => {
    const indicador = document.createElement("button");

    indicador.type = "button";

    indicador.className = "indicador";

    if (indice === indiceCarrossel) {
      indicador.classList.add("ativo");

      indicador.setAttribute("aria-current", "true");
    } else {
      indicador.setAttribute("aria-current", "false");
    }

    indicador.setAttribute("aria-label", `Mostrar ${produtoAtual.nome}`);

    indicador.addEventListener("click", () => {
      indiceCarrossel = indice;

      renderizarCarrossel();
    });

    indicadoresCarrossel.appendChild(indicador);
  });
}

function proximoSlide() {
  const produtos = gerenciador.listarProdutos();

  if (produtos.length === 0) {
    return;
  }

  indiceCarrossel = (indiceCarrossel + 1) % produtos.length;

  renderizarCarrossel();
}

function slideAnterior() {
  const produtos = gerenciador.listarProdutos();

  if (produtos.length === 0) {
    return;
  }

  indiceCarrossel--;

  if (indiceCarrossel < 0) {
    indiceCarrossel = produtos.length - 1;
  }

  renderizarCarrossel();
}

function iniciarAvancoAutomatico() {
  clearInterval(intervaloCarrossel);

  const reduzirMovimento = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (reduzirMovimento) {
    return;
  }

  intervaloCarrossel = setInterval(proximoSlide, 5000);
}

function pausarAvancoAutomatico() {
  clearInterval(intervaloCarrossel);

  intervaloCarrossel = null;
}

// =========================================================
// EVENTOS
// =========================================================

btnAnterior.addEventListener("click", slideAnterior);

btnProximo.addEventListener("click", proximoSlide);

btnLimparCarrinho.addEventListener("click", limparCarrinho);

btnFinalizar.addEventListener("click", abrirCheckout);

formCheckout.addEventListener("submit", finalizarPedido);

btnFecharCheckout.addEventListener("click", fecharCheckout);

btnCancelarCheckout.addEventListener("click", fecharCheckout);

btnFecharConfirmacao.addEventListener("click", fecharConfirmacao);

btnCancelarConfirmacao.addEventListener("click", fecharConfirmacao);

btnConfirmarConfirmacao.addEventListener("click", executarConfirmacao);

modalConfirmacao.addEventListener("cancel", () => {
  acaoConfirmacao = null;
});

carrossel.addEventListener("mouseenter", pausarAvancoAutomatico);

carrossel.addEventListener("mouseleave", iniciarAvancoAutomatico);

carrossel.addEventListener("focusin", pausarAvancoAutomatico);

carrossel.addEventListener("focusout", (evento) => {
  if (!carrossel.contains(evento.relatedTarget)) {
    iniciarAvancoAutomatico();
  }
});

// =========================================================
// INICIALIZAÇÃO
// =========================================================

function iniciarAplicacao() {
  carregarProdutosIniciais();
  carregarCarrinho();
  configurarTipoEntrega();
  renderizarFiltros();
  renderizarProdutos();
  renderizarCarrossel();
  renderizarCarrinho();
  renderizarPedidos();
  iniciarAvancoAutomatico();
}

iniciarAplicacao();
