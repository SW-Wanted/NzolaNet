import { Component, inject, signal } from '@angular/core';
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

  editandoId = signal<string | null>(null);
  textoEdicao = signal('');

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

  removerComentario(id: string): void {
    this.dados.removerComentario(id);
  }

  iniciarEdicao(id: string, texto: string): void {
    this.editandoId.set(id);
    this.textoEdicao.set(texto);
  }

  cancelarEdicao(): void {
    this.editandoId.set(null);
    this.textoEdicao.set('');
  }

  guardarEdicao(id: string): void {
    const texto = this.textoEdicao().trim();
    if (!texto) return;
    this.dados.comentarios.update((lista) =>
      lista.map((c) => c.id === id ? { ...c, texto } : c)
    );
    this.cancelarEdicao();
  }
}
