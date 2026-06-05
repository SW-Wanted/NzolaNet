import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { Comment } from '../../models/fase1.model';
import { CommentService } from '../../services/comment.service';
import { mensagemErroHttp } from '../../utils/erro.utils';

@Component({
  selector: 'app-moderacao-comentarios',
  imports: [CabecalhoComponent, MenuLateralComponent, RouterLink],
  templateUrl: './moderacao-comentarios.component.html',
  styleUrl: './moderacao-comentarios.component.css',
})
export class ModeracaoComentariosComponent implements OnInit {
  private readonly commentService = inject(CommentService);

  readonly comentarios = signal<Comment[]>([]);
  readonly carregando = signal(false);
  readonly erroApi = signal('');
  readonly removendoId = signal<number | null>(null);

  ngOnInit(): void {
    this.carregarComentarios();
  }

  removerComentario(id: number): void {
    this.removendoId.set(id);
    this.commentService.adminDeleteComment(id).subscribe({
      next: () => {
        this.comentarios.update((lista) => lista.filter((c) => c.id !== id));
        this.removendoId.set(null);
      },
      error: (err) => {
        this.erroApi.set(mensagemErroHttp(err));
        this.removendoId.set(null);
      },
    });
  }

  private carregarComentarios(): void {
    this.carregando.set(true);
    this.erroApi.set('');
    this.commentService.getAllComments().subscribe({
      next: (lista) => {
        this.comentarios.set(lista);
        this.carregando.set(false);
      },
      error: (err) => {
        this.erroApi.set(mensagemErroHttp(err));
        this.carregando.set(false);
      },
    });
  }
}
