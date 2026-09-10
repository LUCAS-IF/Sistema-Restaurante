import { Produto } from "./Produto.js";

export class ItemCarrinho {

    #produto;
    #quantidade;

    constructor(produto, quantidade = 1) {

        if (!(produto instanceof Produto)) {
            throw new Error("O item deve ser uma instância válida de Produto.");
        }

        this.#produto = produto;
        this.#quantidade = Math.max(1, parseInt(quantidade) || 1);
    }

    get produto() {
        return this.#produto;
    }

    get quantidade() {
        return this.#quantidade;
    }

    set quantidade(novaQuantidade) {

        const quantidade = parseInt(novaQuantidade);

        if (quantidade > 0) {
            this.#quantidade = quantidade;
        }
    }

    get subtotal() {
        return this.#produto.preco * this.#quantidade;
    }

    toJSON() {

        return {
            produto: this.#produto.toJSON(),
            quantidade: this.#quantidade,
            subtotal: this.subtotal
        };
    }
}