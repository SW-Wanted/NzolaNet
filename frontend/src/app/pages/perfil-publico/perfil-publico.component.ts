import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import {
  CartaoPublicacaoComponent,
  Publicacao,
  PublicacaoEditada,
} from '../../components/cartao-publicacao/cartao-publicacao.component';
import { DrawerComentariosComponent } from '../../components/drawer-comentarios/drawer-comentarios.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { Post, User } from '../../models/fase1.model';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { mensagemErroHttp } from '../../utils/erro.utils';

function avatarFallback(name: string): string {
  return `https://ui-avatars.com/api/?background=111827&color=ffffff&name=${encodeURIComponent(name)}`;
}

function formatarData(value: string): string {
  if (!value) return 'agora';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'agora';
  return new Intl.DateTimeFormat('pt-AO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

@Component({
  selector: 'app-perfil-publico',
  imports: [
    CabecalhoComponent,
    CartaoPublicacaoComponent,
    DrawerComentariosComponent,
    MenuLateralComponent,
    RouterLink,
  ],
  templateUrl: './perfil-publico.component.html',
  styleUrl: './perfil-publico.component.css',
})
export class PerfilPublicoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly postService = inject(PostService);
  private readonly auth = inject(AuthService);

  utilizador = signal<User | null>(null);
  carregando = signal(true);
  erro = signal('');
  perfilPrivado = signal(false);
  emSeguindo = signal(false);

  publicacoes = signal<Publicacao[]>([]);
  carregandoPosts = signal(false);
  erroPosts = signal('');

  drawerComentariosAberto = signal(false);
  publicacaoActiva = signal<Publicacao | null>(null);

  readonly euProprioId = computed(() => this.auth.currentUser()?.id);
  readonly ehEuProprio = computed(() => this.utilizador()?.id === this.euProprioId());

  readonly avatar = computed(() => {
    const u = this.utilizador();
    return u?.profile_photo ?? avatarFallback(u?.name ?? 'Utilizador');
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.erro.set('Utilizador não encontrado.');
      this.carregando.set(false);
      return;
    }
    this.userService.getUserProfile(id).subscribe({
      next: (user) => {
        this.utilizador.set(user);
        this.carregando.set(false);
        this.carregarPublicacoes(user.id);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 403) {
          this.perfilPrivado.set(true);
        } else {
          this.erro.set('Não foi possível carregar o perfil.');
        }
        this.carregando.set(false);
      },
    });
  }

  alternarSeguir(): void {
    const user = this.utilizador();
    if (!user) return;
    this.emSeguindo.set(true);

    const req = user.is_following
      ? this.userService.unfollow(user.id)
      : this.userService.toggleFollow(user.id);

    req.subscribe({
      next: () => {
        this.utilizador.update((u) =>
          u
            ? {
                ...u,
                is_following: !u.is_following,
                followers_count: Math.max(0, u.followers_count + (u.is_following ? -1 : 1)),
              }
            : u,
        );
        this.emSeguindo.set(false);
      },
      error: () => this.emSeguindo.set(false),
    });
  }

  aoAlternarBaze(publicacao: Publicacao): void {
    const req = publicacao.temBaze
      ? this.postService.unlikePost(publicacao.id)
      : this.postService.likePost(publicacao.id);

    req.subscribe({
      next: (likesCount) => {
        this.publicacoes.update((lista) =>
          lista.map((item) =>
            item.id === publicacao.id
              ? { ...item, temBaze: !publicacao.temBaze, contagemBazes: likesCount }
              : item,
          ),
        );
      },
      error: () => {},
    });
  }

  aoEliminar(id: number): void {
    this.postService.deletePost(id).subscribe({
      next: () => this.publicacoes.update((lista) => lista.filter((p) => p.id !== id)),
      error: (err) => this.erroPosts.set(mensagemErroHttp(err)),
    });
  }

  aoEditar(evento: PublicacaoEditada): void {
    this.postService
      .updatePost(evento.id, evento.conteudo, {
        image: evento.imagemFile,
        video: evento.videoFile,
        removeImage: evento.removerImagem,
        removeVideo: evento.removerVideo,
      })
      .subscribe({
      next: (post) => {
        this.publicacoes.update((lista) =>
          lista.map((item) => (item.id === post.id ? this.toPublicacao(post) : item)),
        );
      },
      error: (err) => this.erroPosts.set(mensagemErroHttp(err)),
    });
  }

  abrirComentarios(publicacao: Publicacao): void {
    this.publicacaoActiva.set(publicacao);
    this.drawerComentariosAberto.set(true);
  }

  fecharComentarios(): void {
    this.drawerComentariosAberto.set(false);
    this.publicacaoActiva.set(null);
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

  private carregarPublicacoes(userId: number): void {
    this.carregandoPosts.set(true);
    this.erroPosts.set('');

    this.postService.getGlobalFeed().subscribe({
      next: (posts) => {
        const doUtilizador = posts.filter((p) => p.author.id === userId);
        this.publicacoes.set(doUtilizador.map((p) => this.toPublicacao(p)));
        this.carregandoPosts.set(false);
      },
      error: (err) => {
        this.erroPosts.set(mensagemErroHttp(err));
        this.carregandoPosts.set(false);
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
      tempoPublicacao: formatarData(post.created_at),
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
}
