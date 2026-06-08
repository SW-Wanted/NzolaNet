# NzolaNet — Documentação

**Versão:** 1.0.0
---

## Índice

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Tecnologias Utilizadas](#2-tecnologias-utilizadas)
3. [Estrutura de Pastas](#3-estrutura-de-pastas)
4. [Explicação da Arquitetura](#4-explicação-da-arquitetura)
5. [Fluxo de Funcionalidades Reais](#5-fluxo-de-funcionalidades-reais)
6. [Banco de Dados](#6-banco-de-dados)
7. [Sistema de Eventos](#7-sistema-de-eventos)
8. [Segurança](#8-segurança)
9. [Testes](#9-testes)
10. [Docker](#10-docker)
11. [OpenAPI / Swagger](#11-openapi--swagger)
12. [Dependências](#12-dependências)
13. [Mapa Mental do Projeto](#13-mapa-mental-do-projeto)
14. [Explicação para Iniciantes](#14-explicação-para-iniciantes)

---

## 1. Visão Geral do Projeto

### 1.1 Qual problema o sistema resolve

A NzolaNet é uma rede social académica, pensada para a comunidade angolana, onde utilizadores podem publicar conteúdos (texto, imagens, vídeos), interagir através de "bazes" (equivalente a likes/curtidas), comentar publicações, seguir outros utilizadores e receber notificações. O sistema resolve a necessidade de uma plataforma de comunicação digital onde estudantes e membros de comunidades possam partilhar ideias, cultura e informação num ambiente organizado e seguro.

Em termos técnicos, o projeto resolve o desafio clássico de construir uma aplicação web moderna com separação clara entre frontend e backend, autenticação segura, gestão de ficheiros multimédia, e um sistema de notificações em tempo real baseado em eventos.

### 1.2 O fluxo completo do sistema

O NzolaNet funciona com uma arquitetura cliente-servidor. O utilizador interage com uma interface visual construída em Angular (o "frontend"), que corre no browser. Quando o utilizador faz alguma ação — como publicar um post, dar um baze, ou comentar — o Angular envia um pedido HTTP (uma "mensagem formatada") para o backend, que é uma API REST construída em Laravel (PHP). O backend processa esse pedido, aplica regras de negócio, interage com a base de dados MySQL, e devolve uma resposta em formato JSON.

Pensem nisto como uma conversa entre duas pessoas que falam por cartas: o Angular escreve uma carta (HTTP Request) com um pedido específico, envia-a ao Laravel, que lê a carta, faz o que é pedido (consulta ficheiros, guarda dados), e responde com outra carta (HTTP Response) contendo o resultado.

### 1.3 Diagrama do fluxo completo

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER DO UTILIZADOR                    │
│  O utilizador clica num botão, preenche um formulário, etc.     │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     ANGULAR (Frontend)                          │
│  Component detecta a ação → chama um Service Angular            │
│  (ex: PostService.createPost())                                 │
│  O Service constrói um HTTP Request com os dados                │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          │  HTTP Request (POST /api/posts)
                          │  Headers: Authorization: Bearer <token>
                          │  Body: { content: "Olá NzolaNet!", image: ... }
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                        NGINX (Servidor Web)                     │
│  Recebe o pedido HTTP e encaminha para o PHP-FPM                │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     LARAVEL (Backend)                           │
│                                                                 │
│  1. MIDDLEWARE (auth:sanctum)                                   │
│     Verifica se o token é válido.                               │
│     Se não for → responde 401 Unauthorized                      │
│                                                                 │
│  2. ROUTES (api.php)                                            │
│     Determina qual Controller e método chamar                   │
│     POST /api/posts → PostController@store                      │
│                                                                 │
│  3. FORM REQUEST (StorePostRequest)                             │
│     Valida os dados recebidos                                   │
│     content: obrigatório, string, max 5000 caracteres           │
│     image: opcional, deve ser imagem, max 8MB                   │
│     Se falhar → responde 422 com erros de validação             │
│                                                                 │
│  4. CONTROLLER (PostController)                                 │
│     Recebe dados validados                                      │
│     Cria um DTO (CreatePostDTO) com os dados                    │
│     Chama o Service                                             │
│                                                                 │
│  5. DTO (CreatePostDTO)                                         │
│     Objeto simples que transporta dados de forma estruturada    │
│     userId, content, image, video                               │
│                                                                 │
│  6. SERVICE (PostService)                                       │
│     Executa a lógica de negócio                                 │
│     Guarda imagem/vídeo no disco                                │
│     Chama o Repository                                          │
│                                                                 │
│  7. REPOSITORY (EloquentPostRepository)                         │
│     Comunica com a base de dados via Eloquent ORM               │
│     Post::create([...])                                         │
│                                                                 │
│  8. MODEL (Post)                                                │
│     Representa a tabela "posts" na base de dados                │
│     Define relações (user, likes, comments)                     │
│                                                                 │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BASE DE DADOS (MySQL)                       │
│  INSERT INTO posts (user_id, content, image_path, ...)          │
│  VALUES (1, 'Olá NzolaNet!', 'posts/images/abc.jpg', ...)      │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          │  Dados guardados com sucesso
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   CAMINHO DE VOLTA (Response)                   │
│                                                                 │
│  7. REPOSITORY devolve o Model Post criado                      │
│  6. SERVICE devolve o Post ao Controller                        │
│  4. CONTROLLER envolve o Post num Resource                      │
│                                                                 │
│  9. RESOURCE (PostResource)                                     │
│     Transforma o Model num array formatado para JSON            │
│     Inclui: id, author, content, image_url, likes_count, etc.   │
│     Remove campos sensíveis                                     │
│                                                                 │
│  4. CONTROLLER envolve o Resource na resposta padrão            │
│     { success: true, message: "...", data: {...} }              │
│                                                                 │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          │  HTTP Response (201 Created)
                          │  Body: { success: true, data: { id: 42, ... } }
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     ANGULAR (Frontend)                          │
│  Service recebe o JSON → Component atualiza a interface         │
│  O novo post aparece no feed do utilizador                      │
└─────────────────────────────────────────────────────────────────┘
```

### 1.4 Como Frontend e Backend comunicam

A comunicação é feita exclusivamente através de uma API REST (Representational State Transfer). O Angular nunca acede diretamente à base de dados. Em vez disso, envia pedidos HTTP para URLs específicos do Laravel.

Cada pedido tem um método HTTP que indica a intenção: GET (obter dados), POST (criar dados), PUT (atualizar dados), DELETE (apagar dados). O Laravel responde sempre em formato JSON, com uma estrutura padronizada que inclui o campo `success` (verdadeiro ou falso), uma `message` descritiva, e os `data` (os dados propriamente ditos).

A autenticação é feita via tokens. Quando o utilizador faz login, o Laravel gera um token único (uma espécie de "passe de acesso"). O Angular guarda esse token no localStorage do browser e envia-o em todos os pedidos seguintes no cabeçalho `Authorization: Bearer <token>`. O Laravel verifica esse token em cada pedido para confirmar a identidade do utilizador.

---

## 2. Tecnologias Utilizadas

### 2.1 PHP

**O que é:** PHP é uma linguagem de programação criada em 1994, especializada no desenvolvimento de aplicações web do lado do servidor. É a linguagem que o Laravel utiliza.

**Para que serve:** No NzolaNet, o PHP é a linguagem na qual todo o código do backend está escrito — controllers, services, repositories, models, tudo é PHP.

**Porque foi utilizada:** O enunciado do projeto exigia PHP Laravel como opção de backend. PHP é uma das linguagens mais utilizadas para desenvolvimento web, com uma comunidade enorme e muitos recursos de aprendizagem. O Laravel, que é um framework PHP, simplifica enormemente tarefas como autenticação, validação, acesso à base de dados e gestão de ficheiros.

**Como interage com as outras:** O PHP corre dentro do container PHP-FPM do Docker. O Nginx recebe os pedidos HTTP e encaminha-os para o PHP-FPM, que executa o código PHP do Laravel. O PHP comunica com o MySQL através do PDO (PHP Data Objects), e o Composer gere as suas dependências.

**Exemplo real no projeto:** Todo ficheiro com extensão `.php` dentro da pasta `backend/app/` é código PHP. Por exemplo, o ficheiro `PostController.php` é uma classe PHP que define métodos para listar, criar, editar e apagar publicações.

### 2.2 Laravel

**O que é:** Laravel é um framework (conjunto de ferramentas e convenções) para PHP, criado por Taylor Otwell em 2011. É atualmente o framework PHP mais popular do mundo. A versão utilizada no NzolaNet é a 12.

**Para que serve:** Laravel fornece uma estrutura organizada para construir aplicações web. Em vez de escreverem tudo do zero (ligação à base de dados, sistema de login, validação de dados, etc.), o Laravel já traz tudo isso pronto, permitindo que a equipa se concentre na lógica específica do NzolaNet.

**Porque foi utilizada:** O enunciado exigia Laravel. Além disso, Laravel é ideal para APIs REST porque inclui nativamente sistema de rotas, middleware de autenticação (Sanctum), ORM para base de dados (Eloquent), sistema de validação de dados, sistema de eventos, e muito mais.

**Como interage com as outras:** Laravel é o centro do backend. Recebe pedidos do Nginx, usa o Eloquent para comunicar com o MySQL, usa o Sanctum para autenticação, e expõe endpoints REST que o Angular consome. O Composer instala o Laravel e as suas dependências.

**Exemplo real no projeto:** O ficheiro `routes/api.php` define todas as rotas da API. Quando se escreve `Route::apiResource('posts', PostController::class)`, o Laravel cria automaticamente 5 rotas: listar todos, ver um, criar, atualizar e apagar.

### 2.3 Angular

**O que é:** Angular é um framework frontend desenvolvido pela Google, escrito em TypeScript. É utilizado para construir interfaces web interativas e dinâmicas (Single Page Applications). A versão utilizada no NzolaNet é a 21.

**Para que serve:** O Angular é responsável por tudo o que o utilizador vê e interage no browser: formulários de login, feed de publicações, perfil do utilizador, botões de baze, formulários de comentário, etc.

**Porque foi utilizada:** O enunciado exigia Angular como frontend. Angular é uma escolha sólida para projetos complexos porque impõe uma estrutura organizada com componentes, serviços e módulos, facilitando a manutenção do código.

**Como interage com as outras:** O Angular comunica com o Laravel exclusivamente via HTTP. Cada serviço Angular (AuthService, PostService, UserService, CommentService) faz pedidos HTTP para os endpoints da API Laravel. O Angular usa o `HttpClient` para enviar pedidos e receber respostas JSON. Um interceptor (`authInterceptor`) adiciona automaticamente o token de autenticação a cada pedido.

**Exemplo real no projeto:** O ficheiro `frontend/src/app/services/post.service.ts` contém o `PostService`, que tem métodos como `createPost()`, `getGlobalFeed()`, `likePost()`. Cada método faz um pedido HTTP ao Laravel e transforma a resposta num objeto TypeScript.

### 2.4 Docker

**O que é:** Docker é uma plataforma de contentorização que permite empacotar uma aplicação e todas as suas dependências num "container" isolado. Pensem num container como uma caixa que contém tudo o que o programa precisa para funcionar — sistema operativo, linguagem de programação, bibliotecas, configurações — tudo num pacote portátil.

**Para que serve:** Docker garante que o NzolaNet funciona exatamente da mesma forma em qualquer computador. Em vez de cada membro da equipa instalar PHP, MySQL, Nginx, e Redis manualmente (e lidar com versões incompatíveis), basta executar um comando e tudo sobe automaticamente.

**Porque foi utilizada:** Docker resolve o clássico problema "no meu computador funciona". Também simplifica a implantação (deployment) em servidores de produção. O docker-compose.yml define todos os serviços necessários e as suas relações num único ficheiro.

**Como interage com as outras:** O Docker cria containers separados para cada serviço: Nginx (servidor web), PHP-FPM (executa o PHP), MySQL (base de dados), Redis (cache e filas), Queue Worker (processa tarefas em background), e Scheduler (tarefas agendadas). Estes containers comunicam entre si numa rede virtual interna criada pelo Docker.

**Exemplo real no projeto:** O ficheiro `backend/docker-compose.yml` define 6 serviços. O ficheiro `backend/Dockerfile` descreve como construir o container PHP com todas as extensões necessárias (pdo_mysql, gd, redis, etc.).

### 2.5 MySQL

**O que é:** MySQL é um sistema de gestão de bases de dados relacional (RDBMS). É onde todos os dados do NzolaNet são persistidos — utilizadores, publicações, comentários, bazes, notificações, relações de seguimento.

**Para que serve:** Sempre que o Laravel precisa guardar, ler, atualizar ou apagar dados, comunica com o MySQL. A base de dados organiza os dados em tabelas (users, posts, comments, likes, followers, notifications) com relações entre elas.

**Porque foi utilizada:** O enunciado permitia MySQL como opção de base de dados. MySQL é uma das bases de dados mais utilizadas no mundo, gratuita, fiável, e perfeitamente integrada com o Laravel através do Eloquent ORM.

**Como interage com as outras:** O Laravel comunica com o MySQL através do driver PDO (pdo_mysql instalado no Dockerfile). As migrations do Laravel criam automaticamente as tabelas. O Eloquent ORM traduz operações PHP em queries SQL.

**Exemplo real no projeto:** A migration `2026_06_01_000002_create_posts_table.php` cria a tabela `posts` com colunas para `user_id`, `content`, `image_path`, `video_path`, e `timestamps`.

### 2.6 Composer

**O que é:** Composer é o gestor de dependências do PHP. Funciona como o npm para JavaScript — permite instalar, atualizar e gerir bibliotecas (pacotes) de terceiros que o projeto utiliza.

**Para que serve:** Instala o Laravel e todas as suas dependências. Também gere o autoloading (carregamento automático de classes), para que não seja necessário incluir manualmente cada ficheiro PHP.

**Porque foi utilizada:** É a ferramenta padrão para qualquer projeto PHP moderno. Sem o Composer, seria necessário descarregar e configurar manualmente dezenas de bibliotecas.

**Exemplo real no projeto:** O ficheiro `backend/composer.json` lista todas as dependências: `laravel/framework`, `laravel/sanctum`, `laravel/tinker`, etc. O comando `composer install` instala tudo.

### 2.7 Nginx

**O que é:** Nginx é um servidor web de alto desempenho. No NzolaNet, funciona como "porta de entrada" — recebe todos os pedidos HTTP dos browsers e encaminha-os para o PHP.

**Para que serve:** O Nginx recebe o pedido HTTP na porta 80 (mapeada para a porta 8000 do host). Se o pedido é para um ficheiro estático (CSS, JS, imagem), o Nginx serve-o diretamente. Se é para uma rota PHP (API), encaminha-o para o PHP-FPM.

**Porque foi utilizada:** Nginx é extremamente eficiente para servir conteúdo estático e fazer proxy reverso para aplicações PHP. É a combinação mais comum em produção: Nginx + PHP-FPM.

**Exemplo real no projeto:** O ficheiro `backend/docker/nginx/default.conf` configura o Nginx para encaminhar pedidos `.php` para `php-fpm:9000` e servir ficheiros estáticos a partir da pasta `public/`.

### 2.8 Laravel Sanctum

**O que é:** Sanctum é o pacote oficial do Laravel para autenticação via tokens. Permite que aplicações SPA (Single Page Applications) como o frontend Angular se autentiquem na API.

**Para que serve:** Quando um utilizador faz login, o Sanctum gera um token de acesso pessoal (Personal Access Token) que é guardado na tabela `personal_access_tokens`. Esse token é enviado em cada pedido subsequente para identificar o utilizador.

**Porque foi utilizada:** O enunciado exige segurança na autenticação. Sanctum é a solução oficial do Laravel para autenticação de SPAs e APIs, simples de implementar e segura.

**Como interage com as outras:** O modelo User usa o trait `HasApiTokens` do Sanctum. O middleware `auth:sanctum` nas rotas verifica o token. O Angular envia o token no cabeçalho Authorization de cada pedido.

**Exemplo real no projeto:** No `AuthService.php`, o método `tokenResponse()` cria um token com `$user->createToken('nzolanet-api')->plainTextToken`. Esse token é enviado ao Angular na resposta de login.

### 2.9 Redis

**O que é:** Redis é um sistema de armazenamento de dados em memória (in-memory), extremamente rápido. Funciona como cache e como broker de mensagens.

**Para que serve:** No NzolaNet, o Redis é utilizado para duas funções: sistema de filas (queue) para processamento assíncrono de tarefas, e sistema de cache para melhorar a performance.

**Porque foi utilizada:** O docker-compose inclui Redis para suportar o queue worker, que processa tarefas em background (como envio de emails de recuperação de senha). Redis é muito mais rápido que guardar filas na base de dados.

**Exemplo real no projeto:** O container `queue` no docker-compose executa `php artisan queue:work redis --tries=3`, o que significa que usa o Redis como driver de filas.

### 2.10 Eloquent ORM

**O que é:** Eloquent é o ORM (Object-Relational Mapping) incluído no Laravel. Um ORM permite interagir com a base de dados usando objetos PHP em vez de escrever SQL diretamente.

**Para que serve:** Em vez de escrever `SELECT * FROM posts WHERE user_id = 1`, escrevemos `Post::where('user_id', 1)->get()`. O Eloquent traduz a operação PHP para SQL automaticamente.

**Porque foi utilizada:** É parte integrante do Laravel e simplifica enormemente o acesso à base de dados. Também facilita a definição de relações entre tabelas (um User tem muitos Posts, um Post tem muitos Comments, etc.).

**Exemplo real no projeto:** No modelo `User.php`, as relações são definidas como métodos: `posts()` retorna `$this->hasMany(Post::class)`, o que significa "um utilizador tem muitos posts".

### 2.11 Vite

**O que é:** Vite é uma ferramenta de build para desenvolvimento frontend. É extremamente rápida porque usa módulos ES nativos do browser durante o desenvolvimento.

**Para que serve:** No backend Laravel, o Vite compila assets (CSS, JavaScript) para produção. No frontend Angular, o Angular CLI usa o seu próprio sistema de build.

**Porque foi utilizada:** É a ferramenta padrão do Laravel moderno (substituiu o webpack/mix). O ficheiro `vite.config.js` no backend configura como os assets são compilados.

### 2.12 PHPUnit

**O que é:** PHPUnit é o framework de testes unitários mais popular para PHP. Permite escrever testes automatizados que verificam se o código funciona corretamente.

**Para que serve:** No NzolaNet, PHPUnit é usado para testar funcionalidades como autenticação, criação de posts, likes, comentários, feed, notificações e perfis de utilizador.

**Porque foi utilizada:** É a ferramenta padrão de testes do Laravel. Testes automatizados dão confiança para fazer alterações no código sem quebrar funcionalidades existentes.

**Exemplo real no projeto:** O ficheiro `tests/Feature/AuthTest.php` testa o fluxo completo de registo, login, obtenção do utilizador atual e logout.

---

## 3. Estrutura de Pastas

### 3.1 Visão geral do Backend

```
backend/
├── app/                         ← CÓDIGO PRINCIPAL DA APLICAÇÃO
│   ├── DTOs/                    ← CRIADO PELA EQUIPA
│   ├── Enums/                   ← CRIADO PELA EQUIPA
│   ├── Events/                  ← CRIADO PELA EQUIPA (pasta padrão Laravel)
│   ├── Http/                    ← PADRÃO LARAVEL
│   │   ├── Controllers/Api/     ← CRIADO PELA EQUIPA
│   │   │   └── Admin/           ← CRIADO PELA EQUIPA
│   │   ├── Middleware/          ← CRIADO PELA EQUIPA (pasta padrão Laravel)
│   │   ├── Requests/            ← CRIADO PELA EQUIPA (pasta padrão Laravel)
│   │   │   ├── Auth/
│   │   │   ├── Comments/
│   │   │   ├── Posts/
│   │   │   └── Users/
│   │   └── Resources/           ← CRIADO PELA EQUIPA (pasta padrão Laravel)
│   ├── Listeners/               ← CRIADO PELA EQUIPA (pasta padrão Laravel)
│   ├── Models/                  ← PADRÃO LARAVEL
│   ├── Policies/                ← CRIADO PELA EQUIPA (pasta padrão Laravel)
│   ├── Providers/               ← PADRÃO LARAVEL
│   ├── Repositories/            ← CRIADO PELA EQUIPA
│   │   ├── Contracts/           ← Interfaces
│   │   └── Eloquent/            ← Implementações
│   └── Services/                ← CRIADO PELA EQUIPA
├── bootstrap/                   ← PADRÃO LARAVEL (inicialização)
├── config/                      ← PADRÃO LARAVEL (configurações)
├── database/                    ← PADRÃO LARAVEL
│   ├── factories/               ← Fábricas para testes
│   ├── migrations/              ← Criação de tabelas
│   └── seeders/                 ← Dados iniciais
├── docker/                      ← CRIADO PELA EQUIPA
│   ├── nginx/default.conf
│   └── entrypoint.sh
├── docs/                        ← CRIADO PELA EQUIPA
│   └── openapi/nzolanet.yaml
├── public/                      ← PADRÃO LARAVEL (ponto de entrada)
├── resources/                   ← PADRÃO LARAVEL (views, assets)
├── routes/                      ← PADRÃO LARAVEL
│   └── api.php                  ← Todas as rotas da API
├── storage/                     ← PADRÃO LARAVEL (ficheiros, logs, cache)
├── tests/                       ← PADRÃO LARAVEL
│   ├── Feature/                 ← Testes de integração
│   └── Unit/                    ← Testes unitários
├── composer.json                ← Dependências PHP
├── docker-compose.yml           ← Configuração Docker
├── Dockerfile                   ← Build do container PHP
├── phpunit.xml                  ← Configuração de testes
└── vite.config.js               ← Build de assets
```

### 3.2 Explicação detalhada de cada pasta da equipa

**app/DTOs/ — Data Transfer Objects**

Finalidade: Transportar dados entre camadas da aplicação de forma estruturada e tipo-segura.

Responsabilidade: Cada DTO é uma classe `readonly` (imutável) que define exatamente quais campos são necessários para uma operação específica. Isto evita que se passem arrays sem estrutura definida entre camadas.

Quem usa: Os Controllers criam DTOs a partir dos dados do Request.
Quem chama: Os Controllers chamam o método estático `fromRequest()` dos DTOs.
Quem é chamado: Os DTOs são passados como argumento para os Services.
Porque existe: Sem DTOs, passaríamos arrays genéricos entre camadas, perdendo a segurança de tipos e a clareza sobre que dados são necessários.

Ficheiros:
- `CreatePostDTO.php` — Dados para criar uma publicação (userId, content, image, video)
- `UpdatePostDTO.php` — Dados para atualizar uma publicação
- `CreateCommentDTO.php` — Dados para criar um comentário
- `UpdateCommentDTO.php` — Dados para atualizar um comentário
- `RegisterUserDTO.php` — Dados de registo (name, email, password)
- `UpdateUserDTO.php` — Dados de atualização de perfil (name, bio, isPrivate)
- `FollowUserDTO.php` — Par de IDs para seguir utilizador (followerId, followingId)
- `NotificationDTO.php` — Dados de notificação (recipientId, senderId, type, data)

**app/Services/ — Camada de Lógica de Negócio**

Finalidade: Conter toda a lógica de negócio da aplicação, separada dos controllers e da base de dados.

Responsabilidade: Cada Service contém as regras que definem como o sistema deve comportar-se. Por exemplo, o LikeService verifica se o utilizador já deu baze antes de permitir um novo; o UserService verifica se o perfil é privado antes de mostrar dados.

Quem usa: Os Controllers chamam métodos dos Services.
Quem chama: Os Controllers.
Quem é chamado: Os Services chamam os Repositories para aceder à base de dados, e disparam Events quando ações importantes acontecem.
Porque existe: Sem Services, a lógica de negócio ficaria nos Controllers, tornando-os enormes e impossíveis de testar isoladamente.

Ficheiros:
- `AuthService.php` — Login, registo, logout, refresh de token, recuperação de senha
- `PostService.php` — Criar, atualizar, apagar, listar publicações. Gere upload de ficheiros
- `CommentService.php` — Criar, atualizar, apagar comentários. Dispara evento CommentCreated
- `LikeService.php` — Dar/remover baze. Impede bazes duplicados. Dispara evento PostLiked
- `UserService.php` — Perfil, seguir/deixar de seguir. Dispara evento UserFollowed
- `FeedService.php` — Feed global e feed de utilizadores seguidos
- `NotificationService.php` — Criar e listar notificações, marcar como lida

**app/Repositories/ — Camada de Acesso a Dados**

Finalidade: Isolar todo o código de acesso à base de dados numa camada dedicada.

Responsabilidade: Os Repositories são os únicos que "falam" com a base de dados. Contêm queries Eloquent (consultas à base de dados). Os Services nunca interagem diretamente com os Models para fazer queries — pedem ao Repository.

A pasta está dividida em duas subpastas:
- `Contracts/` — Contém as interfaces (contratos) que definem quais métodos devem existir
- `Eloquent/` — Contém as implementações concretas usando o Eloquent ORM

Quem usa: Os Services chamam métodos dos Repositories.
Quem chama: Os Services.
Quem é chamado: Os Repositories chamam os Models do Eloquent.
Porque existe: Esta separação permite trocar a implementação da base de dados sem alterar nenhum Service. Hoje usa Eloquent/MySQL; amanhã poderia usar MongoDB ou uma API externa, bastando criar novas implementações das mesmas interfaces.

**app/Events/ — Eventos do Sistema**

Finalidade: Representar "coisas que aconteceram" no sistema.

Responsabilidade: Cada Event é uma classe simples que carrega dados sobre algo que ocorreu. Não contém lógica — apenas dados.

Quem usa: Os Services disparam eventos com `event(new PostLiked(...))`.
Quem é chamado: Os Listeners escutam esses eventos.
Porque existe: Permite desacoplar ações. O LikeService não precisa saber que existe um sistema de notificações — apenas anuncia "aconteceu um like" e quem quiser reagir, reage.

Ficheiros:
- `PostLiked.php` — Alguém deu baze numa publicação (senderId, postId, recipientId)
- `CommentCreated.php` — Alguém comentou numa publicação (commentId, senderId, recipientId)
- `UserFollowed.php` — Alguém começou a seguir outro utilizador (followerId, followingId)

**app/Listeners/ — Reações a Eventos**

Finalidade: Executar ações em resposta a eventos.

Responsabilidade: Cada Listener "escuta" um evento específico e executa uma ação quando esse evento ocorre. No NzolaNet, todos os Listeners criam notificações.

Quem usa: O sistema de eventos do Laravel chama os Listeners automaticamente.
Quem chama: O Laravel invoca o método `handle()` quando o evento correspondente é disparado.
Porque existe: Permite adicionar novas reações a eventos sem modificar o código que dispara o evento.

Ficheiros:
- `CreateLikeNotification.php` — Escuta PostLiked → cria notificação para o dono do post
- `CreateCommentNotification.php` — Escuta CommentCreated → cria notificação
- `CreateFollowNotification.php` — Escuta UserFollowed → cria notificação para o seguido

**app/Enums/ — Enumerações**

Finalidade: Definir conjuntos fixos de valores possíveis.

Ficheiros:
- `NotificationType.php` — Tipos de notificação: Follow, Like, Comment
- `UserRole.php` — Papéis do utilizador: Admin, User

### 3.3 Visão geral do Frontend

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/            ← Componentes reutilizáveis
│   │   │   ├── avatar-utilizador/
│   │   │   ├── barra-navegacao/
│   │   │   ├── cabecalho/
│   │   │   ├── cartao-publicacao/
│   │   │   ├── menu-lateral/
│   │   │   └── modal/
│   │   ├── guards/                ← Proteção de rotas
│   │   │   └── auth.guard.ts
│   │   ├── interceptors/          ← Interceptação de HTTP
│   │   │   └── auth.interceptor.ts
│   │   ├── models/                ← Interfaces TypeScript
│   │   │   ├── fase1.model.ts     ← Modelos para API real
│   │   │   └── nzolanet.model.ts  ← Modelos para dados demo
│   │   ├── pages/                 ← Páginas da aplicação
│   │   │   ├── feed/
│   │   │   ├── entrar/
│   │   │   ├── registo/
│   │   │   ├── perfil-utilizador/
│   │   │   ├── criar-post/
│   │   │   ├── comentarios/
│   │   │   ├── notificacoes/
│   │   │   └── ...
│   │   ├── services/              ← Serviços Angular (chamadas HTTP)
│   │   │   ├── auth.service.ts
│   │   │   ├── post.service.ts
│   │   │   ├── comment.service.ts
│   │   │   ├── user.service.ts
│   │   │   └── nzolanet-dados.service.ts
│   │   ├── app.routes.ts          ← Configuração de rotas
│   │   └── app.html
│   └── pages_exportadas/          ← Protótipos HTML estáticos
├── package.json
├── angular.json
└── tsconfig.json
```

---

## 4. Explicação da Arquitetura

### 4.1 Controllers — A porta de entrada

Os Controllers no NzolaNet são classes que recebem pedidos HTTP e devolvem respostas JSON. Residem em `app/Http/Controllers/Api/`.

O que fazem:
- Recebem o pedido HTTP (já validado pelo FormRequest)
- Criam um DTO com os dados do pedido
- Delegam a lógica ao Service correspondente
- Envolvem o resultado num Resource para formatar a resposta
- Devolvem a resposta JSON padronizada

O que NÃO devem fazer:
- Conter lógica de negócio (isso pertence aos Services)
- Aceder diretamente à base de dados (isso pertence aos Repositories)
- Validar dados (isso pertence aos FormRequests)

Todos os controllers estendem `ApiController`, que fornece os métodos auxiliares `success()` e `noContent()` para padronizar as respostas.

Exemplo real — `PostController@store`:
```php
public function store(StorePostRequest $request): JsonResponse
{
    return $this->success(
        new PostResource($this->posts->create(CreatePostDTO::fromRequest($request))),
        'Publicacao criada com sucesso',
        201
    );
}
```
Repare como o Controller é "magro": recebe o request já validado, cria um DTO, chama o service, envolve num Resource, e devolve. Três linhas de código.

### 4.2 Services — O cérebro do sistema

Os Services contêm as regras de negócio. São o "como" e "quando" das operações.

Porque existem: Imagine que amanhã é preciso que, ao criar uma publicação, o sistema também verifique palavras proibidas e atribua uma categoria automática. Se a lógica estiver no Controller, teremos de modificar o Controller. Se estiver no Service, o Controller permanece intacto — a mudança fica contida no Service, que é mais fácil de testar.

Qual problema resolvem: Separação de responsabilidades. O Controller sabe "o que fazer" (receber pedido, devolver resposta). O Service sabe "como fazer" (aplicar regras, coordenar operações).

Exemplo real — `LikeService@like`:
```php
public function like(int $userId, Post $post): int
{
    // REGRA DE NEGÓCIO: impedir bazes duplicados
    if ($this->likes->exists($userId, $post->id)) {
        throw ValidationException::withMessages([
            'post' => ['Este utilizador ja deu baze nesta publicacao.'],
        ]);
    }

    // Criar o baze
    $this->likes->create($userId, $post->id);

    // REGRA DE NEGÓCIO: não notificar se o baze é no próprio post
    if ($post->user_id !== $userId) {
        event(new PostLiked($userId, $post->id, $post->user_id));
    }

    return $this->likes->countForPost($post->id);
}
```

### 4.3 Repositories — O mensageiro da base de dados

Os Repositories isolam todo o acesso à base de dados. Cada Repository implementa uma interface (contrato) que define os métodos disponíveis.

Porque foram criados: O enunciado exigia "arquitetura de separação de camadas com Repositórios". Além disso, os Repositories permitem testar os Services sem precisar de uma base de dados real — basta criar uma implementação "falsa" (mock) do Repository para testes.

Vantagens:
- Código de acesso a dados centralizado num único lugar
- Facilidade de teste (pode-se substituir por mocks)
- Possibilidade de trocar a tecnologia de base de dados
- Reutilização de queries complexas

Diferença para usar Model diretamente: Sem Repositories, o código `Post::where('user_id', $userId)->latest()->paginate()` estaria espalhado pelos Services. Se amanhã for preciso adicionar um cache ou mudar a query, teria de se procurar e alterar em vários lugares. Com Repositories, a query está num único lugar.

Exemplo real — Interface vs Implementação:
```php
// Interface (Contrato) — define O QUE deve ser possível fazer
interface PostRepositoryInterface {
    public function create(array $data): Post;
    public function findOrFail(int $id): Post;
    public function recent(int $perPage): LengthAwarePaginator;
}

// Implementação — define COMO fazer (usando Eloquent)
class EloquentPostRepository implements PostRepositoryInterface {
    public function recent(int $perPage): LengthAwarePaginator {
        return Post::query()
            ->with(['user'])
            ->withCount(['likes', 'comments'])
            ->latest()
            ->paginate($perPage);
    }
}
```

A ligação entre a interface e a implementação é feita no `AppServiceProvider.php`:
```php
$this->app->bind(PostRepositoryInterface::class, EloquentPostRepository::class);
```
Isto diz ao Laravel: "Quando alguém pedir um PostRepositoryInterface, dá-lhe um EloquentPostRepository."

### 4.4 DTOs — O formulário padronizado

DTO significa Data Transfer Object — é um objeto simples cuja única função é transportar dados entre camadas.

O que é: Uma classe `readonly` (imutável após criação) com propriedades públicas tipadas. Não contém lógica de negócio — apenas dados.

Porque utilizar: Sem DTOs, passaríamos arrays sem estrutura: `$service->create($request->all())`. Isto é perigoso porque não sabemos que campos existem no array, podem vir campos extras, e não há validação de tipos. Com DTOs, sabemos exatamente o que é transportado: `CreatePostDTO(userId: int, content: string, image: ?UploadedFile, video: ?UploadedFile)`.

Fluxo dos dados com DTOs:
```
Request HTTP (dados brutos)
       ↓
FormRequest (validação)
       ↓
DTO::fromRequest() (estruturação)
       ↓
Service (lógica de negócio)
       ↓
Repository (persistência)
```

### 4.5 Models — O espelho da base de dados

Os Models representam tabelas da base de dados como classes PHP. Cada instância de um Model corresponde a uma linha da tabela.

No NzolaNet existem 5 Models:
- `User` — Tabela `users`. Representa um utilizador. Tem relações com posts, comments, likes, followers, following, e notifications.
- `Post` — Tabela `posts`. Representa uma publicação. Pertence a um user, tem muitos likes e comments.
- `Comment` — Tabela `comments`. Pertence a um user e a um post.
- `Like` — Tabela `likes`. Pertence a um user e a um post.
- `Notification` — Tabela `notifications`. Pertence a um recipient (destinatário) e a um sender (remetente).

Cada Model define `$fillable` (campos que podem ser preenchidos em massa), relações (`hasMany`, `belongsTo`, `belongsToMany`), e casts (conversão automática de tipos).

### 4.6 Policies — O guarda de segurança

As Policies definem regras de autorização: quem pode fazer o quê.

No NzolaNet existem 2 Policies:
- `PostPolicy` — Define que apenas o autor pode editar um post. Para apagar, o autor ou um admin podem.
- `CommentPolicy` — Mesma lógica: apenas o autor pode editar, mas o autor ou admin pode apagar.

Exemplo real:
```php
class PostPolicy {
    public function update(User $user, Post $post): bool {
        return $user->id === $post->user_id; // Só o autor
    }
    public function delete(User $user, Post $post): bool {
        return $user->id === $post->user_id || $user->isAdmin(); // Autor OU admin
    }
}
```

Nos Controllers, a verificação é feita com `$this->authorize('update', $post)`. Se falhar, o Laravel automaticamente devolve uma resposta 403 Forbidden.

### 4.7 Middleware — O filtro de entrada

Middleware é código que é executado antes (ou depois) do pedido chegar ao Controller. Funciona como um filtro ou porteiro.

No NzolaNet existem 2 tipos de Middleware:
- `auth:sanctum` — Middleware do Sanctum que verifica se o utilizador está autenticado. Presente na maioria das rotas.
- `AdminMiddleware` — Verifica se o utilizador é administrador. Usado nas rotas de administração (`/api/admin/*`).

### 4.8 Resources — O estilista da resposta

Os Resources transformam Models em arrays JSON formatados para o frontend. Controlam exatamente quais campos são enviados e como.

No NzolaNet existem 4 Resources:
- `PostResource` — Transforma um Post em JSON com campos como `id`, `author`, `content`, `image_url`, `video_url`, `likes_count`, `comments_count`, `liked_by_me`, `can_update`, `can_delete`.
- `UserResource` — Transforma um User, incluindo `profile_photo_url`, contagens de seguidores, e oculta o email para outros utilizadores.
- `CommentResource` — Transforma um Comment com permissões `can_update` e `can_delete`.
- `NotificationResource` — Transforma uma Notification com dados do sender e estado de leitura.

### 4.9 Requests — O porteiro da validação

Os FormRequests validam os dados recebidos antes de chegarem ao Controller. Se a validação falhar, o Laravel automaticamente devolve uma resposta 422 com os erros.

Exemplos:
- `StorePostRequest` — content obrigatório (max 5000 chars), image opcional (max 8MB), video opcional (max 50MB, formatos mp4/webm/mov/avi)
- `RegisterRequest` — name obrigatório, email único, password min 8 chars com confirmação
- `LoginRequest` — email e password obrigatórios

---

## 5. Fluxo de Funcionalidades Reais

### 5.1 Funcionalidade: Dar Baze (Like) numa Publicação

```
┌─────────────────────────────────────────────────────────────┐
│ PASSO 1: Utilizador clica no botão "Baze" no frontend      │
│                                                             │
│ O Angular chama PostService.likePost(postId)                │
│ que faz: POST http://localhost:8000/api/posts/42/like       │
│ com Header: Authorization: Bearer eyJ...                    │
└────────────────────────┬────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ PASSO 2: Middleware auth:sanctum                            │
│                                                             │
│ Verifica o token Bearer no cabeçalho.                       │
│ Busca o token na tabela personal_access_tokens.             │
│ Associa o utilizador ao request ($request->user()).         │
│ Se token inválido → 401 Unauthorized                        │
└────────────────────────┬────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ PASSO 3: Router (api.php)                                   │
│                                                             │
│ A rota POST /posts/{post}/like aponta para                  │
│ LikeController@store                                        │
│ O Laravel resolve {post} para o Model Post (Route Binding)  │
└────────────────────────┬────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ PASSO 4: LikeController@store                              │
│                                                             │
│ public function store(Request $request, Post $post)         │
│ {                                                           │
│     return $this->success([                                 │
│         'likes_count' => $this->likes->like(                │
│             $request->user()->id, $post                     │
│         ),                                                  │
│     ], 'Baze adicionada com sucesso', 201);                 │
│ }                                                           │
│                                                             │
│ O Controller é "magro": pega o userId do request,           │
│ passa o post, e delega ao Service.                          │
└────────────────────────┬────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ PASSO 5: LikeService@like                                  │
│                                                             │
│ 5a. Verifica se já existe baze:                             │
│     $this->likes->exists($userId, $post->id)               │
│     Se SIM → throw ValidationException                     │
│              "Este utilizador ja deu baze nesta publicacao" │
│                                                             │
│ 5b. Cria o baze:                                           │
│     $this->likes->create($userId, $post->id)               │
│                                                             │
│ 5c. Verifica se o baze é no próprio post:                  │
│     if ($post->user_id !== $userId)                        │
│         Dispara evento: event(new PostLiked(...))           │
│     (Não faz sentido notificar-se a si mesmo)               │
│                                                             │
│ 5d. Retorna a contagem atualizada de bazes                 │
└────────────────────────┬────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ PASSO 6: EloquentLikeRepository@create                     │
│                                                             │
│ Like::query()->firstOrCreate([                              │
│     'user_id' => $userId,                                   │
│     'post_id' => $postId,                                   │
│ ]);                                                         │
│                                                             │
│ firstOrCreate é idempotente: se já existir, retorna o       │
│ existente sem criar duplicado (segunda camada de proteção)  │
└────────────────────────┬────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ PASSO 7: Evento PostLiked é disparado                      │
│                                                             │
│ O Laravel procura quem escuta este evento                   │
│ (registado no AppServiceProvider):                          │
│ Event::listen(PostLiked::class,                             │
│               CreateLikeNotification::class);               │
└────────────────────────┬────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ PASSO 8: Listener CreateLikeNotification@handle            │
│                                                             │
│ $this->notifications->create(new NotificationDTO(          │
│     recipientId: $event->recipientId,                      │
│     senderId: $event->senderId,                            │
│     type: NotificationType::Like,                          │
│     data: ['post_id' => ...,                               │
│            'message' => 'A sua publicacao recebeu um baze']│
│ ));                                                         │
│                                                             │
│ Cria uma notificação na tabela notifications               │
│ O dono do post verá esta notificação ao consultar           │
│ /api/notifications                                          │
└────────────────────────┬────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ PASSO 9: Resposta regressa ao Angular                      │
│                                                             │
│ HTTP 201 Created                                            │
│ {                                                           │
│   "success": true,                                          │
│   "message": "Baze adicionada com sucesso",                │
│   "data": { "likes_count": 129 }                           │
│ }                                                           │
│                                                             │
│ O Angular atualiza o contador de bazes na interface         │
│ e muda o ícone para "baze dado".                           │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Funcionalidade: Login

1. Angular envia POST `/api/auth/login` com `{ email, password }`
2. `LoginRequest` valida que email e password estão presentes
3. `AuthController@login` chama `AuthService->login(email, password)`
4. `AuthService` procura o utilizador pelo email na base de dados
5. `Hash::check()` compara a password fornecida com o hash guardado
6. Se inválido → throw ValidationException com "credenciais inválidas"
7. Se válido → `$user->createToken('nzolanet-api')` gera um token Sanctum
8. O token é guardado na tabela `personal_access_tokens` (com hash)
9. Resposta com user + access_token + token_type é devolvida
10. Angular guarda o token no localStorage e redireciona para o feed

### 5.3 Funcionalidade: Criar Publicação

1. Angular envia POST `/api/posts` com FormData (content + image/video opcionais)
2. `StorePostRequest` valida: content obrigatório (max 5000), image (max 8MB), video (max 50MB)
3. `PostController@store` cria `CreatePostDTO::fromRequest($request)`
4. O DTO extrai userId do `$request->user()`, content, image file, video file
5. `PostService@create` guarda a imagem em `storage/posts/images/` se existir
6. Guarda o vídeo em `storage/posts/videos/` se existir
7. `EloquentPostRepository@create` executa `Post::create([...])` na base de dados
8. `PostResource` formata a resposta com URLs completas para imagem/vídeo
9. HTTP 201 com o post criado é devolvido ao Angular

### 5.4 Funcionalidade: Comentar

1. Angular envia POST `/api/posts/42/comments` com `{ content }`
2. `StoreCommentRequest` valida: content obrigatório (max 2000)
3. `CommentController@store` cria `CreateCommentDTO::fromRequest($request, $post->id)`
4. `CommentService@create` cria o comentário via Repository
5. Se o autor do comentário NÃO é o dono do post → dispara `CommentCreated`
6. `CreateCommentNotification` escuta o evento e cria notificação
7. `CommentResource` formata a resposta com dados do autor e permissões
8. HTTP 201 devolvido ao Angular

### 5.5 Funcionalidade: Seguir Utilizador

1. Angular envia POST `/api/users/5/follow`
2. `UserController@follow` cria `FollowUserDTO(request->user()->id, 5)`
3. `UserService@follow` verifica que não é auto-follow (não pode seguir a si mesmo)
4. Verifica se já segue (se sim, ignora silenciosamente)
5. `EloquentUserRepository@follow` faz `$user->following()->syncWithoutDetaching([5])`
6. Dispara evento `UserFollowed`
7. `CreateFollowNotification` cria notificação "Novo seguidor na NzolaNet"
8. Resposta 200 OK devolvida

---

## 6. Banco de Dados

### 6.1 Tabelas e seus propósitos

```
┌─────────────────────────────────────────────────────────────┐
│                       TABELAS PRINCIPAIS                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  users                  posts                 comments      │
│  ├── id (PK)            ├── id (PK)           ├── id (PK)  │
│  ├── name               ├── user_id (FK)      ├── user_id  │
│  ├── email (UNIQUE)     ├── content           ├── post_id  │
│  ├── password           ├── image_path        ├── content  │
│  ├── profile_photo      ├── video_path        └── timestamps│
│  ├── bio                └── timestamps                      │
│  ├── is_private                                             │
│  ├── role               likes                 notifications │
│  └── timestamps          ├── id (PK)          ├── id (PK)  │
│                          ├── user_id (FK)     ├── recipient │
│  followers               ├── post_id (FK)     ├── sender   │
│  ├── id (PK)             └── timestamps       ├── type     │
│  ├── follower_id (FK)                         ├── data     │
│  ├── following_id (FK)                        ├── is_read  │
│  └── timestamps                               └── timestamps│
│                                                             │
│  personal_access_tokens  password_reset_tokens              │
│  (Sanctum tokens)        (Reset de senha)                   │
│                                                             │
│  cache / sessions / jobs                                    │
│  (Infraestrutura Laravel)                                   │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Relacionamentos e Cardinalidade

```
User (1) ───────── (N) Post
  "Um utilizador tem muitas publicações"
  "Uma publicação pertence a um utilizador"
  FK: posts.user_id → users.id

User (1) ───────── (N) Comment
  "Um utilizador tem muitos comentários"
  FK: comments.user_id → users.id

Post (1) ───────── (N) Comment
  "Uma publicação tem muitos comentários"
  FK: comments.post_id → posts.id

User (1) ───────── (N) Like
  "Um utilizador tem muitos bazes"
  FK: likes.user_id → users.id

Post (1) ───────── (N) Like
  "Uma publicação tem muitos bazes"
  FK: likes.post_id → posts.id
  UNIQUE(user_id, post_id) ← impede baze duplicado

User (N) ───────── (N) User  [Auto-relação via tabela 'followers']
  "Um utilizador segue muitos utilizadores"
  "Um utilizador é seguido por muitos utilizadores"
  Tabela pivot: followers
    FK: followers.follower_id → users.id
    FK: followers.following_id → users.id
    UNIQUE(follower_id, following_id)

User (1) ───────── (N) Notification (como recipient)
  "Um utilizador recebe muitas notificações"
  FK: notifications.recipient_id → users.id

User (1) ───────── (N) Notification (como sender)
  "Um utilizador envia muitas notificações"
  FK: notifications.sender_id → users.id (NULLABLE)
```

### 6.3 Diagrama ER textual

```
                    ┌──────────────┐
                    │    users     │
                    ├──────────────┤
            ┌───────│ id (PK)      │───────┐
            │       │ name         │       │
            │       │ email        │       │
            │       │ password     │       │
            │       │ profile_photo│       │
            │       │ bio          │       │
            │       │ is_private   │       │
            │       │ role         │       │
            │       └──────────────┘       │
            │              │               │
            │    ┌─────────┼─────────┐     │
            │    │         │         │     │
            ▼    ▼         ▼         ▼     ▼
     ┌──────────┐  ┌──────────┐  ┌────────────────┐
     │followers │  │  posts   │  │ notifications  │
     ├──────────┤  ├──────────┤  ├────────────────┤
     │follower  │  │ id (PK)  │  │ id (PK)        │
     │following │  │ user_id  │  │ recipient_id   │
     └──────────┘  │ content  │  │ sender_id      │
                   │ image    │  │ type            │
                   │ video    │  │ data            │
                   └──────────┘  │ is_read         │
                        │        └────────────────┘
              ┌─────────┼─────────┐
              │                   │
              ▼                   ▼
       ┌──────────┐        ┌──────────┐
       │  likes   │        │ comments │
       ├──────────┤        ├──────────┤
       │ id (PK)  │        │ id (PK)  │
       │ user_id  │        │ user_id  │
       │ post_id  │        │ post_id  │
       └──────────┘        │ content  │
                           └──────────┘
```

### 6.4 Chaves estrangeiras e integridade

Todas as chaves estrangeiras usam `cascadeOnDelete()`, o que significa que se um utilizador for apagado, todos os seus posts, comentários, likes, relações de seguimento e notificações são automaticamente apagados pela base de dados. Para o `sender_id` das notificações, usa-se `nullOnDelete()` — se o remetente for apagado, a notificação mantém-se mas o sender fica null.

A constraint `UNIQUE(['user_id', 'post_id'])` na tabela `likes` garante ao nível da base de dados que um utilizador não pode dar dois bazes no mesmo post. Mesmo que o código PHP falhasse essa verificação, a base de dados recusaria a duplicação.

---

## 7. Sistema de Eventos

### 7.1 O que é Event Driven Architecture

Arquitetura orientada a eventos é um padrão de design onde componentes do sistema comunicam através de "eventos" — anúncios de que algo aconteceu. Em vez de um componente chamar diretamente outro, ele simplesmente anuncia o evento e qualquer componente interessado pode reagir.

Analogia do mundo real: Imagine uma escola. Quando o sino toca (evento), os alunos sabem que é hora do intervalo (reação 1), os professores sabem que devem parar a aula (reação 2), e o cantineiro sabe que deve preparar os lanches (reação 3). O sino não precisa de saber quem vai reagir — apenas toca.

### 7.2 Eventos no NzolaNet

O NzolaNet usa 3 eventos, todos ligados ao sistema de notificações:

```
┌──────────────────┐    dispara    ┌──────────────────────────┐    cria    ┌──────────────┐
│   LikeService    │──────────────→│       PostLiked           │──────────→│ Notification │
│   like()         │               │ senderId, postId,         │           │ type: "like" │
│                  │               │ recipientId               │           │              │
└──────────────────┘               └──────────────────────────┘           └──────────────┘
                                                │
                                                │ escutado por
                                                ▼
                                   ┌──────────────────────────┐
                                   │ CreateLikeNotification   │
                                   │ (Listener)               │
                                   └──────────────────────────┘

┌──────────────────┐    dispara    ┌──────────────────────────┐    cria    ┌──────────────┐
│ CommentService   │──────────────→│    CommentCreated         │──────────→│ Notification │
│ create()         │               │ commentId, senderId,      │           │type:"comment"│
└──────────────────┘               │ recipientId               │           └──────────────┘
                                   └──────────────────────────┘

┌──────────────────┐    dispara    ┌──────────────────────────┐    cria    ┌──────────────┐
│  UserService     │──────────────→│     UserFollowed          │──────────→│ Notification │
│  follow()        │               │ followerId, followingId   │           │type:"follow" │
└──────────────────┘               └──────────────────────────┘           └──────────────┘
```

### 7.3 Benefícios no NzolaNet

Desacoplamento: O `LikeService` não sabe que existem notificações. Se amanhã quisermos adicionar um email quando alguém recebe um baze, basta criar um novo Listener para o mesmo evento `PostLiked` — sem alterar o LikeService.

Extensibilidade: Podemos adicionar novos comportamentos (enviar email, atualizar estatísticas, registar analytics) apenas criando novos Listeners. O código original permanece intacto.

Testabilidade: Podemos testar o LikeService sem nos preocuparmos com notificações, e testar as notificações independentemente.

### 7.4 Registo dos Eventos

Os eventos são registados no `AppServiceProvider.php`:
```php
Event::listen(UserFollowed::class, CreateFollowNotification::class);
Event::listen(PostLiked::class, CreateLikeNotification::class);
Event::listen(CommentCreated::class, CreateCommentNotification::class);
```

---

## 8. Segurança

### 8.1 Autenticação — Quem é você?

A autenticação verifica a identidade do utilizador. O NzolaNet usa Laravel Sanctum com Personal Access Tokens.

Fluxo de autenticação:
```
1. Utilizador envia email + password
2. AuthService busca utilizador na base de dados
3. Hash::check() compara password com hash BCrypt guardado
4. Se correto → cria token com $user->createToken('nzolanet-api')
5. Token guardado na tabela personal_access_tokens (com hash SHA-256)
6. Token em texto plano enviado ao Angular (uma única vez)
7. Angular guarda no localStorage
8. Em cada pedido, Angular envia: Authorization: Bearer <token>
9. Middleware auth:sanctum verifica o token
```

A password nunca é guardada em texto plano. O Laravel usa BCrypt (hashing unidirecional) — mesmo que alguém aceda à base de dados, não consegue descobrir as passwords.

### 8.2 Autorização — O que pode fazer?

A autorização controla o que cada utilizador pode ou não fazer. O NzolaNet usa Policies e Middleware.

Proteção contra editar posts de outros:
```php
// PostPolicy.php
public function update(User $user, Post $post): bool {
    return $user->id === $post->user_id; // Só o próprio autor
}

// PostController.php
public function update(..., Post $post) {
    $this->authorize('update', $post); // Se falhar → 403 Forbidden
    // ...
}
```

Proteção contra comentar sem login: Todas as rotas de comentários estão dentro do grupo `Route::middleware('auth:sanctum')`, o que significa que qualquer pedido sem token válido recebe automaticamente 401 Unauthorized.

Proteção contra acessar áreas administrativas:
```php
// AdminMiddleware.php
if (! $request->user()?->isAdmin()) {
    abort(403, 'Apenas administradores podem executar esta acao.');
}

// routes/api.php
Route::middleware('admin')->prefix('admin')->group(function () {
    Route::delete('comments/{comment}', [ModerationController::class, 'destroyComment']);
});
```

### 8.3 Perfis Privados

O `UserService@profile` verifica a privacidade:
```php
if ($profile->is_private && $viewer->isNot($profile) 
    && ! $viewer->isAdmin() 
    && ! $this->users->isFollowing($viewer->id, $profile->id)) {
    throw new AuthorizationException('Este perfil e privado.');
}
```
Regra: Perfis privados só são visíveis para o próprio, admins, e seguidores.

### 8.4 Proteção no Frontend

O Angular também tem proteções:
- `authGuard` impede acesso a páginas protegidas sem login (redireciona para `/entrar`)
- `authInterceptor` adiciona automaticamente o token a cada pedido HTTP
- Se receber 401, tenta fazer refresh do token; se falhar, faz logout e redireciona

---

## 9. Testes

### 9.1 Testes Unitários (pasta tests/Unit/)

Testes unitários verificam uma única unidade de código isoladamente, sem base de dados real.

**LikeServiceTest.php** — Verifica que o LikeService bloqueia bazes duplicados antes de chegar à base de dados. Usa Mockery para criar um Repository falso que simula que o baze já existe. É importante porque garante que a regra de negócio funciona independentemente da base de dados.

**EloquentLikeRepositoryTest.php** — Verifica que o método `firstOrCreate` do Repository é idempotente (chamá-lo duas vezes com os mesmos dados cria apenas um registo). Usa RefreshDatabase para ter uma base de dados limpa em cada teste.

### 9.2 Testes Feature (pasta tests/Feature/)

Testes feature testam funcionalidades completas, simulando pedidos HTTP reais.

**AuthTest.php** — Testa o fluxo completo de autenticação: registo → login → obter utilizador → logout. Verifica estrutura das respostas JSON e códigos HTTP.

**PostsTest.php** — Testa que um utilizador autenticado pode criar, editar e apagar os seus posts. Testa que um utilizador NÃO pode editar posts de outros (espera 403).

**CommentsTest.php** — Testa o ciclo completo de comentários: criar → editar → apagar. Testa que um admin pode remover qualquer comentário.

**LikesTest.php** — Testa que: pode dar baze uma vez (201), não pode dar duas vezes (422), pode remover baze (200), pode listar quem deu baze.

**FeedTest.php** — Testa que o feed de seguidos mostra apenas posts de utilizadores seguidos, não de outros.

**UsersTest.php** — Testa atualização de perfil e follow/unfollow. Testa que perfis privados retornam 403 para não-seguidores.

**NotificationsTest.php** — Testa que dar baze cria uma notificação para o dono do post, e que essa notificação pode ser marcada como lida.

---

## 10. Docker

### 10.1 Containers existentes

O `docker-compose.yml` define 6 serviços (containers):

```
┌─────────────────────────────────────────────────────────┐
│                    REDE DOCKER                          │
│                                                         │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐      │
│  │  nginx   │─────→│ php-fpm  │─────→│  mysql   │      │
│  │ :80→8000 │      │ :9000    │      │ :3306    │      │
│  └──────────┘      └──────────┘      │  →3307   │      │
│       ↑                  ↑           └──────────┘      │
│       │                  │                              │
│   Browser            Código                             │
│                     Laravel           ┌──────────┐      │
│                         │             │  redis   │      │
│                         │             │ :6379    │      │
│  ┌──────────┐           ↓             └──────────┘      │
│  │  queue   │←── mesmo código ──→         ↑             │
│  │ worker   │         Laravel             │             │
│  └──────────┘                             │             │
│                                           │             │
│  ┌──────────┐                             │             │
│  │scheduler │    usa Redis para filas ────┘             │
│  └──────────┘                                           │
└─────────────────────────────────────────────────────────┘
```

- **nginx** — Servidor web, porta 80 interna → 8000 externa. Recebe pedidos HTTP e encaminha para PHP-FPM.
- **php-fpm** — Executa o código PHP/Laravel. Porta 9000 (FastCGI). Depende do MySQL e Redis.
- **queue** — Mesmo código PHP, mas executa `php artisan queue:work redis`. Processa tarefas em background.
- **scheduler** — Mesmo código PHP, executa `php artisan schedule:work`. Tarefas agendadas.
- **mysql** — Base de dados MySQL 8.4. Dados persistidos no volume `mysql_data`.
- **redis** — Cache e broker de filas. Redis 7.4.

### 10.2 Como o sistema sobe

```bash
docker compose up -d
```

Sequência:
1. MySQL e Redis sobem primeiro (não dependem de nada)
2. MySQL executa healthcheck (mysqladmin ping) até estar pronto
3. PHP-FPM sobe depois (depende de MySQL healthy e Redis started)
4. Nginx sobe depois do PHP-FPM
5. Queue e Scheduler sobem depois do PHP-FPM
6. O `entrypoint.sh` cria pastas de storage e ajusta permissões

### 10.3 Fluxo de um pedido via Docker

```
Browser (http://localhost:8000)
       ↓
Nginx container (porta 80)
   Lê default.conf
   Pedido .php? → fastcgi_pass php-fpm:9000
       ↓
PHP-FPM container (porta 9000)
   Executa index.php → Laravel bootstrap
   Routes → Middleware → Controller → Service → Repository
       ↓
MySQL container (porta 3306)
   Executa queries SQL
   Retorna dados
       ↓
PHP-FPM monta resposta JSON
       ↓
Nginx devolve ao Browser
```

### 10.4 Dockerfile explicado

O Dockerfile constrói o container PHP-FPM:
- Base: `php:8.3-fpm` (PHP 8.3 com FastCGI Process Manager)
- Instala extensões PHP: bcmath, exif, gd (processamento de imagens), intl, opcache, pcntl, pdo_mysql, zip, redis
- Copia o Composer do container oficial
- Instala dependências PHP via Composer
- Copia o código da aplicação
- Configura permissões de storage
- Expõe porta 9000 para FastCGI

---

## 11. OpenAPI / Swagger

### 11.1 O que é

OpenAPI (anteriormente Swagger) é uma especificação para descrever APIs REST de forma padronizada. É um ficheiro YAML/JSON que documenta todos os endpoints, parâmetros, respostas, e esquemas de dados da API.

### 11.2 Porque existe

A documentação OpenAPI serve como um "contrato" entre frontend e backend. O developer Angular pode consultar o ficheiro para saber exatamente que endpoints existem, que dados enviar, e que resposta esperar — sem precisar ler o código PHP.

### 11.3 Localização no projeto

O ficheiro está em `backend/docs/openapi/nzolanet.yaml`. Define:
- URL base: `http://localhost:8000/api`
- Autenticação: Bearer Token (bearerAuth)
- Tags: Auth, Users, Posts, Likes, Comments, Feed, Notifications, Admin
- Todos os endpoints com schemas de request e response

### 11.4 Exemplo do ficheiro

O ficheiro define endpoints como:
```yaml
/auth/login:
  post:
    tags: [Auth]
    security: []          # Não requer autenticação
    requestBody:
      schema:
        $ref: '#/components/schemas/LoginRequest'
    responses:
      '200':
        schema:
          $ref: '#/components/schemas/AuthResponse'
```

A rota raiz da API (`GET /api/`) inclui um link para a documentação:
```php
'documentation' => url('/docs'),
'openapi' => url('/docs/openapi.yaml'),
```

---

## 12. Dependências

### 12.1 Backend — composer.json

**Dependências de produção:**

- `laravel/framework ^12.0` — O próprio Laravel. Base de toda a aplicação. Sem ele, nada funciona.
- `laravel/sanctum ^4.3` — Sistema de autenticação via tokens. Sem ele, não haveria login/logout nem proteção de rotas.
- `laravel/tinker ^2.10.1` — REPL (console interativo) para Laravel. Permite executar código PHP diretamente no terminal para debugging. Não é essencial em produção, mas muito útil em desenvolvimento.

**Dependências de desenvolvimento:**

- `fakerphp/faker ^1.23` — Gera dados falsos realistas para testes (nomes, emails, textos). Usado nas factories para criar utilizadores e posts fictícios nos testes.
- `laravel/pail ^1.2.2` — Visualizador de logs em tempo real no terminal. Facilita debugging.
- `laravel/pint ^1.24` — Formatador de código PHP. Garante estilo consistente no código da equipa.
- `laravel/sail ^1.41` — Ambiente Docker simplificado para Laravel (alternativo ao docker-compose manual).
- `mockery/mockery ^1.6` — Criação de mocks (objetos falsos) para testes unitários. Usado no LikeServiceTest para simular o Repository.
- `nunomaduro/collision ^8.6` — Melhor formatação de erros no terminal. Torna os stack traces mais legíveis.
- `phpunit/phpunit ^11.5.50` — Framework de testes. Executa todos os testes automatizados do projeto.

### 12.2 Backend — package.json

- `tailwindcss` e `@tailwindcss/vite` — Framework CSS utilitário (para views blade do Laravel, se existirem).
- `axios` — Cliente HTTP para JavaScript. Pode ser usado em scripts de build.
- `concurrently` — Permite executar vários comandos em paralelo. Usado no script `dev` para iniciar servidor, queue, logs e vite simultaneamente.
- `laravel-vite-plugin` — Integra o Vite com o Laravel para compilação de assets.
- `vite` — Ferramenta de build para assets frontend.

### 12.3 Frontend — package.json

**Dependências de produção:**

- `@angular/common`, `@angular/compiler`, `@angular/core`, `@angular/forms`, `@angular/platform-browser`, `@angular/router` — Módulos core do Angular. Sem eles, a aplicação Angular não existe.
- `@angular/platform-server`, `@angular/ssr` — Suporte para Server-Side Rendering (renderização no servidor).
- `express` — Servidor Node.js para SSR.
- `rxjs` — Biblioteca de programação reativa. Fundamental para o Angular — todos os pedidos HTTP, eventos, e fluxos de dados usam Observables do RxJS.
- `tslib` — Helpers do TypeScript. Necessário para compilação.

**Dependências de desenvolvimento:**

- `@angular/build`, `@angular/cli`, `@angular/compiler-cli` — Ferramentas de build e CLI do Angular.
- `typescript` — Linguagem na qual o Angular é escrito. Compila para JavaScript.
- `vitest` — Framework de testes para o frontend.
- `prettier` — Formatador de código.

---

## 13. Mapa Mental do Projeto

```
                              NzolaNet
                                 │
            ┌────────────────────┼────────────────────┐
            │                    │                     │
        FRONTEND             BACKEND               DOCKER
        (Angular)            (Laravel)           (Containers)
            │                    │                     │
     ┌──────┼──────┐      ┌─────┼──────┐        ┌─────┼─────┐
     │      │      │      │     │      │        │     │     │
   Pages  Services Guards Controllers  │      nginx php-fpm mysql
     │      │      │      │     │      │        │           │
  ┌──┼──┐   │    auth   Auth  Post   Comment   proxy      dados
  │  │  │   │   guard     │     │      │       reverso
 feed │  │  │            Like Feed  User
 login│  │  │             │           │
perfil│  │  ├─ auth.service    Services
      │  │  ├─ post.service      │
notif │  │  ├─ user.service   ┌──┼──┐
      │  │  └─ comment.serv.  │  │  │
   criar │              Auth Post Like
   post  │              Comment Feed User
         │              Notification
     Components              │
         │              Repositories
    ┌────┼────┐              │
    │    │    │         ┌────┼────┐
  card avatar barra    Contracts  Eloquent
  pub.  user  navig.     │           │
                    Interfaces  Implementações
                                     │
                               ┌─────┼─────┐
                               │     │     │
                             Models DTOs  Events
                               │     │      │
                          ┌────┼──┐  │   ┌──┼──┐
                          │    │  │  │   │  │  │
                        User Post │  │ Post Comment
                        Comment   │  │ Liked Created
                        Like   Notif │        │
                               ication│   UserFollowed
                                     │
                               Listeners
                                  │
                             ┌────┼────┐
                             │    │    │
                           Like Comment Follow
                           Notif Notif  Notif

                          ┌──────────┐
                          │ Database │
                          ├──────────┤
                          │ users    │
                          │ posts    │
                          │ comments │
                          │ likes    │
                          │ followers│
                          │ notific. │
                          │ tokens   │
                          └──────────┘

                          ┌──────────┐
                          │ Security │
                          ├──────────┤
                          │ Sanctum  │
                          │ Policies │
                          │ Middlew. │
                          │ Guards   │
                          │ Intercep.│
                          └──────────┘

                          ┌──────────┐
                          │  Tests   │
                          ├──────────┤
                          │ Auth     │
                          │ Posts    │
                          │ Comments │
                          │ Likes    │
                          │ Feed     │
                          │ Users    │
                          │ Notific. │
                          │ Unit     │
                          └──────────┘

                          ┌──────────┐
                          │   Docs   │
                          ├──────────┤
                          │ OpenAPI  │
                          │ Swagger  │
                          └──────────┘
```

---

## 14. Explicação para Iniciantes

Imaginem que a NzolaNet é uma empresa física — um escritório real com pessoas a trabalhar.

### O Edifício (Docker)

O Docker é como o edifício onde a empresa funciona. Em vez de ter tudo numa sala só, o edifício tem divisões separadas: uma receção (Nginx), um escritório principal (PHP-FPM), um arquivo (MySQL), e uma sala de correio rápido (Redis). O `docker-compose.yml` é a planta do edifício — descreve quantas divisões existem e como se ligam.

### A Receção (Nginx)

O Nginx é a receção do edifício. Todos os visitantes (pedidos HTTP) entram pela receção. A recepcionista olha para o pedido e decide: se é algo simples (um ficheiro estático como uma imagem), entrega diretamente. Se é algo que requer processamento, encaminha para o escritório principal (PHP-FPM).

### O Escritório Principal (Laravel/PHP-FPM)

O Laravel é o escritório onde o trabalho real acontece. Dentro deste escritório, existem vários departamentos:

**A Portaria (Middleware)** — Antes de alguém entrar no escritório, passa pela portaria. O segurança (auth:sanctum) verifica o cartão de identificação (token). Se não tiver cartão, é mandado embora (401). Se tiver, entra. Há também um segurança especial (AdminMiddleware) para a sala do diretor — só entra quem for administrador.

**A Rececionista Interna (Routes)** — Depois de passar pela portaria, a rececionista interna (routes/api.php) olha para o que a pessoa quer e encaminha para o departamento certo. "Quer publicar algo? Vá ao departamento de Publicações (PostController)."

**O Formulário de Entrada (FormRequest)** — Antes de ser atendido em qualquer departamento, a pessoa tem de preencher um formulário (FormRequest). O formulário verifica se todos os campos obrigatórios estão preenchidos e se os dados fazem sentido. Se o formulário tiver erros, a pessoa é rejeitada com uma explicação dos erros (422).

**O Atendente do Balcão (Controller)** — O Controller é como o funcionário do balcão. Não faz o trabalho pesado — ele recebe o formulário preenchido (Request), preenche um formulário interno padronizado (DTO), e entrega ao gestor do departamento (Service). Quando o gestor devolve o resultado, o atendente coloca o resultado num envelope bonito (Resource) e entrega à pessoa.

**O Formulário Interno (DTO)** — O DTO é como um formulário interno da empresa, padronizado e com campos específicos. Em vez de passar informações em papéis soltos (arrays), tudo vai organizado num formulário tipado. Isto evita confusões como "faltou o nome do cliente" ou "mandaram um campo que não existe".

**O Gestor de Departamento (Service)** — O Service é o gestor que sabe as regras do negócio. Ele sabe, por exemplo, que "não se pode dar baze duas vezes no mesmo post" ou que "não se pode seguir a si mesmo". O gestor aplica as regras e depois pede ao funcionário de arquivo (Repository) para guardar ou buscar dados.

**O Funcionário de Arquivo (Repository)** — O Repository é o funcionário que conhece o arquivo (base de dados). Ele sabe como procurar, guardar, atualizar e apagar registos. O gestor nunca vai ao arquivo diretamente — sempre pede ao funcionário. Isto é bom porque, se o arquivo mudar de sistema (de armários para digital), só o funcionário precisa de aprender o novo sistema.

**Os Registos do Arquivo (Model)** — Cada Model é como uma ficha de registo no arquivo. A ficha "User" tem campos como nome, email, password. A ficha "Post" tem conteúdo, imagem, vídeo. As fichas têm referências umas às outras: "o post 42 pertence ao utilizador 7".

**O Envelope de Resposta (Resource)** — O Resource é o envelope bonito onde o resultado é apresentado ao visitante. O envelope decide que informação mostrar. Por exemplo, o email do utilizador só é mostrado se a pessoa está a ver o seu próprio perfil — para outros utilizadores, o email é omitido.

### O Sistema de Avisos Internos (Eventos)

Os Events são como avisos que circulam na empresa. Quando alguém dá um baze num post, o gestor de Likes cola um aviso no quadro: "PostLiked: O utilizador 3 deu baze no post 42 do utilizador 7". O funcionário do departamento de Notificações (Listener) lê esse aviso e cria uma notificação para o utilizador 7: "A sua publicação recebeu um baze". O gestor de Likes não precisa de saber que existe um departamento de Notificações — apenas cola o aviso e continua o seu trabalho.

### As Regras de Segurança (Policies)

As Policies são como regras escritas na parede de cada departamento. Na parede do departamento de Posts está escrito: "Regra: Só o autor pode editar o seu post. Para apagar, o autor ou o diretor podem." Quando alguém pede para editar um post, o atendente verifica a regra antes de encaminhar para o gestor.

### O Arquivo (MySQL)

O MySQL é o arquivo da empresa. Tem gavetas (tabelas) organizadas: uma gaveta para utilizadores, outra para publicações, outra para comentários, etc. As gavetas têm referências entre si (chaves estrangeiras): cada publicação refere qual utilizador a criou.

### O Cartão de Acesso (Sanctum)

Quando uma pessoa faz login na empresa, recebe um cartão de acesso (token). Esse cartão tem um código único que identifica a pessoa. Em cada pedido, a pessoa mostra o cartão na portaria. A portaria verifica o código numa lista (tabela personal_access_tokens). Se o código for válido, a pessoa entra; se não, é rejeitada.

### O Visitante (Angular/Frontend)

O Angular é como o visitante da empresa. Ele não tem acesso direto ao arquivo nem às salas internas. Só pode comunicar através do balcão de atendimento (API REST). Envia pedidos formais (HTTP Requests) e recebe respostas formais (HTTP Responses) em formato JSON.

O visitante tem os seus próprios assistentes (Services Angular) que sabem como formatar os pedidos corretamente: o AuthService sabe como fazer login, o PostService sabe como criar publicações, etc. O visitante também tem um assistente de segurança (Interceptor) que automaticamente anexa o cartão de acesso a cada pedido, e um porteiro (Guard) que impede o acesso a certas páginas sem login.

### Os Testes (PHPUnit)

Os testes são como simulações de emergência na empresa. Antes de abrir as portas ao público, a equipa faz simulações: "E se alguém tentar entrar sem cartão?", "E se alguém tentar editar o post de outro?", "E se alguém der baze duas vezes?". Cada simulação (teste) verifica que o sistema se comporta corretamente. Se alguma simulação falhar, sabemos que algo está errado antes de os utilizadores reais serem afetados.

---

## Conclusão

O NzolaNet é um projeto ambicioso que implementa padrões de arquitetura profissionais: separação de camadas (Controllers → Services → Repositories), comunicação desacoplada via eventos (Event-Listener), transporte estruturado de dados (DTOs), autenticação via tokens (Sanctum), autorização baseada em políticas (Policies), validação declarativa (FormRequests), transformação de respostas (Resources), e contentorização com Docker.

Cada componente tem uma responsabilidade clara e bem definida, o que torna o sistema mais fácil de entender individualmente, testar isoladamente, e manter a longo prazo. A equipa construiu não apenas uma rede social funcional, mas uma aplicação com arquitetura sólida e práticas de engenharia de software maduras.
