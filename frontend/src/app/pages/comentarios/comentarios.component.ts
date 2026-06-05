import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { Comment, Post } from '../../models/fase1.model';
import { CommentService } from '../../services/comment.service';
import { PostService } from '../../services/post.service';
import { mensagemErroHttp } from '../../utils/erro.utils';

interface ComentarioView {
  id: number;
  autor: string;
  texto: string;
  data: string;
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
  private readonly route = inject(ActivatedRoute);

  readonly comentarios = signal<ComentarioView[]>([]);
  readonly postAtual = signal<Post | null>(null);
  readonly erroApi = signal('');
  readonly carregando = signal(false);

  readonly formulario = this.formBuilder.nonNullable.group({
    texto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(2000)]],
  });

  submetido = false;
  editandoId = signal<number | null>(null);
  textoEdicao = signal('');

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const postId = Number(params['postId']);
      if (postId) {
        this.carregarPost(postId);
        this.carregarComentarios(postId);
      }
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
      error: (err) => this.erroApi.set(mensagemErroHttp(err)),
    });
  }

  removerComentario(id: number): void {
    this.comments.deleteComment(id).subscribe({
      next: () => this.comentarios.update((lista) => lista.filter((c) => c.id !== id)),
      error: (err) => this.erroApi.set(mensagemErroHttp(err)),
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
    if (!texto || texto.length < 3) {
      this.erroApi.set('O comentário precisa de pelo menos 3 caracteres.');
      return;
    }
    this.comments.updateComment(id, texto).subscribe({
      next: (comment) => {
        this.comentarios.update((lista) =>
          lista.map((c) => (c.id === id ? this.toView(comment) : c)),
        );
        this.cancelarEdicao();
      },
      error: (err) => this.erroApi.set(mensagemErroHttp(err)),
    });
  }

  private carregarPost(id: number): void {
    this.posts.getPost(id).subscribe({
      next: (post) => this.postAtual.set(post),
      error: (err) => this.erroApi.set(mensagemErroHttp(err)),
    });
  }

  private carregarComentarios(postId: number): void {
    this.carregando.set(true);
    this.erroApi.set('');
    this.comments.getComments(postId).subscribe({
      next: (lista) => {
        this.comentarios.set(lista.map((c) => this.toView(c)));
        this.carregando.set(false);
      },
      error: (err) => {
        this.erroApi.set(mensagemErroHttp(err));
        this.carregando.set(false);
      },
    });
  }

  private toView(comment: Comment): ComentarioView {
    return {
      id: comment.id,
      autor: comment.author.name,
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
