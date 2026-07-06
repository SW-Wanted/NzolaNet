import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

function avatarFallback(name: string): string {
  return `https://ui-avatars.com/api/?background=7b5900&color=ffffff&bold=true&name=${encodeURIComponent(name)}`;
}

/**
 * Barra superior do painel de Administração.
 * Apresenta o distintivo de administrador e o acesso ao perfil.
 */
@Component({
  selector: 'app-cabecalho-admin',
  imports: [RouterLink],
  templateUrl: './cabecalho-admin.component.html',
  styleUrl: './cabecalho-admin.component.css',
})
export class CabecalhoAdminComponent {
  private readonly auth = inject(AuthService);

  readonly nome = computed(() => this.auth.currentUser()?.name ?? 'Administrador');
  readonly avatar = computed(() => this.auth.currentUser()?.profile_photo ?? avatarFallback(this.nome()));
}
