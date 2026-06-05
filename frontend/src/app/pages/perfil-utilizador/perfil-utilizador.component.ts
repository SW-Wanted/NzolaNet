import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { Post } from '../../models/fase1.model';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-perfil-utilizador',
  imports: [CabecalhoComponent, MenuLateralComponent, RouterLink],
  templateUrl: './perfil-utilizador.component.html',
  styleUrl: './perfil-utilizador.component.css',
})
export class PerfilUtilizadorComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly posts = inject(PostService);

  readonly utilizador = this.auth.currentUser;
  readonly publicacoes = signal<Post[]>([]);
  readonly eventos = signal<unknown[]>([]);
  readonly avatar = computed(() => {
    const u = this.utilizador();
    return u?.profile_photo ?? `https://ui-avatars.com/api/?background=111827&color=ffffff&name=${encodeURIComponent(u?.name ?? 'Utilizador')}`;
  });

  ngOnInit(): void {
    this.auth.getCurrentUserFromServer().subscribe();
    this.posts.getGlobalFeed().subscribe({
      next: (posts) => {
        const currentUserId = this.auth.currentUser()?.id;
        this.publicacoes.set(posts.filter((post) => post.author.id === currentUserId));
      },
    });
  }
}
