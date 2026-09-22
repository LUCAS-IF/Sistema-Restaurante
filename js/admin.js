import {
    exigirPerfil,
    configurarInterfaceAutenticada,
} from "./auth.js";

import { Produto } from "./models/Produto.js";
import { Gerenciador } from "./Gerenciador.js";
import { criarProdutosIniciais } from "./dadosIniciais.js";

// =========================================================
// CONTROLE DE ACESSO
// =========================================================

const usuarioAtual =
    exigirPerfil("admin");

configurarInterfaceAutenticada(
    "usuario-logado",
    "btn-sair",
);

// =========================================================
// GERENCIADOR
// =========================================================

const gerenciador = new Gerenciador();

// =========================================================
// ELEMENTOS
// =========================================================

const btnNovoProduto = document.getElementById("btn-novo-produto");

const formularioContainer = document.getElementById("formulario-produto");

const formulario = document.getElementById("form-produto");

const listaAdministracao = document.getElementById("lista-administracao");

const mensagem = document.getElementById("mensagem");

const btnCancelar = document.getElementById("btn-cancelar-produto");

const campoId = document.getElementById("produto-id");

const campoNome = document.getElementById("produto-nome");

const campoDescricao = document.getElementById("produto-descricao");

const campoPreco = document.getElementById("produto-preco");

const campoCategoria = document.getElementById("produto-categoria");

const campoImagem = document.getElementById("produto-imagem");

const textoFormulario = document.getElementById("texto-formulario");

const tituloFormulario = document.getElementById("titulo-formulario");

const listaPedidosAdministracao = document.getElementById(
    "lista-pedidos-administracao",
);

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
// MENSAGENS
// =========================================================

let temporizadorMensagem = null;

function mostrarMensagem(texto, tipo = "sucesso") {
    clearTimeout(temporizadorMensagem);

    mensagem.textContent = texto;

    mensagem.className = `mensagem ${tipo} visivel`;

    temporizadorMensagem = setTimeout(() => {
        mensagem.className = "mensagem";
    }, 3500);
}

let acaoConfirmacao = null;

// =========================================================
// CONFIRMAÇÃO
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
// PRODUTOS INICIAIS
// =========================================================

