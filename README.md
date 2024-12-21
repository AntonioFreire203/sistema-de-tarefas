# Estrutura do projeto

## Descrição do Projeto

Este projeto é um sistema de gerenciamento de tarefas desenvolvido em Node.js, que permite aos administradores gerenciar tarefas e usuários, enquanto os usuários comuns podem visualizar suas tarefas atribuídas e atualizar seus status. O sistema utiliza autenticação JWT e inclui funcionalidades de CRUD para usuários e tarefas.

## Link do Repositorio
https://github.com/AntonioFreire203/sistema-de-tarefas

## Principais Funcionalidades   

### Usuário Administrador

   1-riar, atualizar e excluir usuários.
   2-riar, atualizar e excluir tarefas.
   3-tribuir usuários às tarefas.
   4-onsultar usuários atribuídos a uma tarefa.
   5-Listar as tarefas que criou 

### Usuário Regular

   1-onsultar tarefas atribuídas.
   2-tualizar o status das tarefas atribuídas.

Rotas Disponíveis
Autenticação

    POST /auth/login - Autenticar um usuário.

Usuários

    GET /users - Listar todos os usuários (somente admin).

    GET /users/:id - Obter detalhes de um usuário (somente admin).

    POST /users - Criar um novo usuário (somente admin).

    POST /users/admin - Criar um novo administrador (somente admin).

    PUT /users/:id - Atualizar os dados de um usuário (autorizado ou admin).

    DELETE /users/:id - Excluir um usuário (somente admin).

Tarefas

    GET /tasks - Listar tarefas.

    POST /tasks - Criar uma nova tarefa (somente admin).

    PUT /tasks/:id - Atualizar os detalhes de uma tarefa (somente admin).

    DELETE /tasks/:id - Excluir uma tarefa (somente admin).

    PATCH /tasks/:id/status - Atualizar o status de uma tarefa (usuários 
    atribuídos).

    PATCH /tasks/:id/assign - Atribuir usuários a uma tarefa (somente admin).

## Casos de Uso do Projeto 

![casos de uso](/pics/caso-de-uso-4.png)


