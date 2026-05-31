import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cabecalho',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cabecalho.component.html',
  styleUrl: './cabecalho.component.css',
})
export class CabecalhoComponent {
  @Input() termoPesquisa = signal('');

  temNotificacoes = true;

  aoPesquisar(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    this.termoPesquisa.set(input.value);
  }
}
