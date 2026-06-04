import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

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
  itensMenuSuperior: ItemMenu[] = [
    { icone: 'home', etiqueta: 'Início', rota: '/feed' },
    { icone: 'video_library', etiqueta: 'Kizomba Hub', rota: '/kizomba-hub' },
    { icone: 'groups', etiqueta: 'Grupos', rota: '/grupos' },
    { icone: 'store', etiqueta: 'Nzola Market', rota: '/mercado' },
    { icone: 'event', etiqueta: 'Eventos', rota: '/eventos' },
    { icone: 'person', etiqueta: 'Perfil', rota: '/perfil' },
  ];

  itensMenuInferior: ItemMenu[] = [
    { icone: 'settings', etiqueta: 'Definições', rota: '/perfil/editar' },
    { icone: 'group_add', etiqueta: 'Sugestões', rota: '/sugestoes' },
    { icone: 'login', etiqueta: 'Entrar / Registar', rota: '/entrar' },
  ];
}
