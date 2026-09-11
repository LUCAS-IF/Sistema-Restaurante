import { Produto } from "./models/Produto.js";
import { Gerenciador } from "./Gerenciador.js";


// =========================================================
// GERENCIADOR
// =========================================================

const gerenciador =
    new Gerenciador();


// =========================================================
// ELEMENTOS
// =========================================================

const btnNovoProduto =
    document.getElementById(
        "btn-novo-produto"
    );

const formularioContainer =
    document.getElementById(
        "formulario-produto"
    );

const formulario =
    document.getElementById(
        "form-produto"
    );

const listaAdministracao =
    document.getElementById(
        "lista-administracao"
    );

const mensagem =
    document.getElementById(
        "mensagem"
    );

const btnCancelar =
    document.getElementById(
        "btn-cancelar-produto"
    );

const campoId =
    document.getElementById(
        "produto-id"
    );

const campoNome =
    document.getElementById(
        "produto-nome"
    );

const campoDescricao =
    document.getElementById(
        "produto-descricao"
    );

const campoPreco =
    document.getElementById(
        "produto-preco"
    );

const campoCategoria =
    document.getElementById(
        "produto-categoria"
    );

const campoImagem =
    document.getElementById(
        "produto-imagem"
    );

const textoFormulario =
    document.getElementById(
        "texto-formulario"
    );

const tituloFormulario =
    document.getElementById(
        "titulo-formulario"
    );


// =========================================================
// MENSAGENS
// =========================================================

let temporizadorMensagem = null;


function mostrarMensagem(
    texto,
    tipo = "sucesso"
) {

    clearTimeout(
        temporizadorMensagem
    );


    mensagem.textContent =
        texto;


    mensagem.className =
        `mensagem ${tipo} visivel`;


    temporizadorMensagem =
        setTimeout(
            () => {

                mensagem.className =
                    "mensagem";

            },
            3500
        );
}


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
        "Pratos principais",
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


function inicializarProdutos() {

    const produtos =
        gerenciador.listarProdutos();


    if (produtos.length > 0) {
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
// FORMULÁRIO
// =========================================================

function abrirFormularioNovo() {

    formulario.reset();

    campoId.value = "";

    textoFormulario.textContent =
        "Novo produto";

    tituloFormulario.textContent =
        "Cadastrar produto";

    formularioContainer.hidden =
        false;

    campoNome.focus();

}


function abrirFormularioEdicao(
    produto
) {

    campoId.value =
        produto.id;

    campoNome.value =
        produto.nome;

    campoDescricao.value =
        produto.descricao;

    campoPreco.value =
        produto.preco;

    campoCategoria.value =
        produto.categoria;

    campoImagem.value =
        produto.imagem.replace(
            "../",
            ""
        );


    textoFormulario.textContent =
        "Editar produto";

    tituloFormulario.textContent =
        "Alterar dados do produto";


    formularioContainer.hidden =
        false;


    campoNome.focus();

    formularioContainer.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


function fecharFormulario() {

    formulario.reset();

    campoId.value = "";

    formularioContainer.hidden =
        true;

}


// =========================================================
// SALVAR
// =========================================================

function salvarProduto(
    evento
) {

    evento.preventDefault();


    const nome =
        campoNome.value.trim();

    const descricao =
        campoDescricao.value.trim();

    const preco =
        Number(
            campoPreco.value
        );

    const categoria =
        campoCategoria.value.trim();

    let imagem =
        campoImagem.value.trim();


    if (!nome) {

        mostrarMensagem(
            "Informe o nome do produto.",
            "erro"
        );

        campoNome.focus();

        return;
    }


    if (!descricao) {

        mostrarMensagem(
            "Informe a descrição do produto.",
            "erro"
        );

        campoDescricao.focus();

        return;
    }


    if (
        !Number.isFinite(preco) ||
        preco <= 0
    ) {

        mostrarMensagem(
            "Informe um preço maior que zero.",
            "erro"
        );

        campoPreco.focus();

        return;
    }


    if (!categoria) {

        mostrarMensagem(
            "Informe a categoria do produto.",
            "erro"
        );

        campoCategoria.focus();

        return;
    }


    if (!imagem) {

        mostrarMensagem(
            "Informe o caminho da imagem.",
            "erro"
        );

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

        imagem =
            `../${imagem}`;

    }


    const id =
        campoId.value;


    try {

        if (id) {

            gerenciador.atualizarProduto(
                id,
                {
                    nome,
                    descricao,
                    preco,
                    categoria,
                    imagem
                }
            );


            mostrarMensagem(
                "Produto atualizado com sucesso."
            );

        } else {

            const produtos =
                gerenciador.listarProdutos();


            let novoId = 1;


            if (produtos.length > 0) {

                novoId =
                    Math.max(
                        ...produtos.map(
                            (produto) =>
                                produto.id
                        )
                    ) + 1;

            }


            const produto =
                new Produto(
                    novoId,
                    nome,
                    descricao,
                    preco,
                    categoria,
                    imagem
                );


            gerenciador.adicionarProduto(
                produto
            );


            mostrarMensagem(
                "Produto cadastrado com sucesso."
            );

        }


        fecharFormulario();

        renderizarProdutos();


    } catch (erro) {

        console.error(erro);


        mostrarMensagem(
            erro.message ||
            "Não foi possível salvar o produto.",
            "erro"
        );

    }

}


// =========================================================
// EXCLUIR
// =========================================================

function excluirProduto(
    id
) {

    const produto =
        gerenciador.buscarProdutoPorId(
            id
        );


    if (!produto) {

        mostrarMensagem(
            "Produto não encontrado.",
            "erro"
        );

        return;
    }


    /*
        Neste momento usamos confirm para impedir
        uma exclusão acidental.

        Também vamos substituir isso por uma confirmação
        visual personalizada antes da entrega final.
    */

    const confirmou =
        window.confirm(
            `Deseja excluir o produto "${produto.nome}"?`
        );


    if (!confirmou) {
        return;
    }


    try {

        gerenciador.removerProduto(
            id
        );


        fecharFormulario();

        renderizarProdutos();


        mostrarMensagem(
            "Produto excluído com sucesso."
        );


    } catch (erro) {

        console.error(erro);


        mostrarMensagem(
            erro.message ||
            "Não foi possível excluir o produto.",
            "erro"
        );

    }

}


// =========================================================
// LISTA
// =========================================================

function formatarMoeda(
    valor
) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}


function renderizarProdutos() {

    const produtos =
        gerenciador.listarProdutos();


    listaAdministracao.innerHTML =
        "";


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


    produtos.forEach(
        (produto) => {

            const item =
                document.createElement(
                    "article"
                );


            item.className =
                "item-administracao";


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


            const btnEditar =
                item.querySelector(
                    "[data-editar]"
                );


            const btnExcluir =
                item.querySelector(
                    "[data-excluir]"
                );


            btnEditar.addEventListener(
                "click",
                () => {

                    abrirFormularioEdicao(
                        produto
                    );

                }
            );


            btnExcluir.addEventListener(
                "click",
                () => {

                    excluirProduto(
                        produto.id
                    );

                }
            );


            listaAdministracao.appendChild(
                item
            );

        }
    );

}


// =========================================================
// EVENTOS
// =========================================================

btnNovoProduto.addEventListener(
    "click",
    abrirFormularioNovo
);


btnCancelar.addEventListener(
    "click",
    fecharFormulario
);


formulario.addEventListener(
    "submit",
    salvarProduto
);


// =========================================================
// INICIALIZAÇÃO
// =========================================================

inicializarProdutos();

renderizarProdutos();