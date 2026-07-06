import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { Post } from '../../models/fase1.model';
import { PostService } from '../../services/post.service';
import { mensagemErroHttp } from '../../utils/erro.utils';

@Component({
  selector: 'app-estatisticas-likes',
  imports: [CabecalhoComponent, MenuLateralComponent, RouterLink],
  templateUrl: './estatisticas-likes.component.html',
  styleUrl: './estatisticas-likes.component.css',
})
export class EstatisticasLikesComponent implements OnInit {
  private readonly postService = inject(PostService);

  publicacoes = signal<Post[]>([]);
  carregando = signal(false);
  erro = signal('');

  ngOnInit(): void {
    this.carregarPublicacoes();
  }

  private carregarPublicacoes(): void {
    this.carregando.set(true);
    this.erro.set('');

    this.postService.getGlobalFeed().subscribe({
      next: (posts) => {
        // Ordena por número de likes (descendente)
        this.publicacoes.set(posts.sort((a, b) => (b.likes_count ?? 0) - (a.likes_count ?? 0)));
        this.carregando.set(false);
      },
      error: (err) => {
        this.erro.set(mensagemErroHttp(err));
        this.carregando.set(false);
      },
    });
  }
}
