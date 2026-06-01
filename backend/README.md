# NzolaNet Backend

Backend da rede social NzolaNet, desenvolvido com Laravel 12 e preparado para integração com frontend Angular.

Este README foi escrito para servir como guia operacional completo: o que o backend faz, como subir o ambiente, como usar a base de dados, como testar a API, como consultar o Swagger e o que ainda falta até o deploy final.

## Estado Atual

O backend está implementado e validado. Neste momento tens:

- Laravel 12
- MySQL 8
- Redis 7
- Sanctum para autenticação por token
- Docker com nginx, php-fpm, mysql, redis, queue worker e scheduler
- Arquitetura em camadas com Controllers, Services, Repositories, DTOs, Events, Listeners, Policies e Resources
- Testes automatizados a passar: 12 passed, 59 assertions

### Funcionalidades já disponíveis

- Registo, login, logout, utilizador autenticado, refresh de token, recuperação e reset de senha
- Perfil público/privado, edição de perfil e upload de foto
- Follow e unfollow, listagem de seguidores e de seguidos
- Publicações com texto, imagem e vídeo, com edição e remoção apenas pelo autor
- Bazes com regra de like único por utilizador/publicação
- Comentários com edição e remoção pelo autor e remoção por administrador
- Feed global e feed de utilizadores seguidos, em ordem cronológica decrescente
- Notificações para follow, like e comment
- Moderação administrativa para remover comentários

### O que ainda falta até o deploy final

- Frontend Angular a consumir a API
- Ambiente de produção configurado com variáveis reais
- Deploy num servidor real ou serviço cloud
- Integração final com domínio, HTTPS e eventualmente reverse proxy de produção
- Validação manual via Swagger/Postman em ambiente de entrega

## Estrutura do Backend

```text
backend/
  app/
    DTOs/
    Enums/
    Events/
    Http/
      Controllers/
      Middleware/
      Requests/
      Resources/
    Listeners/
    Models/
    Policies/
    Providers/
    Repositories/
    Services/
  bootstrap/
  config/
  database/
    factories/
    migrations/
    seeders/
  docker/
  docs/
    openapi/
  public/
  resources/
  routes/
  storage/
  tests/
```

## Stack e Serviços

- PHP 8.3
- Laravel 12
- MySQL 8.4
- Redis 7.4
- Laravel Sanctum
- Nginx como entrada HTTP
- Queue worker para jobs
- Scheduler para tarefas agendadas

Serviços do Docker Compose:

- `nginx`: entrada HTTP na porta `8000`
- `php-fpm`: aplicação Laravel
- `mysql`: base de dados MySQL exposta na porta `3307` no host
- `redis`: cache, queue e suporte a tarefas assíncronas
- `queue`: `php artisan queue:work redis`
- `scheduler`: `php artisan schedule:work`

## Como Subir o Backend

### 1. Preparar o `.env`

Se ainda não existir:

```bash
cp .env.example .env
```

Gera a chave da aplicação (duas opções):

# Opção A — local (usar se vai executar `artisan` no host)
```bash
composer install
cp .env.example .env
php artisan key:generate
```

# Opção B — recomendado com Docker: gere a chave dentro do container
```bash
cp .env.example .env
docker compose up -d --build
docker compose exec php-fpm php artisan key:generate --force
```

Nota: se preferires executar `php artisan` no host, garante que já correste `composer install` na pasta `backend/`. O fluxo Docker já instala dependências durante o build da imagem, mas o bind-mount do código (`.:/var/www/html`) pode sobrescrever o `vendor/` que foi gerado na imagem — veja a secção "Voltar dependências vs Docker" abaixo.

### 2. Subir com Docker

Executa estes comandos na raiz do projeto ou dentro de `backend`:

```bash
docker compose down --remove-orphans
docker compose up -d --build
docker compose exec php-fpm php artisan migrate --seed
docker compose exec php-fpm php artisan storage:link
```

URL da API em Docker:

```text
http://localhost:8000/api
```

### 3. Confirmar o estado

Comandos úteis:

```bash
docker compose ps
docker compose logs -f mysql
docker compose logs -f php-fpm
docker compose exec php-fpm php artisan route:list
docker compose exec php-fpm php artisan test
```

