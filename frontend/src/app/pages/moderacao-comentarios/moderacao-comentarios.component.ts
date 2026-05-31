import { Component, inject } from '@angular/core';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { Comentario } from '../../models/nzolanet.model';
import { NzolanetDadosService } from '../../services/nzolanet-dados.service';

@Component({
  selector: 'app-moderacao-comentarios',
  imports: [CabecalhoComponent, MenuLateralComponent],
  templateUrl: './moderacao-comentarios.component.html',
  styleUrl: './moderacao-comentarios.component.css',
})
export class ModeracaoComentariosComponent {
  private readonly dados = inject(NzolanetDadosService);
  readonly comentariosPendentes = this.dados.comentariosPendentes;

  moderarComentario(id: string, estado: Comentario['estado']): void {
    this.dados.moderarComentario(id, estado);
  }
}
