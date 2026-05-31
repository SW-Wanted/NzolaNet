import { Injectable, computed, signal } from '@angular/core';
import {
  Comentario,
  EventoCultural,
  GrupoComunidade,
  ItemCarrinho,
  ProdutoCultural,
  Publicacao,
  Utilizador,
} from '../models/nzolanet.model';

const avatarPrincipal =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC9fc3LgEcIoMRyzygrtvD6C_iV8JhkmmaTtxcLnjXD5lVR1x07sV9E-OOXCJagLASt999mjLIwu6YevVPZ9BueZGq2OkQ3cpJ6V-L79xUftQINDSPLvDya9eyFOEDMGzG-VLGz9cEhiU5wZ84QJHkmQKU_IsBm27u3btYmWHZeDYzt6VilY2lglbx7nO2C_uLNlR-r5pwZXfpMwboIrTTD_kU3x4KlgqWyjnp7lgqyiY6uE4qzxCtwRNTnYq5VF14sb6avLWA8Iy9s';

const imagemKizomba =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAQyCxYTrGTvudis_SU_kdT9jUuVWq9DN-Mkuj80cvluFlQF_565vx4GgHaAK-XfZYyy3lTPnUL1Dn04JwIAtU_ALs9X6meSm-XmSmdhAo_rK5sw3QMuXMfVoRCjdXzDsfVk_94wf_3FQBJfyyODaOftfvffHm9mOkzLy0Kb3muxoQEgiQ4PVNfUnhqWthga2o6ik9cSGgaqGWDM2LyMW_fV31hCRCEmOu-Liyrzf69ykPU6q664BnRGN2AR5DxPywt0jOx77M-v40H';

const imagemArte =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBuPLIQSwqgo9c-P3k_FQ-CMErk-riRYBzFBOyxoV2eQmXjZx2rLneveh1ipriG1JJBdSHQcJaiFqz5Xu-IbNIVqndf-OeT8qaRGE1dwzHHuTXx7zZmNt7e24rLkoVCwBElPcMZPEoKUq0RHBU7n7FWnhyxBup4aGJWibrXd0Ib_00tAf_Yvh-F1vMm-J8N4YVlWbT0qaYfu75eHNlx8DXrgOhrSTEvLR2WstEbKD8BQoN_l9LCI8fkcJErRY2JE5aAwbgeu0fdz9Ab';

const imagemSemba =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBNmdzREkj0m7ajCQJ41iIcqddr9lliJZmzn4dLMY09lbDw4cNrlXs3N6VvvpxmI9WgmvFKgFM_-jmsirQ-fB2mS10p3PeYXlPUx14D52JkpAJugbjFHebgZrw0gSVcLQtceVTUcGBpy2oQ8ybjaqrf7Rzr0DsZj4v8ggdf6tSL8_WMXMUuPQdXFyI8JDb1w2AEXAG8NmYboa28P9OXJ0HL9SQwul2zYOSNdpMYhUILqggyRh4caJzDEgdhH84VPEYBlSMyUbL0FMzZ';

@Injectable({ providedIn: 'root' })
export class NzolanetDadosService {
  readonly utilizadorActual = signal<Utilizador>({
    id: 'ana-mwene',
    nome: 'Ana Mwene',
    identificador: '@anamwene',
    avatar: avatarPrincipal,
    descricao: 'Curadora cultural, criadora de eventos e apaixonada por Kizomba.',
    localizacao: 'Luanda, Angola',
    seguidores: 2400,
  });

