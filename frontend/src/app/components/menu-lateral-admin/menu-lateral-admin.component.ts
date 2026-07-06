import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface ItemMenuAdmin {
  icone: string;
  etiqueta: string;
  rota: string;
}

/**
 * Barra lateral exclusiva do painel de Administração.
 *
 * Fornece a navegação própria do dashboard de administrador, separada
 * da navegação principal da aplicação.
 */
@Component({
  selector: 'app-menu-lateral-admin',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu-lateral-admin.component.html',
  styleUrl: '../menu-lateral/menu-lateral.component.css',
})
export class MenuLateralAdminComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly nomeAdmin = computed(() => this.auth.currentUser()?.name ?? 'Administrador');

  itensGestao: ItemMenuAdmin[] = [
    { icone: 'dashboard', etiqueta: 'Dashboard', rota: '/admin' },
    { icone: 'group', etiqueta: 'Utilizadores', rota: '/admin/utilizadores' },
    { icone: 'flag', etiqueta: 'Denúncias', rota: '/admin/denuncias' },
  ];

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
