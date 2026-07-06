import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface ItemMenu {
  icone: string;
  etiqueta: string;
  rota: string;
}

@Component({
  selector: 'app-menu-lateral',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './menu-lateral.component.html',
  styleUrl: './menu-lateral.component.css',
})
export class MenuLateralComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly isAuthenticated = computed(() => this.auth.isAuthenticated());
  readonly isAdmin = computed(() => this.auth.currentUser()?.role === 'admin');

  itensMenuSuperior: ItemMenu[] = [
    { icone: 'home', etiqueta: 'Início', rota: '/feed' },
    { icone: 'person', etiqueta: 'Perfil', rota: '/perfil' },
    { icone: 'chat', etiqueta: 'Mensagens', rota: '/chat' },
  ];

  itensMenuInferior: ItemMenu[] = [
    { icone: 'settings', etiqueta: 'Definições', rota: '/perfil/editar' },
    { icone: 'group_add', etiqueta: 'Sugestões', rota: '/sugestoes' },
  ];

  itensMenuAdmin: ItemMenu[] = [
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
