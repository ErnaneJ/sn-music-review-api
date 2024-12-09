# Social Network API for Music Reviews

A **Music API** é uma aplicação backend desenvolvida para gerenciar músicas, usuários, avaliações, favoritos, comentários e interações entre usuários no contexto de uma plataforma musical. A API permite que os usuários registrem músicas favoritas, escrevam e leiam reviews, comentem nas músicas e interajam com outros usuários. A aplicação foi desenvolvida com **Node.js**, utilizando **Express.js** e **Prisma ORM** com **SQLite** para gerenciamento de banco de dados.

**Componentes do grupo:** 

- JOSE MARTINS NETO

- QUELITA MIRIAM NUNES FERRAZ

- ERNANE FERREIRA ROCHA JUNIOR

- ROSELIA NASCIMENTO DA SILVA

- VINÍCIUS COSTA BULHÕES

## Histórias de Usuário

O projeto tem como objetivo criar uma rede social de reviews de músicas, onde usuários podem interagir entre si, avaliar músicas, deixar comentários e organizar suas favoritas. As histórias de usuário abaixo representam as principais funcionalidades desejadas para a aplicação, priorizando a experiência do usuário e o objetivo central do sistema.

1.⁠ Cadastrar usuário
⁠Como usuário, quero me cadastrar com email e senha para acessar a plataforma.  
Critério de aceitação:
  - O sistema deve notificar caso email já está em uso.
2.⁠ ⁠Favoritar músicas
Como usuário, quero salvar músicas como “favoritas” para encontrá-las facilmente e ver suas avaliações.
Critério de aceitação:
  -
3.⁠ ⁠Avaliar músicas
Como usuário, quero avaliar músicas com notas e comentários.
Critério de aceitação:
  - 
4. Seguir usuários⁠ ⁠
Como usuário, quero seguir outros usuários.
Critério de aceitação:
  -
5. Buscar por músicas⁠ ⁠
Como usuário, quero poder buscar músicas.
Critério de aceitação:
  -

## Diagrama UML

O diagarama de classe UML abaixo descreve a estrutura desenvolvida para a apliacação do projeto.

|Diagrama UML|
|-------------|
|![diagrama](./docs/image.png)|

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

## Songs

Operações relacionadas a músicas

| Método | Rota               | Descrição                                | Autenticação |
|--------|---------------------|------------------------------------------|---------------------|
| `POST`   | `/songs`              | Criar uma nova música                   | ✅                |
| `GET`    | `/songs`              | Listar todas as músicas                 | ❌              |
| `PATCH`  | `/songs/{songId}`     | Atualizar uma música                    | ✅               |
| `DELETE` | `/songs/{songId}`     | Deletar uma música                      | ✅              |
| `GET`    | `/songs/{songId}`     | Obter detalhes de uma música            | ❌             |
| `GET`    | `/songs/search`       | Buscar músicas por título, artista, álbum ou gênero | ❌              |

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

### Usando Swagger para rotas autenticadas

![swagger preview](./docs/swagger.png)

Siga estas etapas para usar rotas autenticadas no Swagger:

1. **Acesse o Swagger**  
   Abra o Swagger em [http://localhost:3000/api-docs](http://localhost:3000/api-docs).

2. **Crie um usuário**  
   - Navegue até a seção **Usuários**.  
   - Localize a rota `POST /users` (Criar).  
   - Expanda a seção, clique em **Experimente** e edite a carga JSON com o e-mail e a senha desejados. Por exemplo:  
     ```json
     {
       "email": "seu_email@exemplo.com",
       "senha": "sua_senha"
     }
     ```  
   - Clique em **Executar** para criar o usuário.

3. **Faça login com o usuário**  
   - Navegue até a seção **Autenticação**.  
   - Localize a rota `POST /auth/login`.  
   - Expanda a seção, clique em **Experimente** e forneça o e-mail e a senha que você usou para criar o usuário.  
   - Clique em **Executar** para fazer login.  

4. **Copie o token**  
   - A resposta de login incluirá um token. Por exemplo:  
     ```json
     {
       "token": "SEU_TOKEN_AQUI"
     }
     ```  
   - Copie o valor de `"YOUR_TOKEN_HERE"`.

5. **Autorizar em Swagger**  
   - Role até o topo da página do Swagger.  
   - Clique no botão **Autorizar** no canto superior direito.  
   - Cole o token copiado no campo que aparece.  
   - Clique em **Autorizar** para confirmar.

6. **Você está autenticado**  
   Uma vez autorizado, agora você pode acessar todas as rotas autenticadas no Swagger sem etapas adicionais!
