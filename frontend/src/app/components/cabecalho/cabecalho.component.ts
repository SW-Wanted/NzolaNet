import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?background=111827&color=ffffff&name=NzolaNet';

@Component({
  selector: 'app-cabecalho',
  imports: [RouterLink],
  templateUrl: './cabecalho.component.html',
  styleUrl: './cabecalho.component.css',
})
export class CabecalhoComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly utilizador = computed(() => this.auth.currentUser());
  readonly avatar = computed(() => this.utilizador()?.profile_photo ?? DEFAULT_AVATAR);
  readonly nomeUtilizador = computed(() => this.utilizador()?.name ?? 'Utilizador');
  readonly isAuthenticated = computed(() => this.auth.isAuthenticated());

  termoPesquisa = signal('');

  sairDaSessao(): void {
    this.auth.logout().subscribe({
      next: () => this.router.navigateByUrl('/entrar'),
      error: () => {
        this.auth.clearSession();
        this.router.navigateByUrl('/entrar');
      },
    });
  }
}
