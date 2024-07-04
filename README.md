
## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test


# test coverage
$ npm run test:cov
```


# API Documentation

This document provides details on the endpoints available in the API.

## TarefaController

### Create Tarefa

Creates a new task.

- **URL:** `/tarefa/create`
- **Method:** `POST`
- **Headers:**
  - `auth-token`: Bearer token for authentication
- **Body:**
  {
    "titulo": "string",
    "descricao": "string",
    "dataLimite": "Date in ISO format"
  }
- *optinal fields on body: {"concluida": boolean, "descricao": string }*
- **Response:** Returns the created task.

### Delete Tarefa

Deletes a task by its ID.

- **URL:** `/tarefa/delete/:tarefaId`
- **Method:** `DELETE`
- **Headers:**
  - `auth-token`: Bearer token for authentication
- **Params:**
  - `tarefaId`: ID of the task to delete
- **Response:** Returns `true` if the task was deleted successfully.

### List Tarefas

Lists all tasks for the authenticated user.

- **URL:** `/tarefa/list`
- **Method:** `GET`
- **Headers:**
  - `auth-token`: Bearer token for authentication
- **Response:** Returns an array of tasks belonging to the authenticated user.

### Update Tarefa

Updates an existing task by its ID.

- **URL:** `/tarefa/update/:tarefaId`
- **Method:** `PATCH`
- **Headers:**
  - `auth-token`: Bearer token for authentication
- **Params:**
  - `tarefaId`: ID of the task to update
- **Body:**
  {
    "titulo": "string",
    "descricao": "string",
    "dataLimite": "Date in ISO format"
  }
- **Response:** Returns the updated task.

### Get Tarefa by ID

Fetches details of a task by its ID.

- **URL:** `/tarefa/details/:tarefaId`
- **Method:** `GET`
- **Headers:**
  - `auth-token`: Bearer token for authentication
- **Params:**
  - `tarefaId`: ID of the task to fetch
- **Response:** Returns details of the specified task.

---

## UsuarioController

### Create Usuario

Creates a new user.

- **URL:** `/usuario/create`
- **Method:** `POST`
- **Body:**
  {
    "nome": "string",
    "email": "string",
    "senha": "string"
  }
- **Response:** Returns the created user.

### Login Usuario

Authenticates a user and returns an access token.

- **URL:** `/usuario/login`
- **Method:** `POST`
- **Body:**
  {
    "email": "string",
    "password": "string"
  }
- **Response:** Returns an access token if authentication is successful.

---

This document outlines the available endpoints, their methods, expected headers, request bodies, and responses for interacting with the API. Replace `Date in ISO format` with the actual ISO format (e.g., `"2024-07-05T12:00:00Z"`). Ensure to provide valid authentication tokens (`Bearer <token>`) for protected endpoints.
