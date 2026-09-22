# Sabor & Arte — Sistema de Pedidos para Restaurante

Projeto desenvolvido para a disciplina de **Desenvolvimento Web 2**, utilizando HTML, CSS e JavaScript com Programação Orientada a Objetos (POO).

## Sobre o projeto

O Sabor & Arte é um sistema web de pedidos para restaurante que permite ao cliente visualizar o cardápio, adicionar produtos ao carrinho, escolher a forma de recebimento, finalizar pedidos e acompanhar seus pedidos.

O sistema também possui uma área administrativa protegida, destinada ao gerenciamento do cardápio e dos pedidos recebidos.

## Tecnologias utilizadas

* HTML5
* CSS3
* JavaScript
* Programação Orientada a Objetos
* `localStorage`
* `sessionStorage`

Não são utilizados frameworks ou bibliotecas externas para a implementação principal do sistema.

## Estrutura do projeto

```text
Sistema-Restaurante/
│
├── css/
│   └── style.css
│
├── html/
│   ├── index.html
│   ├── admin.html
│   └── login.html
│
├── img/
│   ├── beef_wellington.jpg
│   ├── hamburguer.jpg
│   ├── macarrao_bolonhesa.jpg
│   ├── peixe_assado.jpg
│   ├── pizza.jpg
│   ├── pudim_individual.jpg
│   ├── salada_de_frango.jpg
│   └── sorvete_frutas_vermelhas.jpg
│
├── js/
│   ├── admin.js
│   ├── app.js
│   ├── auth.js
│   ├── dadosIniciais.js
│   ├── login.js
│   ├── Gerenciador.js
│   │
│   └── models/
│       ├── Produto.js
│       ├── ItemCarrinho.js
│       ├── Carrinho.js
│       └── Pedido.js
│
└── README.md
```

## Programação Orientada a Objetos

O sistema utiliza as seguintes classes:

### Produto

Representa um item do cardápio.

Principais atributos:

* id
* nome
* descrição
* preço
* categoria
* imagem

### ItemCarrinho

Associa um `Produto` a uma quantidade.

Também calcula o subtotal do item.

### Carrinho

Agrupa os itens adicionados pelo cliente e controla:

* produtos
* quantidades
* subtotal
* tipo de entrega
* taxa de entrega
* valor total

### Pedido

Representa um pedido finalizado.

Possui:

* id
* cliente
* identificação do cliente
* itens
* tipo de entrega
* total
* data
* status

### Gerenciador

Centraliza o gerenciamento de produtos e pedidos, implementando as operações CRUD e a persistência dos dados.

## CRUD

O sistema implementa os quatro tipos de operações CRUD.

### Create

* Cadastro de novos produtos.
* Adição de produtos ao carrinho.
* Criação de pedidos após a finalização.

### Read

* Listagem do cardápio.
* Visualização do carrinho.
* Visualização dos pedidos do cliente.
* Visualização dos pedidos recebidos pela administração.

### Update

* Edição dos dados dos produtos.
* Alteração da quantidade dos itens do carrinho.
* Atualização do status dos pedidos.

### Delete

* Exclusão de produtos.
* Remoção de itens do carrinho.
* Exclusão de pedidos.

As ações destrutivas possuem confirmação antes da exclusão.

## Carrinho

O cliente pode:

* adicionar produtos;
* aumentar a quantidade;
* diminuir a quantidade;
* remover produtos individualmente;
* limpar o carrinho;
* visualizar subtotal;
* visualizar taxa de entrega;
* visualizar o total atualizado.

### Taxa de entrega

Para pedidos de delivery é aplicada uma taxa de:

```text
R$ 2,50
```

Pedidos para retirada ou consumo no local não recebem taxa de entrega.

## Finalização do pedido

Ao finalizar um pedido, o sistema cria um objeto `Pedido` contendo:

* cliente;
* identificação do cliente;
* itens;
* tipo de entrega;
* valor total;
* data;
* status inicial.

Após a finalização, o pedido é armazenado e o carrinho é limpo.

## Login e controle de acesso

O sistema possui uma tela de login com dois perfis:

### Cliente

```text
Login: cliente
Senha: Cliente123!
```

O cliente pode acessar:

* início;
* cardápio;
* carrossel;
* carrinho;
* finalização de pedidos;
* meus pedidos;
* logout.

### Administrador

```text
Login: admin
Senha: Admin123!
```

O administrador pode acessar:

* gerenciamento de produtos;
* cadastro;
* edição;
* exclusão;
* pedidos recebidos;
* alteração do status dos pedidos;
* logout.

As páginas verificam o perfil da sessão antes de permitir o acesso.

## Meus pedidos

Os pedidos são associados ao usuário autenticado.

O cliente visualiza somente os pedidos vinculados à sua conta.

A administração visualiza os pedidos recebidos pelo restaurante.

## Status dos pedidos

Os pedidos podem assumir os seguintes status:

* Realizado
* Em preparo
* Pronto
* Entregue
* Cancelado

## Carrossel

A página principal possui um carrossel de pratos com:

* imagem;
* nome;
* preço;
* navegação entre os pratos;
* possibilidade de adicionar o prato ao carrinho.

O carrossel também considera preferências de redução de movimento do usuário.

## IHC e acessibilidade

O projeto aplica princípios de Interação Humano-Computador, incluindo:

* feedback visual após ações;
* confirmação antes de ações destrutivas;
* consistência visual;
* indicação do estado do sistema;
* textos e botões claros;
* navegação por teclado;
* `aria-label`;
* `aria-live`;
* `aria-pressed`;
* link para pular diretamente ao conteúdo;
* foco visível;
* layout responsivo;
* suporte a `prefers-reduced-motion`;
* contraste e legibilidade.

## Persistência

O projeto utiliza `localStorage` para manter:

* produtos;
* pedidos;
* dados do cardápio;
* dados necessários para a continuidade do sistema após o recarregamento.

A sessão de login utiliza `sessionStorage`.

## Como executar

Como o projeto utiliza módulos JavaScript (`type="module"`), recomenda-se executar utilizando um servidor local.

No Visual Studio Code, pode ser utilizado o **Live Server**.

Abra a pasta:

```text
Sistema-Restaurante/
```

e execute:

```text
html/login.html
```

A tela de login será a porta de entrada do sistema.

## Fluxo do sistema

```text
LOGIN
  │
  ├── Cliente
  │     │
  │     ├── Cardápio
  │     ├── Carrinho
  │     ├── Checkout
  │     └── Meus pedidos
  │
  └── Administrador
        │
        ├── CRUD de produtos
        └── Pedidos recebidos
```

## Persistência e relacionamento

```text
Produto
   │
   ▼
ItemCarrinho
   │
   ▼
Carrinho
   │
   ▼
Pedido
   │
   ├── cliente
   ├── clienteId
   ├── itens
   ├── tipoEntrega
   ├── total
   ├── data
   └── status
```

## Objetivo acadêmico

O projeto foi desenvolvido para atender aos requisitos da atividade de **Desenvolvimento Web 2 — Sistema de Pedidos para Restaurante**, aplicando:

* Programação Orientada a Objetos;
* operações CRUD;
* gerenciamento de carrinho;
* finalização de pedidos;
* carrossel de imagens;
* padrões de IHC;
* acessibilidade;
* responsividade;
* persistência local;
* organização e boas práticas de código.
