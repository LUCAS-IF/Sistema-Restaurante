import { Produto } from "./models/Produto.js";

export class Gerenciador {

    #produtos;
    #pedidos;

    constructor() {
        this.#produtos = [];
        this.#pedidos = [];

        this.carregarDados();
    }

    // =====================================================
    // CRUD DE PRODUTOS
    // =====================================================

    // CREATE
    adicionarProduto(produto) {

        if (!(produto instanceof Produto)) {
            throw new Error("O objeto informado não é um Produto.");
        }

        this.#produtos.push(produto);

        this.salvarDados();
    }

    // READ
    listarProdutos() {
        return [...this.#produtos];
    }

    // READ - buscar produto pelo ID
    buscarProdutoPorId(id) {
        return this.#produtos.find(produto => produto.id === id);
    }

    // UPDATE
    atualizarProduto(id, dados) {

        const produto = this.buscarProdutoPorId(id);

        if (!produto) {
            throw new Error("Produto não encontrado.");
        }

        if (dados.nome !== undefined) {
            produto.nome = dados.nome;
        }

        if (dados.descricao !== undefined) {
            produto.descricao = dados.descricao;
        }

        if (dados.preco !== undefined) {
            produto.preco = dados.preco;
        }

        if (dados.categoria !== undefined) {
            produto.categoria = dados.categoria;
        }

        if (dados.imagem !== undefined) {
            produto.imagem = dados.imagem;
        }

        this.salvarDados();
    }

    // DELETE
    removerProduto(id) {

        const quantidadeAntes = this.#produtos.length;

        this.#produtos = this.#produtos.filter(
            produto => produto.id !== id
        );

        if (this.#produtos.length === quantidadeAntes) {
            throw new Error("Produto não encontrado.");
        }

        this.salvarDados();
    }

    // =====================================================
    // PEDIDOS
    // =====================================================

    adicionarPedido(pedido) {

        this.#pedidos.push(pedido);

        this.salvarDados();
    }

    listarPedidos() {
        return [...this.#pedidos];
    }

    // =====================================================
    // PERSISTÊNCIA - LOCAL STORAGE
    // =====================================================

    salvarDados() {

        const produtos = this.#produtos.map(
            produto => produto.toJSON()
        );

        localStorage.setItem(
            "restaurante_produtos",
            JSON.stringify(produtos)
        );

        localStorage.setItem(
            "restaurante_pedidos",
            JSON.stringify(this.#pedidos)
        );
    }

    carregarDados() {

        const produtosSalvos = localStorage.getItem(
            "restaurante_produtos"
        );

        const pedidosSalvos = localStorage.getItem(
            "restaurante_pedidos"
        );

        if (produtosSalvos) {

            const produtos = JSON.parse(produtosSalvos);

            this.#produtos = produtos.map(
                produto => new Produto(
                    produto.id,
                    produto.nome,
                    produto.descricao,
                    produto.preco,
                    produto.categoria,
                    produto.imagem
                )
            );
        }

        if (pedidosSalvos) {
            this.#pedidos = JSON.parse(pedidosSalvos);
        }
    }

    // =====================================================
    // LIMPAR DADOS
    // =====================================================

    limparProdutos() {

        this.#produtos = [];

        this.salvarDados();
    }
}