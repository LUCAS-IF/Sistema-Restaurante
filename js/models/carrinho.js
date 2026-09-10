import { ItemCarrinho } from "./ItemCarrinho.js";
import { Produto } from "./Produto.js";

export class Carrinho {

    #itens;
    #tipoEntrega;
    #taxaEntregaValor;

    constructor() {

        this.#itens = [];

        // Opções:
        // entrega
        // retirada
        // local
        this.#tipoEntrega = "retirada";

        this.#taxaEntregaValor = 2.50;
    }

    get itens() {
        return [...this.#itens];
    }

    get tipoEntrega() {
        return this.#tipoEntrega;
    }

    set tipoEntrega(tipo) {

        if (
            tipo === "entrega" ||
            tipo === "retirada" ||
            tipo === "local"
        ) {
            this.#tipoEntrega = tipo;
        }
    }

    adicionar(produto) {

        if (!(produto instanceof Produto)) {
            throw new Error("O objeto informado não é um Produto válido.");
        }

        const itemExistente = this.#itens.find(
            item => item.produto.id === produto.id
        );

        if (itemExistente) {

            itemExistente.quantidade =
                itemExistente.quantidade + 1;

        } else {

            this.#itens.push(
                new ItemCarrinho(produto, 1)
            );
        }
    }

    remover(produtoId) {

        this.#itens = this.#itens.filter(
            item => item.produto.id !== produtoId
        );
    }

    alterarQuantidade(produtoId, delta) {

        const item = this.#itens.find(
            item => item.produto.id === produtoId
        );

        if (!item) {
            return;
        }

        const novaQuantidade =
            item.quantidade + delta;

        if (novaQuantidade <= 0) {

            this.remover(produtoId);

        } else {

            item.quantidade = novaQuantidade;
        }
    }

    limpar() {

        this.#itens = [];
    }

    get subtotal() {

        return this.#itens.reduce(
            (total, item) => total + item.subtotal,
            0
        );
    }

    get taxa() {

        if (this.#tipoEntrega === "entrega") {
            return this.#taxaEntregaValor;
        }

        return 0;
    }

    get total() {

        return this.subtotal + this.taxa;
    }
}