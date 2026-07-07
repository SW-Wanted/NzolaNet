import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Comment } from '../../models/fase1.model';
import { CommentService } from '../../services/comment.service';
import { mensagemErroHttp } from '../../utils/erro.utils';
import { Publicacao } from '../cartao-publicacao/cartao-publicacao.component';
import { ModalComponent } from '../modal/modal.component';
import { ModalDenunciaComponent } from '../modal-denuncia/modal-denuncia.component';

interface ComentarioView {
  id: number;
  autor: string;
  autorAvatar: string;
  texto: string;
  data: string;
  podeEditar: boolean;
  podeEliminar: boolean;
}

function avatarFallback(name: string): string {
  return `https://ui-avatars.com/api/?background=111827&color=ffffff&name=${encodeURIComponent(name)}`;
}

@Component({
  selector: 'app-drawer-comentarios',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, ModalComponent, ModalDenunciaComponent],
  templateUrl: './drawer-comentarios.component.html',
  styleUrl: './drawer-comentarios.component.css',
})
export class DrawerComentariosComponent implements OnChanges {
  private readonly comentariosApi = inject(CommentService);
  private readonly fb = inject(FormBuilder);

  @Input() aberto = false;
  @Input() publicacao: Publicacao | null = null;
  @Input() comentarioDestacadoId: number | null = null;
  @Output() fechar = new EventEmitter<void>();
  @Output() contagemAlterada = new EventEmitter<{ postId: number; delta: number }>();

  readonly publicacaoView = signal<Publicacao | null>(null);
  readonly comentarios = signal<ComentarioView[]>([]);
  readonly editandoComentarioId = signal<number | null>(null);
  readonly textoEdicaoComentario = signal('');
  comentarioSubmetido = false;
  readonly enviandoComentario = signal(false);
  readonly erroComentario = signal('');

  readonly denunciaComentarioAberta = signal(false);
  readonly comentarioDenunciado = signal<ComentarioView | null>(null);

  readonly formularioComentario = this.fb.nonNullable.group({
    texto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(2000)]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['publicacao']) {
      this.publicacaoView.set(this.publicacao);

      if (this.publicacao) {
        this.formularioComentario.reset();
        this.comentarioSubmetido = false;
        this.cancelarEdicaoComentario();
        this.carregarComentarios(this.publicacao.id);
      } else {
        this.comentarios.set([]);
      }
    }
  }

  fecharDrawer(): void {
    this.fechar.emit();
  }

  abrirDenunciaComentario(comentario: ComentarioView): void {
    this.comentarioDenunciado.set(comentario);
    this.denunciaComentarioAberta.set(true);
  }

  adicionarComentario(): void {
    const publicacao = this.publicacaoView();
    this.comentarioSubmetido = true;
    this.erroComentario.set('');

    if (!publicacao || this.formularioComentario.invalid || this.enviandoComentario()) {
      this.formularioComentario.markAllAsTouched();
      return;
    }

    this.enviandoComentario.set(true);
    this.comentariosApi
      .addComment(publicacao.id, this.formularioComentario.controls.texto.value.trim())
      .subscribe({
        next: (comentario) => {
          this.comentarios.update((lista) => [...lista, this.toComentarioView(comentario)]);
          this.formularioComentario.reset();
          this.comentarioSubmetido = false;
          this.enviandoComentario.set(false);
          this.atualizarContagem(publicacao.id, 1);
        },
        error: (err) => {
          this.erroComentario.set(mensagemErroHttp(err));
          this.enviandoComentario.set(false);
        },
      });
  }

  removerComentario(id: number): void {
    const publicacao = this.publicacaoView();

    this.comentariosApi.deleteComment(id).subscribe({
      next: () => {
        this.comentarios.update((lista) => lista.filter((comentario) => comentario.id !== id));
        if (publicacao) {
          this.atualizarContagem(publicacao.id, -1);
        }
      },
      error: (err) => this.erroComentario.set(mensagemErroHttp(err)),
    });
  }

  iniciarEdicaoComentario(id: number, texto: string): void {
    this.editandoComentarioId.set(id);
    this.textoEdicaoComentario.set(texto);
  }

  cancelarEdicaoComentario(): void {
    this.editandoComentarioId.set(null);
    this.textoEdicaoComentario.set('');
  }

  guardarEdicaoComentario(id: number): void {
    const texto = this.textoEdicaoComentario().trim();

    if (texto.length < 3) {
      this.erroComentario.set('O comentário precisa de pelo menos 3 caracteres.');
      return;
    }

    this.comentariosApi.updateComment(id, texto).subscribe({
      next: (comentario) => {
        this.comentarios.update((lista) =>
          lista.map((item) => (item.id === id ? this.toComentarioView(comentario) : item)),
        );
        this.cancelarEdicaoComentario();
      },
      error: (err) => this.erroComentario.set(mensagemErroHttp(err)),
    });
  }

  private atualizarContagem(postId: number, delta: number): void {
    this.publicacaoView.update((activa) =>
      activa
        ? { ...activa, contagemComentarios: Math.max(0, activa.contagemComentarios + delta) }
        : activa,
    );
    this.contagemAlterada.emit({ postId, delta });
  }

  private carregarComentarios(postId: number): void {
    this.erroComentario.set('');
    this.comentarios.set([]);

    this.comentariosApi.getComments(postId).subscribe({
      next: (comentarios) => {
        this.comentarios.set(comentarios.map((comentario) => this.toComentarioView(comentario)));
        if (this.comentarioDestacadoId) {
          const id = this.comentarioDestacadoId;
          setTimeout(() =>
            document.getElementById(`comentario-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
          );
        }
      },
      error: (err) => this.erroComentario.set(mensagemErroHttp(err)),
    });
  }

  private toComentarioView(comment: Comment): ComentarioView {
    return {
      id: comment.id,
      autor: comment.author.name,
      autorAvatar: comment.author.profile_photo ?? avatarFallback(comment.author.name),
      texto: comment.content,
      data: this.formatarData(comment.created_at),
      podeEditar: comment.can_update ?? false,
      podeEliminar: comment.can_delete ?? false,
    };
  }

  private formatarData(value: string): string {
    if (!value) return 'agora';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'agora';
    return new Intl.DateTimeFormat('pt-AO', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }
}
