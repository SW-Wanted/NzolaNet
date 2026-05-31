import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface Publicacao {
  id: string;
  autorNome: string;
  autorAvatar: string;
  autorDescricao?: string;
  tempoPublicacao: string;
  localizacao?: string;
  conteudo: string;
  imagem?: string;
  imagemAlt?: string;
  contagemBazes: number;
  contagemComentarios: number;
  contagemPartilhas: number;
  temBaze?: boolean;
}

@Component({
  selector: 'app-cartao-publicacao',
  imports: [CommonModule, RouterLink],
  templateUrl: './cartao-publicacao.component.html',
  styleUrl: './cartao-publicacao.component.css'
})
export class CartaoPublicacaoComponent {
  @Input() publicacao!: Publicacao;

  bazeActivo = signal(false);
  contagemBaze = signal(0);
  menuAberto = signal(false);
  partilhado = signal(false);

  ngOnInit(): void {
    this.contagemBaze.set(this.publicacao.contagemBazes);
    this.bazeActivo.set(this.publicacao.temBaze ?? false);
  }

  aoBaze(): void {
    if (this.bazeActivo()) {
      this.contagemBaze.update(c => c - 1);
      this.bazeActivo.set(false);
    } else {
      this.contagemBaze.update(c => c + 1);
      this.bazeActivo.set(true);
    }
  }

  alternarMenu(): void {
    this.menuAberto.update((aberto) => !aberto);
  }

  partilhar(): void {
    this.partilhado.set(true);
    window.setTimeout(() => this.partilhado.set(false), 1800);
  }
}
