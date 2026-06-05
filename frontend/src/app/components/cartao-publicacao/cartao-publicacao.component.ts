import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';

export interface Publicacao {
  id: number;
  autorId: number;
  autorNome: string;
  autorAvatar: string;
  autorDescricao?: string;
  tempoPublicacao: string;
  localizacao?: string;
  conteudo: string;
  imagem?: string;
  imagemAlt?: string;
  videoUrl?: string;
  videoUrl?: string;
  contagemBazes: number;
  contagemComentarios: number;
  contagemPartilhas: number;
  temBaze?: boolean;
  podeEditar?: boolean;
  podeEliminar?: boolean;
}

@Component({
  selector: 'app-cartao-publicacao',
  imports: [CommonModule, ModalComponent, ReactiveFormsModule],
  templateUrl: './cartao-publicacao.component.html',
  styleUrl: './cartao-publicacao.component.css'
})
export class CartaoPublicacaoComponent implements OnInit, OnChanges {
  @Input() publicacao!: Publicacao;
  @Output() eliminar = new EventEmitter<number>();
  @Output() editar = new EventEmitter<{ id: number; conteudo: string }>();
  @Output() abrirComentarios = new EventEmitter<Publicacao>();
  @Output() alternarBaze = new EventEmitter<Publicacao>();

  bazeActivo = signal(false);
  contagemBaze = signal(0);
  menuAberto = signal(false);
  partilhado = signal(false);
  modalEliminarAberto = signal(false);
  modalEditarAberto = signal(false);

  conteudoEditado = signal('');

  constructor(private readonly fb: FormBuilder) {}
  modalEliminarAberto = signal(false);
  modalEditarAberto = signal(false);

  conteudoEditado = signal('');

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.sincronizarEstado();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['publicacao']) {
      this.sincronizarEstado();
    }
  }

  private sincronizarEstado(): void {
    this.contagemBaze.set(this.publicacao.contagemBazes);
    this.bazeActivo.set(this.publicacao.temBaze ?? false);
    this.conteudoEditado.set(this.publicacao.conteudo);
    this.conteudoEditado.set(this.publicacao.conteudo);
  }

  aoBaze(): void {
    this.alternarBaze.emit(this.publicacao);
  }

  alternarMenu(): void {
    this.menuAberto.update((aberto) => !aberto);
  }

  abrirEditar(): void {
    this.conteudoEditado.set(this.publicacao.conteudo);
    this.modalEditarAberto.set(true);
    this.menuAberto.set(false);
  }

  guardarEdicao(): void {
    const texto = this.conteudoEditado().trim();
    if (texto.length >= 10) {
      this.editar.emit({ id: this.publicacao.id, conteudo: texto });
      this.modalEditarAberto.set(false);
    }
  }

  abrirConfirmacaoEliminar(): void {
    this.modalEliminarAberto.set(true);
    this.menuAberto.set(false);
  }

  confirmarEliminar(): void {
    this.eliminar.emit(this.publicacao.id);
    this.modalEliminarAberto.set(false);
  }

  abrirEditar(): void {
    this.conteudoEditado.set(this.publicacao.conteudo);
    this.modalEditarAberto.set(true);
    this.menuAberto.set(false);
  }

  guardarEdicao(): void {
    const texto = this.conteudoEditado().trim();
    if (texto.length >= 10) {
      this.editar.emit({ id: this.publicacao.id, conteudo: texto });
      this.modalEditarAberto.set(false);
    }
  }

  abrirConfirmacaoEliminar(): void {
    this.modalEliminarAberto.set(true);
    this.menuAberto.set(false);
  }

  confirmarEliminar(): void {
    this.eliminar.emit(this.publicacao.id);
    this.modalEliminarAberto.set(false);
  }

  partilhar(): void {
    this.partilhado.set(true);
    this.menuAberto.set(false);
    this.menuAberto.set(false);
    window.setTimeout(() => this.partilhado.set(false), 1800);
  }
}
