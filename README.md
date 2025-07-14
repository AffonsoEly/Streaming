# Mini Streaming

Este é um projeto de plataforma de streaming simples, desenvolvido para fins acadêmicos, utilizando **HTML**, **CSS**, **JavaScript** e **PouchDB** para armazenamento local no navegador.

## Funcionalidades

- **Login e Cadastro de Usuários**
  - Diferencia usuários comuns e administradores.
  - Tela de login obrigatória ao iniciar o sistema.
  - Cadastro de novos usuários via painel admin.

- **Administração**
  - Administradores podem cadastrar, editar e excluir usuários.
  - Administradores podem cadastrar, editar e excluir filmes.
  - Cadastro de filmes com título, categoria e link do YouTube.

- **Exibição de Filmes**
  - Filmes exibidos em cards com imagem, título e categoria.
  - Carrossel de filmes em destaque na página inicial.
  - Filtro dinâmico por título e por categoria.
  - Menu de categorias dinâmico: mostra apenas categorias cadastradas no banco.

- **Banco de Dados Local**
  - Todos os dados são salvos no navegador usando PouchDB.
  - Não é necessário servidor ou backend.

## Como Usar

1. **Clone ou baixe o projeto.**
2. Abra o arquivo `pages/login.html` ou `pages/Index.html` no navegador.
3. Faça login como admin (`admin` / `admin123`) ou cadastre um novo usuário.
4. Use o painel admin para cadastrar filmes e usuários.
5. Navegue pelas páginas, filtre filmes por título ou categoria e aproveite!

## Estrutura de Pastas
