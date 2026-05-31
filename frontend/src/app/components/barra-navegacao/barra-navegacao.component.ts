import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ItemNavegacao {
  icone: string;
  etiqueta: string;
  activa?: boolean;
}

@Component({
  selector: 'app-barra-navegacao',
  imports: [CommonModule],
  templateUrl: './barranavegacao.component.html',
  styleUrl: './barranavegacao.component.css',
})
export class BarraNavegacaoComponent {

  itens: ItemNavegacao[] = [
    { icone: 'home', etiqueta: 'Início', activa: true },
    { icone: 'explore', etiqueta: 'Explorar', activa: false },
    { icone: 'add_circle', etiqueta: 'Publicar', activa: false },
    { icone: 'notifications', etiqueta: 'Notificações', activa: false },
    { icone: 'person', etiqueta: 'Perfil', activa: false },
  ];

  aoClicarItem(item: ItemNavegacao): void {
    this.itens = this.itens.map(i => ({
      ...i,
      activa: i === item
    }));
  }
}
