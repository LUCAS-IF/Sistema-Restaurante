import { Produto } from "./models/Produto.js";
import { Pedido } from "./models/Pedido.js";

export class Gerenciador {
  #produtos;
  #pedidos;

  constructor() {
    this.#produtos = [];
    this.#pedidos = [];

    this.carregarDados();
  }

  // =====================================================
  // PRODUTOS - CRUD
  // =====================================================

  // CREATE
  adicionarProduto(produto) {
    if (!(produto instanceof Produto)) {
      throw new Error("O objeto informado não é um Produto.");
    }

    const produtoExistente = this.buscarProdutoPorId(produto.id);

    if (produtoExistente) {
      throw new Error("Já existe um produto com esse ID.");
    }

    this.#produtos.push(produto);

    this.salvarDados();
  }

  // READ
  listarProdutos() {
    return [...this.#produtos];
  }

  buscarProdutoPorId(id) {
    return this.#produtos.find((produto) => produto.id === Number(id));
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
      (produto) => produto.id !== Number(id),
    );

    if (this.#produtos.length === quantidadeAntes) {
      throw new Error("Produto não encontrado.");
    }

    this.salvarDados();
  }

  // =====================================================
  // PEDIDOS
  // =====================================================

  // CREATE
  adicionarPedido(pedido) {
    if (!(pedido instanceof Pedido)) {
      throw new Error("O objeto informado não é um Pedido.");
    }

    this.#pedidos.push(pedido);

    this.salvarDados();
  }

  // READ
  listarPedidos() {
    return [...this.#pedidos];
  }

  buscarPedidoPorId(id) {
    return this.#pedidos.find((pedido) => pedido.id === Number(id));
  }

  // UPDATE
  atualizarStatusPedido(id, novoStatus) {
    const pedido = this.buscarPedidoPorId(id);

    if (!pedido) {
      throw new Error("Pedido não encontrado.");
    }

    pedido.alterarStatus(novoStatus);

    this.salvarDados();
  }

  // DELETE
  removerPedido(id) {
    const quantidadeAntes = this.#pedidos.length;

    this.#pedidos = this.#pedidos.filter((pedido) => pedido.id !== Number(id));

    if (this.#pedidos.length === quantidadeAntes) {
      throw new Error("Pedido não encontrado.");
    }

    this.salvarDados();
  }

  // =====================================================
  // LOCAL STORAGE
  // =====================================================

  salvarDados() {
    const produtos = this.#produtos.map((produto) => produto.toJSON());

    const pedidos = this.#pedidos.map((pedido) => pedido.toJSON());

    localStorage.setItem("restaurante_produtos", JSON.stringify(produtos));

    localStorage.setItem("restaurante_pedidos", JSON.stringify(pedidos));
  }

  carregarDados() {
    const produtosSalvos = localStorage.getItem("restaurante_produtos");

    const pedidosSalvos = localStorage.getItem("restaurante_pedidos");

    if (produtosSalvos) {
      const produtos = JSON.parse(produtosSalvos);

      this.#produtos = produtos.map(
        (produto) =>
          new Produto(
            produto.id,
            produto.nome,
            produto.descricao,
            produto.preco,
            produto.categoria,
            produto.imagem,
          ),
      );
    }

    if (pedidosSalvos) {
      const pedidos = JSON.parse(pedidosSalvos);

      this.#pedidos = pedidos.map((pedido) => {
        const novoPedido = new Pedido(
          pedido.cliente,
          pedido.itens,
          pedido.tipoEntrega,
          pedido.total,
          pedido.id,
          pedido.data,
          pedido.status,
        );

        return novoPedido;
      });
    }
  }
}
