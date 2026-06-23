import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { CartaoPublicacaoComponent, Publicacao } from '../../components/cartao-publicacao/cartao-publicacao.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { Post } from '../../models/fase1.model';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post.service';
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
  selector: 'app-minhas-publicacoes',
  imports: [CabecalhoComponent, CartaoPublicacaoComponent, MenuLateralComponent, RouterLink],
  templateUrl: './minhas-publicacoes.component.html',
  styleUrl: './minhas-publicacoes.component.css',
})
export class MinhasPublicacoesComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly postsApi = inject(PostService);

  publicacoes = signal<Publicacao[]>([]);
  carregando = signal(true);
  erro = signal('');

  ngOnInit(): void {
    this.carregarPublicacoes();
  }

  aoEliminar(id: number): void {
    this.postsApi.deletePost(id).subscribe({
      next: () => this.publicacoes.update((lista) => lista.filter((p) => p.id !== id)),
      error: (err) => this.erro.set(mensagemErroHttp(err)),
    });
  }

  aoEditar(evento: { id: number; conteudo: string }): void {
    this.postsApi.updatePost(evento.id, evento.conteudo).subscribe({
      next: (post) => {
        this.publicacoes.update((lista) =>
          lista.map((item) => (item.id === post.id ? this.toPublicacao(post) : item)),
        );
      },
      error: (err) => this.erro.set(mensagemErroHttp(err)),
    });
  }

  aoAlternarBaze(publicacao: Publicacao): void {
    const req = publicacao.temBaze
      ? this.postsApi.unlikePost(publicacao.id)
      : this.postsApi.likePost(publicacao.id);

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
      error: () => this.carregarPublicacoes(),
    });
  }

  private carregarPublicacoes(): void {
    this.carregando.set(true);
    this.erro.set('');

    const currentUserId = this.auth.currentUser()?.id;

    this.postsApi.getGlobalFeed().subscribe({
      next: (posts) => {
        const minhas = posts.filter((p) => p.author.id === currentUserId);
        this.publicacoes.set(minhas.map((p) => this.toPublicacao(p)));
        this.carregando.set(false);
      },
      error: (err) => {
        this.erro.set(mensagemErroHttp(err));
        this.carregando.set(false);
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