  readonly publicacoes = signal<Publicacao[]>([
    {
      id: 'pub-1',
      autor: this.utilizadorActual(),
      tempoPublicacao: 'ha 24 min',
      localizacao: 'Luanda, Angola',
      conteudo:
        'A noite de Kizomba na Baia mostrou como a danca continua a ligar geracoes. Que energia bonita.',
      imagem: imagemKizomba,
      imagemAlt: 'Festival de Kizomba em Luanda',
      contagemBazes: 128,
      contagemComentarios: 34,
      contagemPartilhas: 12,
      temBaze: true,
    },
    {
      id: 'pub-2',
      autor: {
        id: 'koista',
        nome: 'Koista Baron',
        identificador: '@nzolanetvee',
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBhTgzDZK5iFvOr3ECIPjs7I8kg-nRFLIwix1D-p1fg351SU3DtIrYk6dJisikxbqpjG5bHyGJ2soVlUym9zkI-Hmz8-1MBGjZ0hXq4S-XfSHXwDojHAHj_lri3GD3EPAGEj_4entbYeGmUFsKS9jK3Ny91zwKMuNfOL8TfyMGW3LSzdTWTAfsY2mYWbf7PneRwsKXnKDn9hbfJxNIRN2CO9C6NbU-ZH5ECrLOChUCYsGCioY3ntV2X6WMu9LQvfLdbrCyFuKTuh5SR',
        descricao: 'Musico e produtor',
      },
      tempoPublicacao: 'ha 1 h',
      conteudo: 'Novo ensaio de Semba ao vivo. O som tradicional tambem merece palco digital.',
      imagem: imagemSemba,
      imagemAlt: 'Concerto de Semba',
      contagemBazes: 94,
      contagemComentarios: 18,
      contagemPartilhas: 8,
    },
  ]);

  readonly eventos = signal<EventoCultural[]>([
    {
      id: 'festival-kizomba',
      titulo: 'Festival Internacional de Kizomba',
      descricao: 'Tres dias de workshops, festas e apresentacoes com mestres de Kizomba e Semba.',
      local: 'Baia de Luanda',
      data: '12',
      mes: 'Nov',
      categoria: 'Musica & Danca',
      destaque: true,
      confirmado: false,
      imagem: imagemKizomba,
    },
    {
      id: 'arte-contemporanea',
      titulo: 'Exposicao de Arte Contemporanea',
      descricao: 'Novas linguagens visuais da juventude angolana no Museu de Antropologia.',
      local: 'Museu Nacional',
      data: '25',
      mes: 'Out',
      categoria: 'Arte',
      imagem: imagemArte,
    },
    {
      id: 'semba-ao-vivo',
      titulo: 'Concerto de Semba ao Vivo',
      descricao: 'Uma noite de Semba classico, poesia e gastronomia tipica.',
      local: 'Casa da Cultura',
      data: '02',
      mes: 'Dez',
      categoria: 'Musica',
      imagem: imagemSemba,
    },
  ]);

  readonly grupos = signal<GrupoComunidade[]>([
    { id: 'kizomba-luanda', nome: 'Kizomba Luanda', membros: '14,2 mil membros', icone: 'library_music' },
    { id: 'artesaos', nome: 'Artesaos de Angola', membros: '8,7 mil membros', icone: 'palette' },
    { id: 'fotografia', nome: 'Fotografia Cultural', membros: '5,1 mil membros', icone: 'photo_camera' },
    { id: 'gastronomia', nome: 'Gastronomia Nzola', membros: '3,8 mil membros', icone: 'restaurant' },
  ]);

  readonly produtos = signal<ProdutoCultural[]>([
    {
      id: 'cesto',
      nome: 'Cesto artesanal',
      preco: '12 500 Kz',
      precoValor: 12500,
      imagem: imagemArte,
      categoria: 'Artesanato',
    },
    {
      id: 'samakaka',
      nome: 'Pano Samakaka',
      preco: '8 900 Kz',
      precoValor: 8900,
      imagem: imagemKizomba,
      categoria: 'Moda',
    },
    {
      id: 'obra',
      nome: 'Obra contemporanea',
      preco: '45 000 Kz',
      precoValor: 45000,
      imagem: imagemArte,
      categoria: 'Arte',
    },
  ]);

  readonly carrinho = signal<ItemCarrinho[]>([]);

  readonly comentarios = signal<Comentario[]>([
    {
      id: 'com-1',
      autor: 'Mateus Dala',
      texto: 'Este festival precisa de transmissao ao vivo para a diaspora.',
      estado: 'aprovado',
    },
    {
      id: 'com-2',
      autor: 'Lueji Arte',
      texto: 'Comentario sinalizado por linguagem impropria.',
      estado: 'pendente',
    },
  ]);

  readonly comentariosPendentes = computed(() =>
    this.comentarios().filter((comentario) => comentario.estado === 'pendente'),
  );

  readonly itensCarrinho = computed(() =>
    this.carrinho()
      .map((item) => ({
        item,
        produto: this.produtos().find((produto) => produto.id === item.produtoId),
      }))
      .filter((linha) => Boolean(linha.produto)),
  );

