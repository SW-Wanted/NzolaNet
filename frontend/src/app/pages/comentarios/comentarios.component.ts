import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { Comment, Post } from '../../models/fase1.model';
import { CommentService } from '../../services/comment.service';
import { PostService } from '../../services/post.service';

interface ComentarioView {
  id: number;
  autor: string;
  texto: string;
  estado: 'aprovado' | 'pendente';
  podeEditar: boolean;
  podeEliminar: boolean;
}

@Component({
  selector: 'app-comentarios',
  imports: [CabecalhoComponent, MenuLateralComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.css',
})
export class ComentariosComponent implements OnInit {
  private readonly comments = inject(CommentService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly posts = inject(PostService);

  readonly comentarios = signal<ComentarioView[]>([]);
  readonly postAtual = signal<Post | null>(null);
  readonly erroApi = signal('');

  readonly formulario = this.formBuilder.nonNullable.group({
    texto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(2000)]],
  });

  submetido = false;
  editandoId = signal<number | null>(null);
  textoEdicao = signal('');

  ngOnInit(): void {
    this.posts.getGlobalFeed().subscribe({
      next: (posts) => {
        const post = posts[0] ?? null;
        this.postAtual.set(post);
        if (post) {
          this.carregarComentarios(post.id);
        }
      },
      error: () => this.erroApi.set('Nao foi possivel carregar publicacoes para comentarios.'),
    });
  }

  adicionarComentario(): void {
    this.submetido = true;
    this.erroApi.set('');
    const post = this.postAtual();

    if (!post || this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.comments.addComment(post.id, this.formulario.controls.texto.value.trim()).subscribe({
      next: (comment) => {
        this.comentarios.update((lista) => [...lista, this.toView(comment)]);
        this.formulario.reset();
        this.submetido = false;
      },
      error: () => this.erroApi.set('Nao foi possivel adicionar o comentario.'),
    });
  }

  removerComentario(id: number): void {
    this.comments.deleteComment(id).subscribe({
      next: () => this.comentarios.update((lista) => lista.filter((comentario) => comentario.id !== id)),
      error: () => this.erroApi.set('Nao foi possivel remover o comentario.'),
    });
  }

  iniciarEdicao(id: number, texto: string): void {
    this.editandoId.set(id);
    this.textoEdicao.set(texto);
  }

  cancelarEdicao(): void {
    this.editandoId.set(null);
    this.textoEdicao.set('');
  }

  guardarEdicao(id: number): void {
    const texto = this.textoEdicao().trim();

    if (texto.length < 3) {
      this.erroApi.set('O comentario precisa de pelo menos 3 caracteres.');
      return;
    }

    this.comments.updateComment(id, texto).subscribe({
      next: (comment) => {
        this.comentarios.update((lista) =>
          lista.map((item) => (item.id === id ? this.toView(comment) : item)),
        );
        this.cancelarEdicao();
      },
      error: () => this.erroApi.set('Nao foi possivel editar o comentario.'),
    });
  }

  private carregarComentarios(postId: number): void {
    this.comments.getComments(postId).subscribe({
      next: (comments) => this.comentarios.set(comments.map((comment) => this.toView(comment))),
      error: () => this.erroApi.set('Nao foi possivel carregar comentarios.'),
    });
  }

  private toView(comment: Comment): ComentarioView {
    return {
      id: comment.id,
      autor: comment.author.name,
      texto: comment.content,
      estado: 'aprovado',
      podeEditar: comment.can_update ?? false,
      podeEliminar: comment.can_delete ?? false,
    };
  }
}
