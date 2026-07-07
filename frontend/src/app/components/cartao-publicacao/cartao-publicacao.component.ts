import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { User } from '../../models/fase1.model';
import { PostService } from '../../services/post.service';
import { ModalComponent } from '../modal/modal.component';
import { ModalDenunciaComponent } from '../modal-denuncia/modal-denuncia.component';

export interface PublicacaoEditada {
  id: number;
  conteudo: string;
  imagemFile?: File;
  videoFile?: File;
  removerImagem?: boolean;
  removerVideo?: boolean;
}

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
  @Input() destacado = false;
  @Output() eliminar = new EventEmitter<number>();
  @Output() editar = new EventEmitter<PublicacaoEditada>();
  @Output() abrirComentarios = new EventEmitter<Publicacao>();
  @Output() alternarBaze = new EventEmitter<Publicacao>();

  bazeActivo = signal(false);
  contagemBaze = signal(0);
  menuAberto = signal(false);
  partilhado = signal(false);
  modalEliminarAberto = signal(false);
  modalEditarAberto = signal(false);
  conteudoEditado = signal('');
  previewMediaEdit = signal('');
  tipoMediaEdit = signal<'imagem' | 'video'>('imagem');
  erroEdicao = signal('');
  private mediaEditadaSelecionada: File | undefined;
  private removerImagemEditAtual = false;
  private removerVideoEditAtual = false;

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
    this.erroEdicao.set('');
    this.mediaEditadaSelecionada = undefined;
    this.removerImagemEditAtual = false;
    this.removerVideoEditAtual = false;

    if (this.publicacao.videoUrl) {
      this.tipoMediaEdit.set('video');
      this.previewMediaEdit.set(this.publicacao.videoUrl);
    } else if (this.publicacao.imagem) {
      this.tipoMediaEdit.set('imagem');
      this.previewMediaEdit.set(this.publicacao.imagem);
    } else {
      this.previewMediaEdit.set('');
    }

    this.modalEditarAberto.set(true);
    this.menuAberto.set(false);
  }

  aoSelecionarMediaEdicao(evento: Event, tipo: 'imagem' | 'video'): void {
    const input = evento.target as HTMLInputElement;
    const ficheiro = input.files?.[0];
    if (!ficheiro) return;

    const limiteMb = tipo === 'imagem' ? 8 : 50;
    const tipoValido =
      tipo === 'imagem' ? ficheiro.type.startsWith('image/') : ficheiro.type.startsWith('video/');

    if (!tipoValido || ficheiro.size > limiteMb * 1024 * 1024) {
      this.erroEdicao.set(
        `Selecione um ficheiro ${tipo === 'imagem' ? 'de imagem' : 'de vídeo'} válido até ${limiteMb} MB.`,
      );
      input.value = '';
      return;
    }

    this.erroEdicao.set('');
    this.mediaEditadaSelecionada = ficheiro;
    this.tipoMediaEdit.set(tipo);
    // Ao substituir por um tipo diferente do original, marca o anterior para remoção.
    this.removerImagemEditAtual = tipo === 'video' && Boolean(this.publicacao.imagem);
    this.removerVideoEditAtual = tipo === 'imagem' && Boolean(this.publicacao.videoUrl);
    if (this.previewMediaEdit().startsWith('blob:')) {
      URL.revokeObjectURL(this.previewMediaEdit());
    }
    this.previewMediaEdit.set(URL.createObjectURL(ficheiro));
  }

  removerMediaEdicao(): void {
    if (this.previewMediaEdit().startsWith('blob:')) {
      URL.revokeObjectURL(this.previewMediaEdit());
    }
    this.previewMediaEdit.set('');
    this.mediaEditadaSelecionada = undefined;
    this.removerImagemEditAtual = Boolean(this.publicacao.imagem);
    this.removerVideoEditAtual = Boolean(this.publicacao.videoUrl);
  }

  guardarEdicao(): void {
    const texto = this.conteudoEditado().trim();
    if (texto.length >= 10) {
      this.editar.emit({
        id: this.publicacao.id,
        conteudo: texto,
        imagemFile: this.tipoMediaEdit() === 'imagem' ? this.mediaEditadaSelecionada : undefined,
        videoFile: this.tipoMediaEdit() === 'video' ? this.mediaEditadaSelecionada : undefined,
        removerImagem: this.removerImagemEditAtual,
        removerVideo: this.removerVideoEditAtual,
      });
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
