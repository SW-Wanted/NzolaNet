import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

/** Navegação inferior do painel de administração (apenas em ecrãs pequenos). */
@Component({
  selector: 'app-menu-inferior-admin',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu-inferior-admin.component.html',
  styleUrl: '../../pages/telas.css',
})
export class MenuInferiorAdminComponent {}
