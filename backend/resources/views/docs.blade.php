<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex,nofollow">
    <title>NzolaNet API Docs</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
    <style>
        :root {
            color-scheme: light;
            --bg: #08111f;
            --bg-soft: #101c31;
            --panel: rgba(10, 16, 30, 0.78);
            --panel-border: rgba(255, 255, 255, 0.09);
            --text: #f5f7fb;
            --muted: rgba(245, 247, 251, 0.72);
            --accent: #f8b803;
            --accent-2: #ff750f;
            --chip: rgba(255, 255, 255, 0.08);
            --shadow: 0 30px 90px rgba(0, 0, 0, 0.35);
        }

        * { box-sizing: border-box; }

        html, body {
            margin: 0;
            min-height: 100%;
            background:
                radial-gradient(circle at top left, rgba(248, 184, 3, 0.22), transparent 28%),
                radial-gradient(circle at 85% 15%, rgba(255, 117, 15, 0.18), transparent 30%),
                linear-gradient(160deg, #050914 0%, #08111f 45%, #0f172a 100%);
            color: var(--text);
            font-family: Inter, system-ui, sans-serif;
        }

        body::before {
            content: '';
            position: fixed;
            inset: 0;
            background-image: linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
            background-size: 64px 64px;
            mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent 85%);
            pointer-events: none;
            opacity: 0.35;
        }

        .shell {
            position: relative;
            max-width: 1600px;
            margin: 0 auto;
            padding: 28px;
        }

        .hero {
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            gap: 20px;
            margin-bottom: 20px;
        }

        .panel {
            background: var(--panel);
            border: 1px solid var(--panel-border);
            border-radius: 24px;
            box-shadow: var(--shadow);
            backdrop-filter: blur(18px);
        }

        .hero-copy {
            padding: 28px;
            overflow: hidden;
            position: relative;
        }

        .hero-copy::after {
            content: '';
            position: absolute;
            inset: auto -30px -45px auto;
            width: 180px;
            height: 180px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(248, 184, 3, 0.22), transparent 70%);
            filter: blur(10px);
        }

        .eyebrow {
            display: inline-flex;
            gap: 8px;
            align-items: center;
            padding: 8px 12px;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.08);
            color: var(--muted);
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.08em;
            text-transform: uppercase;
        }

        .title {
            margin: 16px 0 10px;
            font-size: clamp(2rem, 4vw, 4.2rem);
            line-height: 0.95;
            letter-spacing: -0.05em;
            font-weight: 800;
            max-width: 12ch;
        }

        .subtitle {
            margin: 0;
            max-width: 70ch;
            color: var(--muted);
            font-size: 15px;
            line-height: 1.7;
        }

        .meta-row {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 22px;
        }

        .chip {
            padding: 10px 14px;
            border-radius: 999px;
            background: var(--chip);
            border: 1px solid rgba(255, 255, 255, 0.08);
            font-size: 13px;
            color: var(--text);
        }

        .quick-card {
            padding: 22px;
            display: grid;
            gap: 14px;
        }

        .quick-card h2 {
            margin: 0;
            font-size: 18px;
        }

        .quick-card p {
            margin: 0;
            color: var(--muted);
            line-height: 1.6;
            font-size: 14px;
        }

        .endpoint-list {
            display: grid;
            gap: 10px;
            margin-top: 8px;
        }

        .endpoint {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            align-items: center;
            padding: 10px 12px;
            border-radius: 14px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.07);
            font-size: 13px;
        }

        .method {
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            letter-spacing: 0.08em;
            font-weight: 700;
            padding: 6px 10px;
            border-radius: 999px;
            color: #06101c;
            background: linear-gradient(135deg, var(--accent), #ffd166);
            white-space: nowrap;
        }

        .method.post { background: linear-gradient(135deg, #7ad3ff, #c7f0ff); }
        .method.put, .method.patch { background: linear-gradient(135deg, #a7f3d0, #d1fae5); }
        .method.delete { background: linear-gradient(135deg, #ff9f9f, #ffd6d6); }

        .docs-frame {
            overflow: hidden;
            min-height: 76vh;
        }

        .docs-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
            padding: 18px 22px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .docs-header strong {
            font-size: 14px;
            letter-spacing: 0.02em;
        }

        .docs-header span {
            color: var(--muted);
            font-size: 13px;
        }

        #swagger-ui {
            background: #fff;
        }

        #swagger-ui .swagger-ui .topbar {
            display: none;
        }

        #swagger-ui .swagger-ui {
            font-family: Inter, system-ui, sans-serif;
        }

        #swagger-ui .swagger-ui .scheme-container,
        #swagger-ui .swagger-ui .information-container,
        #swagger-ui .swagger-ui .opblock,
        #swagger-ui .swagger-ui .model-box,
        #swagger-ui .swagger-ui .responses-wrapper,
        #swagger-ui .swagger-ui .responses-inner,
        #swagger-ui .swagger-ui .parameters-container {
            border-radius: 18px;
        }

        #swagger-ui .swagger-ui .opblock.opblock-post .opblock-summary-method,
        #swagger-ui .swagger-ui .opblock.opblock-post {
            border-color: rgba(122, 211, 255, 0.45);
        }

        #swagger-ui .swagger-ui .opblock.opblock-delete .opblock-summary-method,
        #swagger-ui .swagger-ui .opblock.opblock-delete {
            border-color: rgba(255, 159, 159, 0.45);
        }

        #swagger-ui .swagger-ui .opblock.opblock-put .opblock-summary-method,
        #swagger-ui .swagger-ui .opblock.opblock-patch .opblock-summary-method,
        #swagger-ui .swagger-ui .opblock.opblock-put,
        #swagger-ui .swagger-ui .opblock.opblock-patch {
            border-color: rgba(167, 243, 208, 0.45);
        }

        .docs-footer {
            margin-top: 16px;
            color: rgba(245, 247, 251, 0.55);
            font-size: 12px;
            text-align: center;
        }

        @media (max-width: 1100px) {
            .hero {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 720px) {
            .shell { padding: 16px; }
            .hero-copy, .quick-card, .docs-header { padding: 18px; }
            .docs-header { flex-direction: column; align-items: flex-start; }
        }
    </style>
</head>
<body>
    <div class="shell">
        <section class="hero">
            <div class="panel hero-copy">
                <span class="eyebrow">NzolaNet API Explorer</span>
                <h1 class="title">Swagger pronto para testar rotas reais.</h1>
                <p class="subtitle">
                    A documentação abaixo carrega o contrato OpenAPI completo da API, com autenticação Bearer/Sanctum,
                    payloads para criação e atualização, upload de ficheiros e suporte a <strong>Try it out</strong> em todas as rotas.
                </p>

                <div class="meta-row">
                    <span class="chip">Base URL: <span style="font-family: 'JetBrains Mono', monospace">http://localhost:8000/api</span></span>
                    <span class="chip">Spec: <span style="font-family: 'JetBrains Mono', monospace">/docs/openapi.yaml</span></span>
                    <span class="chip">Auth: Bearer token</span>
                    <span class="chip">Try it out habilitado</span>
                </div>
            </div>

            <aside class="panel quick-card">
                <div>
                    <h2>Fluxo de teste rápido</h2>
                    <p>Abra a rota de login, copie o token, clique em Authorize e teste os endpoints protegidos sem sair da página.</p>
                </div>

                <div class="endpoint-list">
                    <div class="endpoint"><span>Autenticação</span><span class="method post">POST /auth/login</span></div>
                    <div class="endpoint"><span>Feed e posts</span><span class="method">GET /feed</span></div>
                    <div class="endpoint"><span>Comentários</span><span class="method post">POST /posts/{id}/comments</span></div>
                    <div class="endpoint"><span>Moderação</span><span class="method delete">DELETE /admin/comments/{id}</span></div>
                </div>
            </aside>
        </section>

        <section class="panel docs-frame">
            <div class="docs-header">
                <div>
                    <strong>Swagger UI</strong><br>
                    <span>Interaja com a API a partir do navegador.</span>
                </div>
                <div>
                    <span style="font-family: 'JetBrains Mono', monospace">http://localhost:8000/docs</span>
                </div>
            </div>
            <div id="swagger-ui"></div>
        </section>

        <div class="docs-footer">Use o botão Authorize do Swagger para colar o token Bearer retornado por /auth/login.</div>
    </div>

    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js" crossorigin></script>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js" crossorigin></script>
    <script>
        window.addEventListener('load', () => {
            window.ui = SwaggerUIBundle({
                url: @json(route('docs.openapi')),
                dom_id: '#swagger-ui',
                deepLinking: true,
                displayOperationId: true,
                docExpansion: 'list',
                defaultModelsExpandDepth: 1,
                defaultModelExpandDepth: 1,
                displayRequestDuration: true,
                persistAuthorization: true,
                filter: true,
                showExtensions: true,
                showCommonExtensions: true,
                tryItOutEnabled: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset,
                ],
                layout: 'StandaloneLayout',
            });
        });
    </script>
</body>
</html>