## Como Usar a Base de Dados

### Configuração esperada

Em Docker, o `.env` deve apontar para o serviço interno `mysql`:

```env
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=nzolanet
DB_USERNAME=nzolanet
DB_PASSWORD=nzolanet_secret

REDIS_HOST=redis
REDIS_PORT=6379
QUEUE_CONNECTION=redis
CACHE_STORE=redis
```

### Banco em ambiente local sem Docker

Se quiseres correr fora do Docker, usa algo deste género:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nzolanet
DB_USERNAME=root
DB_PASSWORD=
QUEUE_CONNECTION=database
CACHE_STORE=database
REDIS_HOST=127.0.0.1
```

### Comandos de base de dados

Criar o schema e popular dados:

```bash
php artisan migrate --seed
```

Recriar tudo do zero:

```bash
php artisan migrate:fresh --seed
```

No Docker:

```bash
docker compose exec php-fpm php artisan migrate --seed
docker compose exec php-fpm php artisan migrate:fresh --seed
# Nota: `php artisan db:show` não é um comando padrão do Laravel — pode ser personalizado neste projecto.
# Se não existir, use `migrate:status` ou entre no container `mysql` e inspeccione a base de dados.
docker compose exec php-fpm php artisan migrate:status
docker compose exec php-fpm php artisan tinker
```

### Dados iniciais

O seeder cria o utilizador administrador:

```text
email: admin@nzolanet.local
senha: Admin@123456
```

### Tabelas principais

- `users`
- `posts`
- `likes`
- `comments`
- `followers`
- `notifications`
- `personal_access_tokens`
- `migrations`
- `jobs`
- `cache`

## Uploads e Storage

O backend usa o disk `public` para ficheiros enviados pelos utilizadores.

### O que pode ser carregado

- imagem de publicação
- vídeo de publicação
- foto de perfil

### Comandos importantes

```bash
docker compose exec php-fpm php artisan storage:link
```

### Verificar ficheiros

Os ficheiros ficam em:

```text
storage/app/public
```

E ficam acessíveis via:

```text
http://localhost:8000/storage/...
```

## Autenticação e Headers

As rotas protegidas usam Sanctum com token Bearer:

```http
Authorization: Bearer {token}
Accept: application/json
```

## Rotas da API

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Users

- `GET /api/users/{id}`
- `PUT /api/users/profile`
- `POST /api/users/profile-photo`
- `POST /api/users/{id}/follow`
- `DELETE /api/users/{id}/follow`
- `GET /api/users/{id}/followers`
- `GET /api/users/{id}/following`

### Posts, Likes e Comments

- `GET /api/posts`
- `POST /api/posts`
- `GET /api/posts/{id}`
- `PUT /api/posts/{id}`
- `DELETE /api/posts/{id}`
- `POST /api/posts/{id}/like`
- `DELETE /api/posts/{id}/like`
- `GET /api/posts/{id}/comments`
- `POST /api/posts/{id}/comments`
- `PUT /api/comments/{id}`
- `DELETE /api/comments/{id}`

### Feed, Notifications e Admin

- `GET /api/feed`
- `GET /api/feed/following`
- `GET /api/notifications`
- `PATCH /api/notifications/{id}/read`
- `DELETE /api/admin/comments/{id}`

### Rota base e fallback

- `GET /api`
- `GET /api/{fallback}` devolve erro padronizado quando a rota não existe

## Respostas Padronizadas

Sucesso:

```json
{
  "success": true,
  "message": "Operacao realizada com sucesso",
  "data": {}
}
```

Erro:

```json
{
  "success": false,
  "message": "Descricao do erro",
  "errors": {}
}
```

## OpenAPI e Swagger

A especificação Swagger/OpenAPI está em:

```text
docs/openapi/nzolanet.yaml
```

Base URL documentada:

```text
http://localhost:8000/api
```

Podes abrir esse ficheiro em:

- Swagger Editor
- Postman Import
- Insomnia Import

Para abrir a interface de testes (Swagger UI) já integrada e visível no navegador, depois de levantar os serviços com Docker, execute:

```bash
# Linux (abre o browser padrão)
xdg-open http://localhost:8000/docs || true

