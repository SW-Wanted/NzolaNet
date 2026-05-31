
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/feed",
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/feed"
  },
  {
    "renderMode": 2,
    "route": "/feed/estados"
  },
  {
    "renderMode": 2,
    "route": "/entrar"
  },
  {
    "renderMode": 2,
    "route": "/registo"
  },
  {
    "renderMode": 2,
    "route": "/recuperar-senha"
  },
  {
    "renderMode": 2,
    "route": "/perfil"
  },
  {
    "renderMode": 2,
    "route": "/perfil/editar"
  },
  {
    "renderMode": 2,
    "route": "/criar-post"
  },
  {
    "renderMode": 2,
    "route": "/grupos"
  },
  {
    "renderMode": 2,
    "route": "/mercado"
  },
  {
    "renderMode": 2,
    "route": "/eventos"
  },
  {
    "renderMode": 2,
    "route": "/kizomba-hub"
  },
  {
    "renderMode": 2,
    "route": "/sugestoes"
  },
  {
    "renderMode": 2,
    "route": "/comentarios"
  },
  {
    "renderMode": 2,
    "route": "/comentarios/moderacao"
  },
  {
    "renderMode": 2,
    "route": "/sucesso"
  },
  {
    "renderMode": 2,
    "redirectTo": "/feed",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 4429, hash: 'd01de46178ec06e2facf5f303e61b126f2ad51d8acfd6e283b8b1397d92ea872', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 946, hash: '5e615a433380f671be72d864069d85cc1934a8afea61a67fef09b33418223dd2', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'feed/estados/index.html': {size: 26364, hash: '3a749ea324d3d66ea0cd35456a0b3ab52401e258dfe1ff0e388b0dfe7c3c7002', text: () => import('./assets-chunks/feed_estados_index_html.mjs').then(m => m.default)},
    'recuperar-senha/index.html': {size: 13553, hash: '451b497d3af47ceaa583740e6741e5c5ab03c131afe1fcbe28f6d30b8fbeedc9', text: () => import('./assets-chunks/recuperar-senha_index_html.mjs').then(m => m.default)},
    'feed/index.html': {size: 40707, hash: '76e1659df6d0c42b798e8f01acaef09492cf69d91f6b9c96c00a4ae15414f90f', text: () => import('./assets-chunks/feed_index_html.mjs').then(m => m.default)},
    'criar-post/index.html': {size: 26494, hash: '79c1a4f7871a8228bcb554fc679b4a3e243bd77f30396b1d58065c93029039e2', text: () => import('./assets-chunks/criar-post_index_html.mjs').then(m => m.default)},
    'kizomba-hub/index.html': {size: 31110, hash: '2396a62885b3b04c3270510d06643b9194986c91b6007360461ec3e0a80ae517', text: () => import('./assets-chunks/kizomba-hub_index_html.mjs').then(m => m.default)},
    'mercado/index.html': {size: 31942, hash: 'fe735c13d6bb5a6dfb603723eafb7af96a29b9e9370d8f95b3e5da78b7f0d890', text: () => import('./assets-chunks/mercado_index_html.mjs').then(m => m.default)},
    'sucesso/index.html': {size: 14227, hash: 'b29c14d840d976dbec0e5e234c819506a2221c9bf12c0f68c3e5b7daaf21e7ba', text: () => import('./assets-chunks/sucesso_index_html.mjs').then(m => m.default)},
    'registo/index.html': {size: 14524, hash: '89a9d3807adf70aeceef7961ca5858fbf5c8c5bcd2c2436e9a76afaceaef2d11', text: () => import('./assets-chunks/registo_index_html.mjs').then(m => m.default)},
    'comentarios/index.html': {size: 26816, hash: 'f6246bf1d5aa21b3d2d61838c172d5ea4d0434afd79e810474ca4cea8e027d63', text: () => import('./assets-chunks/comentarios_index_html.mjs').then(m => m.default)},
    'comentarios/moderacao/index.html': {size: 26428, hash: '91014584596e0902e93b3cc2a75763e4e208be99ad9d19c4918e7826154cd632', text: () => import('./assets-chunks/comentarios_moderacao_index_html.mjs').then(m => m.default)},
    'perfil/editar/index.html': {size: 26354, hash: '4ca23d6387cdef17a8f7b370acc17427181d6b4bdb550b55158ee705c1545fa9', text: () => import('./assets-chunks/perfil_editar_index_html.mjs').then(m => m.default)},
    'eventos/index.html': {size: 35134, hash: 'e8a51e90fc837d54ed9218ac90c55df8da8893e5c2a38d4b8201081543e47dbb', text: () => import('./assets-chunks/eventos_index_html.mjs').then(m => m.default)},
    'perfil/index.html': {size: 28817, hash: '8fce6ead70b319f5c3802f12fd2d69cbafe4af7ac2abca25d0a9a5d9dc17c702', text: () => import('./assets-chunks/perfil_index_html.mjs').then(m => m.default)},
    'grupos/index.html': {size: 31348, hash: '29a0d991332726ac35836f8e056548fc9117eb3d552e353ee84c58461cbf81f1', text: () => import('./assets-chunks/grupos_index_html.mjs').then(m => m.default)},
    'sugestoes/index.html': {size: 28724, hash: '761ee68c82255895e090f0046b6cfdd79b6ee9dc6c4dfde2cbbad53c32c75be0', text: () => import('./assets-chunks/sugestoes_index_html.mjs').then(m => m.default)},
    'entrar/index.html': {size: 14353, hash: 'a18fb927c8a00e7ae4eab298afb39baa0273ec4b9db710717937508342aa4124', text: () => import('./assets-chunks/entrar_index_html.mjs').then(m => m.default)},
    'styles-E2UOXJ6R.css': {size: 16698, hash: '0CLyZ2kTd0s', text: () => import('./assets-chunks/styles-E2UOXJ6R_css.mjs').then(m => m.default)}
  },
};
