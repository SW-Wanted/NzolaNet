import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

function avatarFallback(name: string): string {
  return `https://ui-avatars.com/api/?background=111827&color=ffffff&name=${encodeURIComponent(name)}`;
}

@Component({
  selector: 'app-cabecalho',
  imports: [RouterLink, FormsModule],
  templateUrl: './cabecalho.component.html',
  styleUrl: './cabecalho.component.css',
})
export class CabecalhoComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly utilizador = computed(() => this.auth.currentUser());
  readonly nomeUtilizador = computed(() => this.utilizador()?.name ?? 'Utilizador');
  readonly avatar = computed(() => this.utilizador()?.profile_photo ?? avatarFallback(this.nomeUtilizador()));
  readonly isAuthenticated = computed(() => this.auth.isAuthenticated());

  termoPesquisa = signal('');

  pesquisar(): void {
    const termo = this.termoPesquisa().trim();
    if (!termo) return;
    this.router.navigate(['/sugestoes'], { queryParams: { q: termo } });
  }

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