  readonly totalCarrinho = computed(() =>
    this.itensCarrinho().reduce(
      (total, linha) => total + (linha.produto?.precoValor ?? 0) * linha.item.quantidade,
      0,
    ),
  );

  criarPublicacao(conteudo: string): void {
    const novaPublicacao: Publicacao = {
      id: `pub-${Date.now()}`,
      autor: this.utilizadorActual(),
      tempoPublicacao: 'agora',
      localizacao: this.utilizadorActual().localizacao,
      conteudo,
      contagemBazes: 0,
      contagemComentarios: 0,
      contagemPartilhas: 0,
    };

    this.publicacoes.update((publicacoes) => [novaPublicacao, ...publicacoes]);
  }

  eliminarPublicacao(id: string): void {
    this.publicacoes.update((publicacoes) => publicacoes.filter((publicacao) => publicacao.id !== id));
  }

  adicionarComentario(texto: string): void {
    const comentario: Comentario = {
      id: `com-${Date.now()}`,
      autor: this.utilizadorActual().nome,
      texto,
      estado: 'aprovado',
    };

    this.comentarios.update((comentarios) => [...comentarios, comentario]);
  }

  removerComentario(id: string): void {
    this.comentarios.update((comentarios) => comentarios.filter((comentario) => comentario.id !== id));
  }

  criarEvento(evento: Pick<EventoCultural, 'titulo' | 'descricao' | 'local' | 'data' | 'mes' | 'categoria'>): void {
    this.eventos.update((eventos) => [{ id: `evento-${Date.now()}`, imagem: imagemKizomba, ...evento }, ...eventos]);
  }

  eliminarEvento(id: string): void {
    this.eventos.update((eventos) => eventos.filter((evento) => evento.id !== id));
  }

  confirmarEvento(id: string): void {
    this.eventos.update((eventos) =>
      eventos.map((evento) => (evento.id === id ? { ...evento, confirmado: true } : evento)),
    );
  }

  criarGrupo(nome: string, membros = '1 membro'): void {
    this.grupos.update((grupos) => [
      { id: `grupo-${Date.now()}`, nome, membros, icone: 'groups', participando: true },
      ...grupos,
    ]);
  }

  alternarGrupo(id: string): void {
    this.grupos.update((grupos) =>
      grupos.map((grupo) =>
        grupo.id === id ? { ...grupo, participando: !grupo.participando } : grupo,
      ),
    );
  }

  eliminarGrupo(id: string): void {
    this.grupos.update((grupos) => grupos.filter((grupo) => grupo.id !== id));
  }

  criarProduto(produto: Pick<ProdutoCultural, 'nome' | 'preco' | 'precoValor' | 'categoria'>): void {
    this.produtos.update((produtos) => [{ id: `produto-${Date.now()}`, imagem: imagemArte, ...produto }, ...produtos]);
  }

  alternarProduto(id: string): void {
    const existe = this.carrinho().some((item) => item.produtoId === id);

    if (existe) {
      this.removerDoCarrinho(id);
      return;
    }

    this.carrinho.update((itens) => [...itens, { produtoId: id, quantidade: 1 }]);
    this.sincronizarProdutosCarrinho();
  }

  removerDoCarrinho(produtoId: string): void {
    this.carrinho.update((itens) => itens.filter((item) => item.produtoId !== produtoId));
    this.sincronizarProdutosCarrinho();
  }

  actualizarQuantidadeCarrinho(produtoId: string, quantidade: number): void {
    const quantidadeSegura = Math.max(1, quantidade);
    this.carrinho.update((itens) =>
      itens.map((item) =>
        item.produtoId === produtoId ? { ...item, quantidade: quantidadeSegura } : item,
      ),
    );
  }

  moderarComentario(id: string, estado: Comentario['estado']): void {
    this.comentarios.update((comentarios) =>
      comentarios.map((comentario) => (comentario.id === id ? { ...comentario, estado } : comentario)),
    );
  }

  private sincronizarProdutosCarrinho(): void {
    const idsCarrinho = new Set(this.carrinho().map((item) => item.produtoId));
    this.produtos.update((produtos) =>
      produtos.map((produto) => ({ ...produto, noCarrinho: idsCarrinho.has(produto.id) })),
    );
  }
}
