import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { User } from '../../models/fase1.model';
import { PostService } from '../../services/post.service';
import { ModalComponent } from '../modal/modal.component';
import { ModalDenunciaComponent } from '../modal-denuncia/modal-denuncia.component';

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
  contagemBazes: number;
  contagemComentarios: number;
  contagemPartilhas: number;
  temBaze?: boolean;
  podeEditar?: boolean;
  podeEliminar?: boolean;
}

@Component({
  selector: 'app-cartao-publicacao',
  imports: [CommonModule, RouterLink, ModalComponent, ModalDenunciaComponent],
  templateUrl: './cartao-publicacao.component.html',
  styleUrl: './cartao-publicacao.component.css'
})
export class CartaoPublicacaoComponent implements OnInit, OnChanges {
  private readonly postService = inject(PostService);

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

  modalBazesAberto = signal(false);
  likers = signal<User[]>([]);
  carregandoLikers = signal(false);

  modalDenunciaAberto = signal(false);

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

  abrirDenuncia(): void {
    this.modalDenunciaAberto.set(true);
    this.menuAberto.set(false);
  }

  confirmarEliminar(): void {
    this.eliminar.emit(this.publicacao.id);
    this.modalEliminarAberto.set(false);
  }

  abrirBazes(): void {
    if (this.contagemBaze() === 0) return;
    this.modalBazesAberto.set(true);
    this.carregandoLikers.set(true);
    this.postService.getPostLikers(this.publicacao.id).subscribe({
      next: (users) => {
        this.likers.set(users);
        this.carregandoLikers.set(false);
      },
      error: () => this.carregandoLikers.set(false),
    });
  }

  partilhar(): void {
    const url = `${window.location.origin}/feed?post=${this.publicacao.id}`;
    this.menuAberto.set(false);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        this.partilhado.set(true);
        window.setTimeout(() => this.partilhado.set(false), 2000);
      });
    } else {
      this.partilhado.set(true);
      window.setTimeout(() => this.partilhado.set(false), 2000);
    }
  }
}
