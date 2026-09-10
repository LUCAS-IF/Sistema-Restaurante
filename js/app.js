import { Produto } from "./models/Produto.js";
import { Gerenciador } from "./Gerenciador.js";

const gerenciador = new Gerenciador();

const produto = new Produto(
    1,
    "Hambúrguer Artesanal",
    "Hambúrguer artesanal com queijo, alface e tomate.",
    29.90,
    "Lanches",
    "imagens/hamburguer.jpg"
);

gerenciador.adicionarProduto(produto);

console.log("Produtos cadastrados:");
console.log(gerenciador.listarProdutos());