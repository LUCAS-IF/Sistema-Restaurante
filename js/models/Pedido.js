export class Pedido {
  #id;
  #cliente;
  #itens;
  #tipoEntrega;
  #total;
  #data;
  #status;

  constructor(
    cliente,
    itens,
    tipoEntrega,
    total,
    id = Date.now(),
    data = new Date().toLocaleString("pt-BR"),
    status = "Realizado",
  ) {
    this.#id = id;
    this.#cliente = cliente;
    this.#itens = [...itens];
    this.#tipoEntrega = tipoEntrega;
    this.#total = total;
    this.#data = data;
    this.#status = status;
  }

  get id() {
    return this.#id;
  }

  get cliente() {
    return this.#cliente;
  }

  get itens() {
    return [...this.#itens];
  }

  get tipoEntrega() {
    return this.#tipoEntrega;
  }

  get total() {
    return this.#total;
  }

  get data() {
    return this.#data;
  }

  get status() {
    return this.#status;
  }

  alterarStatus(novoStatus) {
    const statusValidos = [
      "Realizado",
      "Em preparo",
      "Pronto",
      "Entregue",
      "Cancelado",
    ];

    if (statusValidos.includes(novoStatus)) {
      this.#status = novoStatus;
    }
  }

  toJSON() {
    return {
      id: this.#id,
      cliente: this.#cliente,
      itens: this.#itens,
      tipoEntrega: this.#tipoEntrega,
      total: this.#total,
      data: this.#data,
      status: this.#status,
    };
  }
}
