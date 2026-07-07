import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { CartaoPublicacaoComponent, Publicacao, PublicacaoEditada } from '../../components/cartao-publicacao/cartao-publicacao.component';
import { DrawerComentariosComponent } from '../../components/drawer-comentarios/drawer-comentarios.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { Post, User } from '../../models/fase1.model';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { mensagemErroHttp } from '../../utils/erro.utils';

interface DestaqueFeed {
  rotulo: string;
  valor: number;
  icone: string;
}

function avatarFallback(name: string): string {
  return `https://ui-avatars.com/api/?background=111827&color=ffffff&name=${encodeURIComponent(name)}`;
}

@Component({
  selector: 'app-feed',
  imports: [
    CabecalhoComponent,
    CartaoPublicacaoComponent,
    DrawerComentariosComponent,
    MenuLateralComponent,
    RouterLink,
    ModalComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly postsApi = inject(PostService);
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);

  postDestacadoId = signal<number | null>(null);
  likerDestacadoId = signal<number | null>(null);
  comentarioDestacadoId = signal<number | null>(null);
  private destaqueTimer: ReturnType<typeof setTimeout> | undefined;

  filtroActivo = signal<'todos' | 'seguidos' | 'populares'>('todos');
  sugestoes = signal<User[]>([]);

  modalCriarAberto = signal(false);
  criarSubmetido = false;
  emPublicacao = signal(false);
  erroCriar = signal('');
  previewMedia = signal('');
  tipoMedia = signal<'imagem' | 'video'>('imagem');
  private mediaSelecionada: File | undefined;

  readonly formularioCriar = this.fb.nonNullable.group({
    conteudo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]],
  });

  drawerComentariosAberto = signal(false);
  publicacaoActiva = signal<Publicacao | null>(null);

  publicacoes = signal<Publicacao[]>([]);
  carregandoFeed = signal(false);
  erroFeed = signal('');

  readonly utilizadorActual = computed(() => this.auth.currentUser());
  readonly avatarActual = computed(() => this.utilizadorActual()?.profile_photo ?? avatarFallback(this.nomeActual()));
  readonly nomeActual = computed(() => this.utilizadorActual()?.name ?? 'Utilizador NzolaNet');
  readonly destaquesFeed = computed<DestaqueFeed[]>(() => {
    const publicacoes = this.publicacoes();
    const bazes = publicacoes.reduce((total, post) => total + post.contagemBazes, 0);
    const comentarios = publicacoes.reduce((total, post) => total + post.contagemComentarios, 0);

    return [
      { rotulo: 'Publicações', valor: publicacoes.length, icone: 'article' },
      { rotulo: 'Bazes', valor: bazes, icone: 'favorite' },
      { rotulo: 'Comentários', valor: comentarios, icone: 'chat_bubble' },
    ];
  });
  readonly publicacaoEmAlta = computed(() =>
    [...this.publicacoes()].sort(
      (a, b) =>
        b.contagemBazes + b.contagemComentarios - (a.contagemBazes + a.contagemComentarios),
    )[0] ?? null,
  );
  readonly actividadeRecente = computed(() => this.publicacoes().slice(0, 3));

  ngOnInit(): void {
    this.carregarFeed();
    this.carregarSugestoes();
  }

  selecionarFiltro(filtro: 'todos' | 'seguidos' | 'populares'): void {
    this.filtroActivo.set(filtro);
    this.carregarFeed();
  }

  private readonly idsSeguirEmCurso = new Set<number>();

  alternarSeguir(sugestao: User): void {
    if (this.idsSeguirEmCurso.has(sugestao.id)) return;
    this.idsSeguirEmCurso.add(sugestao.id);

    const request = sugestao.is_following
      ? this.userService.unfollow(sugestao.id)
      : this.userService.toggleFollow(sugestao.id);

    request.subscribe({
      next: () => {
        this.sugestoes.update((lista) =>
          lista.map((u) =>
            u.id === sugestao.id ? { ...u, is_following: !sugestao.is_following } : u,
          ),
        );
        this.idsSeguirEmCurso.delete(sugestao.id);
      },
      error: () => this.idsSeguirEmCurso.delete(sugestao.id),
    });
  }

  seguirEmCurso(id: number): boolean {
    return this.idsSeguirEmCurso.has(id);
  }

  abrirCriarPost(): void {
    this.formularioCriar.reset();
    this.removerMedia();
    this.erroCriar.set('');
    this.criarSubmetido = false;
    this.modalCriarAberto.set(true);
  }

  publicar(): void {
    this.criarSubmetido = true;
    this.erroCriar.set('');

    if (this.formularioCriar.invalid) {
      this.formularioCriar.markAllAsTouched();
      return;
    }

    this.emPublicacao.set(true);
    this.postsApi
      .createPost(this.formularioCriar.controls.conteudo.value.trim(), this.mediaSelecionada)
      .subscribe({
        next: () => {
          this.modalCriarAberto.set(false);
          this.formularioCriar.reset();
          this.removerMedia();
          this.criarSubmetido = false;
          this.emPublicacao.set(false);
          this.carregarFeed();
        },
        error: (err) => {
          this.erroCriar.set(mensagemErroHttp(err));
          this.emPublicacao.set(false);
        },
      });
  }

  aoSelecionarMedia(evento: Event, tipo: 'imagem' | 'video'): void {
    const input = evento.target as HTMLInputElement;
    const ficheiro = input.files?.[0];

    if (!ficheiro) {
      return;
    }

    const limiteMb = tipo === 'imagem' ? 8 : 50;
    const tipoValido =
      tipo === 'imagem' ? ficheiro.type.startsWith('image/') : ficheiro.type.startsWith('video/');

    if (!tipoValido || ficheiro.size > limiteMb * 1024 * 1024) {
      this.erroCriar.set(
        `Selecione um ficheiro ${tipo === 'imagem' ? 'de imagem' : 'de vídeo'} válido até ${limiteMb} MB.`,
      );
      input.value = '';
      return;
    }

    this.erroCriar.set('');
    this.mediaSelecionada = ficheiro;
    this.tipoMedia.set(tipo);
    this.previewMedia.set(URL.createObjectURL(ficheiro));
  }

  removerMedia(): void {
    if (this.previewMedia().startsWith('blob:')) {
      URL.revokeObjectURL(this.previewMedia());
    }

    this.previewMedia.set('');
    this.mediaSelecionada = undefined;
  }

  abrirComentarios(publicacao: Publicacao): void {
    this.publicacaoActiva.set(publicacao);
    this.drawerComentariosAberto.set(true);
  }

  fecharComentarios(): void {
    this.drawerComentariosAberto.set(false);
    this.publicacaoActiva.set(null);
    this.comentarioDestacadoId.set(null);
  }

  aoContagemComentariosAlterada(evento: { postId: number; delta: number }): void {
    this.publicacoes.update((lista) =>
      lista.map((publicacao) =>
        publicacao.id === evento.postId
          ? { ...publicacao, contagemComentarios: Math.max(0, publicacao.contagemComentarios + evento.delta) }
          : publicacao,
      ),
    );
  }

  aoEliminar(id: number): void {
    this.postsApi.deletePost(id).subscribe({
      next: () =>
        this.publicacoes.update((lista) => lista.filter((publicacao) => publicacao.id !== id)),
      error: (err) => this.erroFeed.set(mensagemErroHttp(err)),
    });
  }

  aoEditar(evento: PublicacaoEditada): void {
    this.postsApi
      .updatePost(evento.id, evento.conteudo, {
        image: evento.imagemFile,
        video: evento.videoFile,
        removeImage: evento.removerImagem,
        removeVideo: evento.removerVideo,
      })
      .subscribe({
      next: (post) => {
        const publicacao = this.toPublicacao(post);
        this.publicacoes.update((lista) =>
          lista.map((item) => (item.id === publicacao.id ? publicacao : item)),
        );
      },
      error: (err) => this.erroFeed.set(mensagemErroHttp(err)),
    });
  }

  aoAlternarBaze(publicacao: Publicacao): void {
    const requisicao = publicacao.temBaze
      ? this.postsApi.unlikePost(publicacao.id)
      : this.postsApi.likePost(publicacao.id);

    requisicao.subscribe({
      next: (likesCount) => {
        this.publicacoes.update((lista) =>
          lista.map((item) =>
            item.id === publicacao.id
              ? { ...item, temBaze: !publicacao.temBaze, contagemBazes: likesCount }
              : item,
          ),
        );
      },
      error: () => this.carregarFeed(),
    });
  }

  aoAtualizar(): void {
    this.carregarFeed();
    const el = document.querySelector('.conteudo-principal');
    el?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private carregarFeed(): void {
    this.carregandoFeed.set(true);
    this.erroFeed.set('');

    const request =
      this.filtroActivo() === 'seguidos'
        ? this.postsApi.getFollowingFeed()
        : this.postsApi.getGlobalFeed();

    request.subscribe({
      next: (posts) => {
        let publicacoes = posts.map((post) => this.toPublicacao(post));
        if (this.filtroActivo() === 'populares') {
          publicacoes = [...publicacoes].sort((a, b) => b.contagemBazes - a.contagemBazes);
        }
        this.publicacoes.set(publicacoes);
        this.carregandoFeed.set(false);
        this.destacarPublicacaoPartilhada();
      },
      error: (err) => {
        this.erroFeed.set(mensagemErroHttp(err));
        this.carregandoFeed.set(false);
      },
    });
  }

  private destacarPublicacaoPartilhada(): void {
    const params = this.route.snapshot.queryParamMap;
    const idParam = params.get('post');
    if (!idParam) return;

    const id = Number(idParam);
    const publicacao = this.publicacoes().find((p) => p.id === id);
    if (!publicacao) return;

    if (this.destaqueTimer) clearTimeout(this.destaqueTimer);
    this.postDestacadoId.set(id);
    setTimeout(() => document.getElementById(`publicacao-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
    this.destaqueTimer = setTimeout(() => this.postDestacadoId.set(null), 2500);

    const bazesParam = params.get('bazes');
    if (bazesParam) {
      this.likerDestacadoId.set(Number(bazesParam));
    }

    const comentarioParam = params.get('comentario');
    if (comentarioParam) {
      this.comentarioDestacadoId.set(Number(comentarioParam));
      this.abrirComentarios(publicacao);
    }
  }

  private carregarSugestoes(): void {
    const currentUserId = this.auth.currentUser()?.id;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.sugestoes.set(users.filter((u) => u.id !== currentUserId).slice(0, 3));
      },
    });
  }

  private toPublicacao(post: Post): Publicacao {
    return {
      id: post.id,
      autorId: post.author.id,
      autorNome: post.author.name,
      autorAvatar: post.author.profile_photo ?? avatarFallback(post.author.name),
      autorDescricao: post.author.bio ?? undefined,
      tempoPublicacao: this.formatarData(post.created_at),
      conteudo: post.content,
      imagem: post.image ?? undefined,
      imagemAlt: `Publicação de ${post.author.name}`,
      videoUrl: post.video ?? undefined,
      contagemBazes: post.likes_count ?? 0,
      contagemComentarios: post.comments_count,
      contagemPartilhas: 0,
      temBaze: post.liked_by_me ?? false,
      podeEditar: post.can_update ?? false,
      podeEliminar: post.can_delete ?? false,
    };
  }

  private formatarData(value: string): string {
    if (!value) {
      return 'agora';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return 'agora';
    }

    return new Intl.DateTimeFormat('pt-AO', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }
}
