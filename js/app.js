import { Produto } from "./models/Produto.js";
import { Carrinho } from "./models/Carrinho.js";
import { Gerenciador } from "./Gerenciador.js";


// =========================================================
// OBJETOS PRINCIPAIS
// =========================================================

const gerenciador = new Gerenciador();

const carrinho = new Carrinho();


// =========================================================
// ELEMENTOS DA PÁGINA
// =========================================================

const listaProdutos =
    document.getElementById("lista-produtos");

const filtrosCategoria =
    document.getElementById("filtros-categoria");

const listaCarrinho =
    document.getElementById("lista-carrinho");

const resumoCarrinho =
    document.getElementById("resumo-carrinho");

const contadorCarrinho =
    document.getElementById("contador-carrinho");

const mensagem =
    document.getElementById("mensagem");

const slideCarrossel =
    document.getElementById("slide-carrossel");

const indicadoresCarrossel =
    document.getElementById("indicadores-carrossel");

const btnAnterior =
    document.getElementById("btn-anterior");

const btnProximo =
    document.getElementById("btn-proximo");

const btnLimparCarrinho =
    document.getElementById("btn-limpar-carrinho");


// =========================================================
// ESTADO DA INTERFACE
// =========================================================

let categoriaAtual = "Todos";

let indiceCarrossel = 0;


// =========================================================
// PRODUTOS INICIAIS
// =========================================================

const produtosIniciais = [

    new Produto(
        1,
        "Hambúrguer Artesanal",
        "Hambúrguer artesanal com queijo, alface e tomate.",
        29.90,
        "Lanches",
        "../img/hamburguer.jpg"
    ),

    new Produto(
        2,
        "Pizza Especial",
        "Pizza preparada com ingredientes selecionados.",
        35.00,
        "Pizzas",
        "../img/pizza.jpg"
    ),

    new Produto(
        3,
        "Macarrão à Bolonhesa",
        "Massa artesanal com molho de tomate e carne.",
        32.90,
        "Massas",
        "../img/macarrao_bolonhesa.jpg"
    ),

    new Produto(
        4,
        "Peixe Assado",
        "Peixe assado acompanhado de legumes frescos.",
        42.90,
        "Pratos Principais",
        "../img/peixe_assado.jpg"
    ),

    new Produto(
        5,
        "Beef Wellington",
        "Carne preparada com massa crocante e recheio especial.",
        59.90,
        "Carnes",
        "../img/beef_wellington.jpg"
    ),

    new Produto(
        6,
        "Salada de Frango",
        "Salada fresca com frango grelhado e vegetais.",
        25.90,
        "Saladas",
        "../img/salada_de_frango.jpg"
    ),

    new Produto(
        7,
        "Pudim Individual",
        "Pudim cremoso servido em porção individual.",
        12.90,
        "Sobremesas",
        "../img/pudim_individual.jpg"
    ),

    new Produto(
        8,
        "Sorvete de Frutas Vermelhas",
        "Sorvete cremoso com calda de frutas vermelhas.",
        14.90,
        "Sobremesas",
        "../img/sorvete_frutas_vermelhas.jpg"
    )

];


// =========================================================
// FUNÇÕES AUXILIARES
// =========================================================

function formatarMoeda(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}


function mostrarMensagem(
    texto,
    tipo = "sucesso"
) {

    mensagem.textContent = texto;

    mensagem.className =
        `mensagem ${tipo} visivel`;

    setTimeout(
        () => {

            mensagem.className =
                "mensagem";

        },
        3000
    );
}


// =========================================================
// CADASTRAR PRODUTOS INICIAIS
// =========================================================

function carregarProdutosIniciais() {

    const produtosExistentes =
        gerenciador.listarProdutos();


    if (produtosExistentes.length > 0) {
        return;
    }


    produtosIniciais.forEach(
        (produto) => {

            gerenciador.adicionarProduto(
                produto
            );

        }
    );

}


// =========================================================
// RENDERIZAR CARDÁPIO
// =========================================================