# macOS
open http://localhost:8000/docs || true

# Windows (PowerShell)
start http://localhost:8000/docs || true
```

Isto abre `http://localhost:8000/docs` que carrega o `docs/openapi/nzolanet.yaml` na Swagger UI (botão "Authorize" disponível para Bearer token).

Se quiseres testar manualmente pela coleção gerada, importa o YAML e usa o token Bearer obtido no login.

## Testes

Executar a suíte completa:

```bash
php artisan test
```

No Docker:

```bash
docker compose exec php-fpm php artisan test
```

Executar apenas rotas específicas ou um ficheiro de teste:

```bash
php artisan test --filter=AuthTest
php artisan test tests/Feature/FeedTest.php
```

Coverage:

```bash
XDEBUG_MODE=coverage php artisan test --coverage --min=80
```

Resultado atual conhecido:

```text
12 passed
59 assertions
```

## Comandos de Controlo Diário

Estes são os comandos que dão controlo total do backend durante desenvolvimento:

```bash
docker compose down --remove-orphans
docker compose up -d --build
docker compose exec php-fpm php artisan migrate --seed
docker compose exec php-fpm php artisan migrate:fresh --seed
docker compose exec php-fpm php artisan storage:link
docker compose exec php-fpm php artisan route:list
docker compose exec php-fpm php artisan test
docker compose exec php-fpm php artisan tinker
docker compose exec php-fpm php artisan config:clear
docker compose exec php-fpm php artisan cache:clear
docker compose exec php-fpm php artisan route:clear
docker compose exec php-fpm php artisan view:clear

# Nota sobre dependências e `vendor/`:
# - Se preferires executar `artisan` no host, corre `composer install` localmente antes.
# - Se preferires o fluxo Docker (recomendado), usa `docker compose up -d --build` e execute `docker compose exec php-fpm ...` para todos os comandos `artisan`.
```

## Guia de Uso Rápido

Para alguém novo no projeto, este é o fluxo mínimo para começar sem se perder:

```bash
cp .env.example .env
php artisan key:generate
docker compose up -d --build
docker compose exec php-fpm php artisan migrate --seed
docker compose exec php-fpm php artisan test
```

Se precisares desfazer o ambiente de forma segura, usa estes comandos:

```bash
docker compose down --remove-orphans
docker compose exec php-fpm php artisan migrate:fresh --seed
docker compose exec php-fpm php artisan config:clear
docker compose exec php-fpm php artisan cache:clear
docker compose exec php-fpm php artisan route:clear
docker compose exec php-fpm php artisan view:clear
```

Quando o objetivo for limpar ficheiros gerados localmente sem apagar o código, remove apenas os artefactos temporários:

```bash
rm -rf storage/framework/cache storage/framework/views storage/framework/sessions storage/logs/*
```

## Deploy

Checklist recomendado para produção:

```bash
composer install --no-dev --optimize-autoloader
php artisan key:generate --force
php artisan migrate --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Configura no ambiente de produção:

- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL`
- credenciais reais de MySQL
- Redis para cache e queues
- worker persistente para `php artisan queue:work`
- scheduler via `php artisan schedule:run` por cron ou `schedule:work` em container dedicado

## Próximos Passos

Para fechar o projeto completo, o caminho natural é:

1. construir o frontend Angular consumindo esta API
2. validar upload de imagem, vídeo e foto de perfil no frontend
3. testar a API manualmente via Swagger/Postman
4. preparar o deploy final com configuração de produção
5. escrever o relatório do projeto com arquitetura, decisões e testes

## Observação para a Equipa

Se alguém novo entrar no projeto, o fluxo mínimo para começar é:

```bash
cp .env.example .env
php artisan key:generate
docker compose up -d --build
docker compose exec php-fpm php artisan migrate --seed
docker compose exec php-fpm php artisan storage:link
docker compose exec php-fpm php artisan test
```

Depois disso, a API fica disponível em `http://localhost:8000/api` e o Swagger em `docs/openapi/nzolanet.yaml`.
