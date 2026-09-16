export class Produto {

    #id;
    #nome;
    #descricao;
    #preco;
    #categoria;
    #imagem;

    constructor(id, nome, descricao, preco, categoria, imagem) {
        this.#id = id;
        this.#nome = nome;
        this.#descricao = descricao;
        this.#preco = parseFloat(preco);
        this.#categoria = categoria;
        this.#imagem = imagem;
    }

    get id() {
        return this.#id;
    }

    get nome() {
        return this.#nome;
    }

    get descricao() {
        return this.#descricao;
    }

    get preco() {
        return this.#preco;
    }

    get categoria() {
        return this.#categoria;
    }

    get imagem() {
        return this.#imagem;
    }

    set nome(novoNome) {
        this.#nome = novoNome;
    }

    set descricao(novaDescricao) {
        this.#descricao = novaDescricao;
    }

    set preco(novoPreco) {
        this.#preco = parseFloat(novoPreco);
    }

    set categoria(novaCategoria) {
        this.#categoria = novaCategoria;
    }

    set imagem(novaImagem) {
        this.#imagem = novaImagem;
    }

    toJSON() {
        return {
            id: this.#id,
            nome: this.#nome,
            descricao: this.#descricao,
            preco: this.#preco,
            categoria: this.#categoria,
            imagem: this.#imagem
        };
    }
}