function renderizarProdutos() {

    const produtos =
        gerenciador.listarProdutos();


    let produtosParaMostrar =
        produtos;


    if (categoriaAtual !== "Todos") {

        produtosParaMostrar =
            produtos.filter(
                (produto) =>
                    produto.categoria ===
                    categoriaAtual
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


    produtosParaMostrar.forEach(
        (produto) => {

            const card =
                document.createElement("article");


            card.className =
                "card-produto";


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
                    >
                        Adicionar ao carrinho
                    </button>

                </div>

            `;


            const botao =
                card.querySelector(
                    "[data-produto-id]"
                );


            botao.addEventListener(
                "click",
                () => {

                    adicionarAoCarrinho(
                        produto.id
                    );

                }
            );


            listaProdutos.appendChild(card);

        }
    );

}


// =========================================================
// FILTROS DE CATEGORIA
// =========================================================

function renderizarFiltros() {

    const produtos =
        gerenciador.listarProdutos();


    const categorias = [
        "Todos",
        ...new Set(
            produtos.map(
                (produto) =>
                    produto.categoria
            )
        )
    ];


    filtrosCategoria.innerHTML = "";


    categorias.forEach(
        (categoria) => {

            const botao =
                document.createElement("button");


            botao.type = "button";

            botao.className =
                "btn-filtro";


            if (
                categoria === categoriaAtual
            ) {

                botao.classList.add(
                    "ativo"
                );

            }


            botao.textContent =
                categoria;


            botao.addEventListener(
                "click",
                () => {

                    categoriaAtual =
                        categoria;

                    renderizarFiltros();

                    renderizarProdutos();

                }
            );


            filtrosCategoria.appendChild(
                botao
            );

        }
    );

}


// =========================================================
// CARRINHO
// =========================================================

function adicionarAoCarrinho(
    idProduto
) {

    const produto =
        gerenciador.buscarProdutoPorId(
            idProduto
        );


    if (!produto) {

        mostrarMensagem(
            "Produto não encontrado.",
            "erro"
        );

        return;
    }


    try {

        carrinho.adicionar(
            produto
        );


        renderizarCarrinho();


        mostrarMensagem(
            `${produto.nome} foi adicionado ao carrinho.`
        );

    } catch (erro) {

        console.error(erro);


        mostrarMensagem(
            "Não foi possível adicionar o produto.",
            "erro"
        );

    }

}


// =========================================================
// MOSTRAR CARRINHO
// =========================================================

function renderizarCarrinho() {

    const itens =
        carrinho.itens;


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


    itens.forEach(
        (item) => {

            const produto =
                item.produto;


            const elemento =
                document.createElement(
                    "article"
                );


            elemento.className =
                "item-carrinho";


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

                    ${formatarMoeda(
                        item.subtotal
                    )}

                </div>


                <button
                    class="btn-remover"
                    type="button"
                    data-remover="${produto.id}"
                >
                    Remover
                </button>

            `;


            const btnDiminuir =
                elemento.querySelector(
                    "[data-diminuir]"
                );


            const btnAumentar =
                elemento.querySelector(
                    "[data-aumentar]"
                );


            const btnRemover =
                elemento.querySelector(
                    "[data-remover]"
                );


            btnDiminuir.addEventListener(
                "click",
                () => {

                    carrinho.alterarQuantidade(
                        produto.id,
                        -1
                    );

                    renderizarCarrinho();

                }
            );


            btnAumentar.addEventListener(
                "click",
                () => {

                    carrinho.alterarQuantidade(
                        produto.id,
                        1
                    );

                    renderizarCarrinho();

                }
            );


            btnRemover.addEventListener(
                "click",
                () => {

                    carrinho.remover(
                        produto.id
                    );

                    renderizarCarrinho();

                    mostrarMensagem(
                        `${produto.nome} removido do carrinho.`
                    );

                }
            );


            listaCarrinho.appendChild(
                elemento
            );

        }
    );


    resumoCarrinho.innerHTML = `

        <div class="resumo-linha">

            <span>
                Subtotal
            </span>

            <strong>
                ${formatarMoeda(
                    carrinho.subtotal
                )}
            </strong>

        </div>


        <div class="resumo-linha">

            <span>
                Taxa de entrega
            </span>

            <strong>
                ${formatarMoeda(
                    carrinho.taxa
                )}
            </strong>

        </div>


        <div class="resumo-linha resumo-total">

            <span>
                Total
            </span>

            <strong>
                ${formatarMoeda(
                    carrinho.total
                )}
            </strong>

        </div>

    `;


    const quantidadeTotal =
        itens.reduce(
            (total, item) =>
                total + item.quantidade,
            0
        );


    contadorCarrinho.textContent =
        quantidadeTotal;

}


// =========================================================
// LIMPAR CARRINHO
// =========================================================

function limparCarrinho() {

    if (carrinho.itens.length === 0) {

        mostrarMensagem(
            "O carrinho já está vazio.",
            "aviso"
        );

        return;
    }


    carrinho.limpar();

    renderizarCarrinho();

    mostrarMensagem(
        "Carrinho limpo com sucesso."
    );

}


// =========================================================
// CARROSSEL
// =========================================================

function renderizarCarrossel() {

    const produtos =
        gerenciador.listarProdutos();


    if (produtos.length === 0) {
        return;
    }


    if (
        indiceCarrossel >= produtos.length
    ) {

        indiceCarrossel = 0;

    }


    const produto =
        produtos[indiceCarrossel];


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

                    ${formatarMoeda(
                        produto.preco
                    )}

                </div>

            </div>

        </div>

    `;


    indicadoresCarrossel.innerHTML = "";


    produtos.forEach(
        (produtoAtual, indice) => {

            const indicador =
                document.createElement(
                    "button"
                );


            indicador.type =
                "button";


            indicador.className =
                "indicador";


            if (
                indice === indiceCarrossel
            ) {

                indicador.classList.add(
                    "ativo"
                );

            }


            indicador.setAttribute(
                "aria-label",
                `Mostrar ${produtoAtual.nome}`
            );


            indicador.addEventListener(
                "click",
                () => {

                    indiceCarrossel =
                        indice;

                    renderizarCarrossel();

                }
            );


            indicadoresCarrossel.appendChild(
                indicador
            );

        }
    );

}


function proximoSlide() {

    const produtos =
        gerenciador.listarProdutos();


    if (produtos.length === 0) {
        return;
    }


    indiceCarrossel =
        (
            indiceCarrossel + 1
        ) %
        produtos.length;


    renderizarCarrossel();

}


function slideAnterior() {

    const produtos =
        gerenciador.listarProdutos();


    if (produtos.length === 0) {
        return;
    }


    indiceCarrossel--;


    if (indiceCarrossel < 0) {

        indiceCarrossel =
            produtos.length - 1;

    }


    renderizarCarrossel();

}


// =========================================================
// EVENTOS
// =========================================================

btnAnterior.addEventListener(
    "click",
    slideAnterior
);


btnProximo.addEventListener(
    "click",
    proximoSlide
);


btnLimparCarrinho.addEventListener(
    "click",
    limparCarrinho
);


// =========================================================
// INICIALIZAÇÃO
// =========================================================

function iniciarAplicacao() {

    carregarProdutosIniciais();

    renderizarFiltros();

    renderizarProdutos();

    renderizarCarrossel();

    renderizarCarrinho();

}


iniciarAplicacao();