# Social Network API for Music Reviews

A **Music API** é uma aplicação backend desenvolvida para gerenciar músicas, usuários, avaliações, favoritos, comentários e interações entre usuários no contexto de uma plataforma musical. A API permite que os usuários registrem músicas favoritas, escrevam e leiam reviews, comentem nas músicas e interajam com outros usuários. A aplicação foi desenvolvida com **Node.js**, utilizando **Express.js** e **Prisma ORM** com **SQLite** para gerenciamento de banco de dados.

## Tecnologias Utilizadas

- **Node.js** com JavaScript puro.
- **Express.js** para criação das rotas e servidor.
- **Prisma ORM** para interagir com o banco de dados.
- **SQLite** como banco de dados relacional.
- **Docker** para containerização da aplicação.
- **JWT (JSON Web Token)** para autenticação de usuários.

## Tabela de Rotas

### **Authentication**  

Operações relacionadas à autenticação de usuários.

| Método | Rota            | Descrição                           | Parâmetros / Corpo                          | Resposta                           | Autenticação |
|--------|-----------------|-------------------------------------|---------------------------------------------|-----------------------------------|--------------|
| `POST` | `/auth/login`    | Realiza o login do usuário e gera um token JWT. | `email`, `password`                         | `{ token: "jwt_token" }`          | ❌            |

### **Comments**  

Operações relacionadas a comentários.

| Método | Rota                        | Descrição                                                | Parâmetros / Corpo                              | Resposta                            | Autenticação |
|--------|-----------------------------|----------------------------------------------------------|-------------------------------------------------|------------------------------------|--------------|
| `POST` | `/comments`                 | Cria um novo comentário em uma música ou avaliação.       | `content`, `userId`, `songId` ou `reviewId`     | `{ id, content, userId, createdAt, updatedAt }` | ✅            |
| `GET`  | `/comments/{reviewId}`      | Recupera todos os comentários para uma avaliação específica. | `reviewId`                                      | `[ { id, content, userId, createdAt, updatedAt } ]` | ❌            |
| `PUT`  | `/comments/{id}`            | Atualiza um comentário existente.                         | `id`, `content`                                 | `{ id, content, updatedAt }`       | ✅            |
| `DELETE`| `/comments/{id}`           | Deleta um comentário existente.                          | `id`                                           | `{ message: "Comentário deletado" }` | ✅            |

### **Likes**  

Operações relacionadas a curtidas.

| Método  | Rota                        | Descrição                                                | Parâmetros / Corpo                              | Resposta                            | Autenticação |
|---------|-----------------------------|----------------------------------------------------------|-------------------------------------------------|------------------------------------|--------------|
| `POST`  | `/likes`                     | Adiciona uma curtida a uma avaliação.                    | `reviewId`, `userId`                            | `{ message: "Curtir adicionado" }` | ✅            |
| `DELETE`| `/likes`                     | Remove uma curtida de uma avaliação.                     | `reviewId`, `userId`                            | `{ message: "Curtir removido" }`   | ✅            |
| `GET`   | `/likes/{reviewId}`          | Recupera todas as curtidas de uma avaliação.             | `reviewId`                                      | `[ { id, userId, reviewId } ]`     | ❌            |

### **Reviews**

Operações relacionadas a avaliações.

| Método  | Rota                         | Descrição                                                | Parâmetros / Corpo                              | Resposta                             | Autenticação |
|---------|------------------------------|----------------------------------------------------------|-------------------------------------------------|-------------------------------------|--------------|
| `POST`  | `/reviews`                   | Cria uma nova avaliação para uma música.                 | `songId`, `rating`, `content`                   | `{ id, userId, songId, rating, content }` | ✅            |
| `PATCH` | `/reviews/{reviewId}`        | Atualiza uma avaliação existente.                        | `reviewId`, `rating`, `content`                 | `{ id, userId, songId, rating, content, updatedAt }` | ✅            |
| `DELETE`| `/reviews/{reviewId}`        | Deleta uma avaliação existente.                          | `reviewId`                                      | `{ message: "Avaliação deletada" }`  | ✅            |
| `GET`   | `/reviews/song/{songId}`     | Lista todas as avaliações de uma música.                 | `songId`                                        | `[ { id, userId, songId, rating, content } ]` | ❌            |

### **Users**  

Operações relacionadas aos usuários.

| Método  | Rota                         | Descrição                                                | Parâmetros / Corpo                              | Resposta                             | Autenticação |
|---------|------------------------------|----------------------------------------------------------|-------------------------------------------------|-------------------------------------|--------------|
| `POST`  | `/users`                     | Cria um novo usuário na plataforma.                      | `email`, `password`                             | `{ id, email, createdAt, updatedAt }` | ❌            |
| `GET`   | `/users`                     | Lista todos os usuários registrados.                     | Nenhum                                          | `[ { id, email, createdAt, updatedAt } ]` | ✅            |
| `GET`   | `/users/{userId}`            | Obtém detalhes de um usuário específico.                 | `userId`                                        | `{ id, email, createdAt, updatedAt }` | ✅            |
| `PATCH` | `/users/{userId}`            | Atualiza os dados de um usuário específico.              | `userId`, `email`, `password`                   | `{ id, email, updatedAt }`          | ✅            |

## Como Levantar a Aplicação

### Passo 1: Copiar o Arquivo `.env`

Primeiro, copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Isso criará o arquivo de configuração para as variáveis de ambiente.

### Passo 2: Subir os Containers com Docker

Em seguida, execute o comando abaixo para levantar a aplicação utilizando **Docker Compose**:

```bash
docker-compose up --build
```

Isso irá construir e iniciar o container do servidor.

### Passo 3: Acessar o Servidor e o Prisma Studio

- O servidor estará acessível em `http://localhost:3000`.
- O **Prisma Studio** estará acessível em `http://localhost:5555`.

Para acessar a documentação swagger acesse: `http://localhost:3000/api-docs`

### Passo 4: Rodar o Seed para Popular o Banco com Dados

Se quiser popular o banco com dados de exemplo, execute o comando abaixo para rodar o seed:

```bash
docker exec music-api-server-1 sh -c "npm run db:seed"
```

Lembre-se de que `music-api-server-1` é o nome do container. Caso o nome seja diferente, execute o comando `docker ps -a` ou verifique na interface gráfica do Docker para descobrir o nome exato do container.

### Passo 5: Limpar o Banco de Dados

Caso queira limpar o banco de dados, execute o comando abaixo:

```bash
npx prisma migrate reset
```

Este comando remove todos os dados das tabelas e recria o banco de dados a partir do esquema definido no `prisma/schema.prisma`.