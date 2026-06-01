# NzolaNet Backend

Backend Laravel 12 da rede social NzolaNet, preparado para integracao com frontend Angular.

## Stack

- PHP 8.3
- Laravel 12
- MySQL 8
- Redis
- Laravel Sanctum
- Docker com nginx, php-fpm, mysql, redis, queue worker e scheduler

## Funcionalidades

- Registo, login, logout, utilizador autenticado, refresh de token, recuperacao e reset de senha.
- Perfil publico/privado, edicao de perfil e upload de foto.
- Seguir/deixar de seguir, listagem de seguidores e seguindo.
- Publicacoes com texto, imagem e video, edicao/exclusao apenas pelo autor.
- Bazes com constraint unica por utilizador/publicacao.
- Comentarios com edicao/exclusao pelo autor e remocao por administrador.
- Feed global e feed de utilizadores seguidos, sempre por ordem cronologica decrescente.
- Notificacoes para novo seguidor, novo baze e novo comentario.
- Arquitetura em camadas com DTOs, Services, Repositories, Policies, Events e Listeners.

## Instalar Localmente

```bash
composer install
cp .env.example .env
php artisan key:generate
```

Configure o `.env` para apontar para MySQL. Para uso local sem Docker, use por exemplo:

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

Depois execute:

```bash
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

Administrador criado pelo seeder:

```text
email: admin@nzolanet.local
senha: Admin@123456
```

## Docker

```bash
cp .env.example .env
php artisan key:generate
docker compose down --remove-orphans
docker compose up -d --build
docker compose exec php-fpm php artisan migrate --seed
docker compose exec php-fpm php artisan storage:link
```

API:

```text
http://localhost:8000/api
```

Servicos:

- `nginx`: entrada HTTP.
- `php-fpm`: aplicacao Laravel.
- `mysql`: base de dados MySQL 8.
- `redis`: cache, queue e suporte a tarefas assicronas.
- `queue`: `php artisan queue:work redis`.
- `scheduler`: `php artisan schedule:work`.

## Rotas Principais

Todas as rotas autenticadas usam header:

```http
Authorization: Bearer {token}
Accept: application/json
```

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`
- `GET /api/auth/me`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

Users:

- `GET /api/users/{id}`
- `PUT /api/users/profile`
- `POST /api/users/profile-photo`
- `POST /api/users/{id}/follow`
- `DELETE /api/users/{id}/follow`
- `GET /api/users/{id}/followers`
- `GET /api/users/{id}/following`

Posts, bazes e comentarios:

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

Feed, notificacoes e admin:

- `GET /api/feed`
- `GET /api/feed/following`
- `GET /api/notifications`
- `PATCH /api/notifications/{id}/read`
- `DELETE /api/admin/comments/{id}`

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

## OpenAPI

A especificacao Swagger/OpenAPI esta em:

```text
docs/openapi/nzolanet.yaml
```

Pode ser aberta no Swagger Editor ou importada no Postman/Insomnia.

## Testes

```bash
php artisan test
```

Para coverage:

```bash
XDEBUG_MODE=coverage php artisan test --coverage --min=80
```

Se usar Docker:

```bash
docker compose exec php-fpm php artisan test
```

## Deploy

Checklist recomendado:

```bash
composer install --no-dev --optimize-autoloader
php artisan key:generate --force
php artisan migrate --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Configure no ambiente de producao:

- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL`
- credenciais MySQL
- Redis para cache e queues
- worker persistente para `php artisan queue:work`
- scheduler via `php artisan schedule:run` por cron ou `schedule:work` em container dedicado