function inicializarProdutos() {
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
// FORMULÁRIO
// =========================================================

function abrirFormularioNovo() {
    formulario.reset();

    campoId.value = "";

    textoFormulario.textContent = "Novo produto";

    tituloFormulario.textContent = "Cadastrar produto";

    formularioContainer.hidden = false;

    campoNome.focus();
}

function abrirFormularioEdicao(produto) {
    campoId.value = produto.id;

    campoNome.value = produto.nome;

    campoDescricao.value = produto.descricao;

    campoPreco.value = produto.preco;

    campoCategoria.value = produto.categoria;

    campoImagem.value = produto.imagem.replace("../", "");

    textoFormulario.textContent = "Editar produto";

    tituloFormulario.textContent = "Alterar dados do produto";

    formularioContainer.hidden = false;

    campoNome.focus();

    formularioContainer.scrollIntoView({
        behavior: "smooth",
        block: "center",
    });
}

function fecharFormulario() {
    formulario.reset();

    campoId.value = "";

    formularioContainer.hidden = true;
}

// =========================================================
// SALVAR
// =========================================================

function salvarProduto(evento) {
    evento.preventDefault();

    const nome = campoNome.value.trim();

    const descricao = campoDescricao.value.trim();

    const preco = Number(campoPreco.value);

    const categoria = campoCategoria.value.trim();

    let imagem = campoImagem.value.trim();

    if (!nome) {
        mostrarMensagem("Informe o nome do produto.", "erro");

        campoNome.focus();

        return;
    }

    if (!descricao) {
        mostrarMensagem("Informe a descrição do produto.", "erro");

        campoDescricao.focus();

        return;
    }

    if (!Number.isFinite(preco) || preco <= 0) {
        mostrarMensagem("Informe um preço maior que zero.", "erro");

        campoPreco.focus();

        return;
    }

    if (!categoria) {
        mostrarMensagem("Informe a categoria do produto.", "erro");

        campoCategoria.focus();

        return;
    }

    if (!imagem) {
        mostrarMensagem("Informe o caminho da imagem.", "erro");

        campoImagem.focus();

        return;
    }

    /*
            Como o formulário está dentro de html/,
            o caminho visual precisa começar em ../
            quando usado pelo navegador.
    
            O usuário pode informar:
            img/pizza.jpg
    
            ou:
            ../img/pizza.jpg
        */

    if (!imagem.startsWith("../")) {
        imagem = `../${imagem}`;
    }

    const id = campoId.value;

    try {
        if (id) {
            gerenciador.atualizarProduto(id, {
                nome,
                descricao,
                preco,
                categoria,
                imagem,
            });

            mostrarMensagem("Produto atualizado.");
        } else {
            const produtos = gerenciador.listarProdutos();

            let novoId = 1;

            if (produtos.length > 0) {
                novoId = Math.max(...produtos.map((produto) => produto.id)) + 1;
            }

            const produto = new Produto(
                novoId,
                nome,
                descricao,
                preco,
                categoria,
                imagem,
            );

            gerenciador.adicionarProduto(produto);

            mostrarMensagem("Produto cadastrado.");
        }

        fecharFormulario();

        renderizarProdutos();
    } catch (erro) {
        console.error(erro);

        mostrarMensagem(
            erro.message || "Não foi possível salvar o produto.",
            "erro",
        );
    }
}

// =========================================================
// EXCLUIR
// =========================================================

function excluirProduto(id) {
    const produto = gerenciador.buscarProdutoPorId(id);

    if (!produto) {
        mostrarMensagem("Produto não encontrado.", "erro");

        return;
    }

    abrirConfirmacao(
        "Excluir produto",
        `Deseja realmente excluir "${produto.nome}"?`,
        () => {
            try {
                gerenciador.removerProduto(id);

                fecharFormulario();

                renderizarProdutos();

                mostrarMensagem("Produto excluído com sucesso.");
            } catch (erro) {
                console.error(erro);

                mostrarMensagem(
                    erro.message || "Não foi possível excluir o produto.",
                    "erro",
                );
            }
        },
    );
}

// =========================================================
// LISTA
// =========================================================

function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function renderizarProdutos() {
    const produtos = gerenciador.listarProdutos();

    listaAdministracao.innerHTML = "";

    if (produtos.length === 0) {
        listaAdministracao.innerHTML = `
            <div class="estado-vazio">

                <h3>
                    Nenhum produto cadastrado
                </h3>

                <p>
                    Cadastre o primeiro produto
                    usando o botão acima.
                </p>

            </div>
        `;

        return;
    }

    produtos.forEach((produto) => {
        const item = document.createElement("article");

        item.className = "item-administracao";

        item.innerHTML = `
                <div
                    class="item-administracao-imagem"
                >

                    <img
                        src="${produto.imagem}"
                        alt="${produto.nome}"
                        loading="lazy"
                    >

                </div>


                <div
                    class="item-administracao-info"
                >

                    <h3>
                        ${produto.nome}
                    </h3>

                    <p>
                        ${produto.categoria}
                    </p>

                </div>


                <div
                    class="item-administracao-preco"
                >
                    ${formatarMoeda(produto.preco)}
                </div>


                <div
                    class="acoes-administracao"
                >

                    <button
                        class="btn-editar"
                        type="button"
                        data-editar="${produto.id}"
                    >
                        Editar
                    </button>


                    <button
                        class="btn-excluir"
                        type="button"
                        data-excluir="${produto.id}"
                    >
                        Excluir
                    </button>

                </div>
            `;

        const btnEditar = item.querySelector("[data-editar]");

        const btnExcluir = item.querySelector("[data-excluir]");

        btnEditar.addEventListener("click", () => {
            abrirFormularioEdicao(produto);
        });

        btnExcluir.addEventListener("click", () => {
            excluirProduto(produto.id);
        });

        listaAdministracao.appendChild(item);
    });
}

// =========================================================
// PEDIDOS
// =========================================================

function renderizarPedidos() {
    const pedidos = gerenciador.listarPedidos();

    listaPedidosAdministracao.innerHTML = "";

    if (pedidos.length === 0) {
        listaPedidosAdministracao.innerHTML = `
            <div class="estado-vazio">

                <h3>
                    Nenhum pedido registrado
                </h3>

                <p>
                    Os pedidos realizados pelos clientes
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
            const card = document.createElement("article");

            card.className = "card-pedido";

            const itensHtml = pedido.itens
                .map(
                    (item) => `
                                <li>
                                    ${item.produto.nome}
                                    × ${item.quantidade}
                                </li>
                            `,
                )
                .join("");

            let tipoEntregaTexto = "Retirada";

            if (pedido.tipoEntrega === "local") {
                tipoEntregaTexto = "Consumo no local";
            } else if (pedido.tipoEntrega === "entrega") {
                tipoEntregaTexto = "Delivery";
            }

            card.innerHTML = `
                    <div class="card-pedido-cabecalho">

                        <div>

                            <span class="subtitulo">
                                Pedido #${pedido.id}
                            </span>

                            <h3>
                                ${pedido.cliente}
                            </h3>

                            <span class="card-pedido-data">
                                ${pedido.data}
                            </span>

                        </div>

                        <span class="status-pedido">
                            ${pedido.status}
                        </span>

                    </div>

                    <p>
                        <strong>
                            Recebimento:
                        </strong>

                        ${tipoEntregaTexto}
                    </p>

                    <div class="pedido-itens-admin">

                        <strong>
                            Itens:
                        </strong>

                        <ul>
                            ${itensHtml}
                        </ul>

                    </div>

                    <div class="resumo-linha">

                        <span>
                            Total
                        </span>

                        <strong>
                            ${formatarMoeda(pedido.total)}
                        </strong>

                    </div>

                    <div class="acoes-administracao">

                        <label>
                            <span class="sr-only">
                                Status do pedido
                            </span>

                            <select
                                class="select-status"
                                data-status="${pedido.id}"
                            >

                                <option
                                    value="Realizado"
                                    ${pedido.status === "Realizado" ? "selected" : ""}
                                >
                                    Realizado
                                </option>

                                <option
                                    value="Em preparo"
                                    ${pedido.status === "Em preparo" ? "selected" : ""}
                                >
                                    Em preparo
                                </option>

                                <option
                                    value="Pronto"
                                    ${pedido.status === "Pronto" ? "selected" : ""}
                                >
                                    Pronto
                                </option>

                                <option
                                    value="Entregue"
                                    ${pedido.status === "Entregue" ? "selected" : ""}
                                >
                                    Entregue
                                </option>

                                <option
                                    value="Cancelado"
                                    ${pedido.status === "Cancelado" ? "selected" : ""}
                                >
                                    Cancelado
                                </option>

                            </select>

                        </label>

                        <button
                            class="btn-excluir"
                            type="button"
                            data-excluir-pedido="${pedido.id}"
                        >
                            Excluir pedido
                        </button>

                    </div>
                `;

            const selectStatus = card.querySelector("[data-status]");

            selectStatus.addEventListener("change", () => {
                alterarStatusPedido(pedido.id, selectStatus.value);
            });

            const btnExcluir = card.querySelector("[data-excluir-pedido]");

            btnExcluir.addEventListener("click", () => {
                excluirPedido(pedido.id);
            });

            listaPedidosAdministracao.appendChild(card);
        });
}

function alterarStatusPedido(id, novoStatus) {
    try {
        gerenciador.atualizarStatusPedido(id, novoStatus);

        renderizarPedidos();

        mostrarMensagem("Status do pedido atualizado.");
    } catch (erro) {
        console.error(erro);

        mostrarMensagem(
            erro.message || "Não foi possível atualizar o pedido.",
            "erro",
        );
    }
}

function excluirPedido(id) {
    const pedido = gerenciador.buscarPedidoPorId(id);

    if (!pedido) {
        mostrarMensagem("Pedido não encontrado.", "erro");

        return;
    }

    abrirConfirmacao(
        "Excluir pedido",
        `Deseja realmente excluir o pedido #${pedido.id}?`,
        () => {
            try {
                gerenciador.removerPedido(id);

                renderizarPedidos();

                mostrarMensagem("Pedido excluído com sucesso.");
            } catch (erro) {
                console.error(erro);

                mostrarMensagem(
                    erro.message || "Não foi possível excluir o pedido.",
                    "erro",
                );
            }
        },
    );
}

// =========================================================
// EVENTOS
// =========================================================

btnNovoProduto.addEventListener("click", abrirFormularioNovo);

btnCancelar.addEventListener("click", fecharFormulario);

formulario.addEventListener("submit", salvarProduto);

btnFecharConfirmacao.addEventListener("click", fecharConfirmacao);

btnCancelarConfirmacao.addEventListener("click", fecharConfirmacao);

btnConfirmarConfirmacao.addEventListener("click", executarConfirmacao);

modalConfirmacao.addEventListener("cancel", () => {
    acaoConfirmacao = null;
});

// =========================================================
// INICIALIZAÇÃO
// =========================================================

inicializarProdutos();

renderizarProdutos();

renderizarPedidos();
