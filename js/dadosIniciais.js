import { Produto } from "./models/Produto.js";

export function criarProdutosIniciais() {
  return [
    new Produto(
      1,
      "Hambúrguer Artesanal",
      "Hambúrguer artesanal com queijo, alface e tomate.",
      29.9,
      "Lanches",
      "../img/hamburguer.jpg",
    ),

    new Produto(
      2,
      "Pizza Especial",
      "Pizza preparada com ingredientes selecionados.",
      35.0,
      "Pizzas",
      "../img/pizza.jpg",
    ),

    new Produto(
      3,
      "Macarrão à Bolonhesa",
      "Massa artesanal com molho de tomate e carne.",
      32.9,
      "Massas",
      "../img/macarrao_bolonhesa.jpg",
    ),

    new Produto(
      4,
      "Peixe Assado",
      "Peixe assado acompanhado de legumes frescos.",
      42.9,
      "Pratos Principais",
      "../img/peixe_assado.jpg",
    ),

    new Produto(
      5,
      "Beef Wellington",
      "Carne preparada com massa crocante e recheio especial.",
      59.9,
      "Carnes",
      "../img/beef_wellington.jpg",
    ),

    new Produto(
      6,
      "Salada de Frango",
      "Salada fresca com frango grelhado e vegetais.",
      25.9,
      "Saladas",
      "../img/salada_de_frango.jpg",
    ),

    new Produto(
      7,
      "Pudim Individual",
      "Pudim cremoso servido em porção individual.",
      12.9,
      "Sobremesas",
      "../img/pudim_individual.jpg",
    ),

    new Produto(
      8,
      "Sorvete de Frutas Vermelhas",
      "Sorvete cremoso com calda de frutas vermelhas.",
      14.9,
      "Sobremesas",
      "../img/sorvete_frutas_vermelhas.jpg",
    ),
  ];
}