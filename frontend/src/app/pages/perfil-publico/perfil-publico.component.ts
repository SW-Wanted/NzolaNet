import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { User } from '../../models/fase1.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

function avatarFallback(name: string): string {
  return `https://ui-avatars.com/api/?background=111827&color=ffffff&name=${encodeURIComponent(name)}`;
}

@Component({
  selector: 'app-perfil-publico',
  imports: [CabecalhoComponent, MenuLateralComponent, RouterLink],
  templateUrl: './perfil-publico.component.html',
  styleUrl: './perfil-publico.component.css',
})
export class PerfilPublicoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly auth = inject(AuthService);

  utilizador = signal<User | null>(null);
  carregando = signal(true);
  erro = signal('');
  emSeguindo = signal(false);

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
      },
      error: () => {
        this.erro.set('Não foi possível carregar o perfil.');
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
}
