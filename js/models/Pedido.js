export class Pedido {
  #id;
  #cliente;
  #clienteId;
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
    clienteId = null,
    id = Date.now(),
    data = new Date().toLocaleString("pt-BR"),
    status = "Realizado",
  ) {
    this.#id = id;

    this.#cliente =
      String(cliente || "").trim();

    this.#clienteId =
      clienteId !== null &&
      clienteId !== undefined
        ? String(clienteId)
        : null;

    this.#itens = [...itens];

    this.#tipoEntrega =
      tipoEntrega;

    this.#total =
      Number(total);

    this.#data = data;

    this.#status = status;
  }

  get id() {
    return this.#id;
  }

  get cliente() {
    return this.#cliente;
  }

  get clienteId() {
    return this.#clienteId;
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

    if (!statusValidos.includes(novoStatus)) {
      throw new Error(
        "Status de pedido inválido.",
      );
    }

    this.#status =
      novoStatus;
  }

  toJSON() {
    return {
      id: this.#id,
      cliente: this.#cliente,
      clienteId: this.#clienteId,
      itens: this.#itens,
      tipoEntrega:
        this.#tipoEntrega,
      total: this.#total,
      data: this.#data,
      status: this.#status,
    };
  }
}