import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { NzolanetDadosService } from '../../services/nzolanet-dados.service';

@Component({
  selector: 'app-perfil-utilizador',
  imports: [CabecalhoComponent, MenuLateralComponent, RouterLink],
  templateUrl: './perfil-utilizador.component.html',
  styleUrl: './perfil-utilizador.component.css',
})
export class PerfilUtilizadorComponent {
  private readonly dados = inject(NzolanetDadosService);
  readonly utilizador = this.dados.utilizadorActual;
  readonly publicacoes = this.dados.publicacoes;
  readonly eventos = this.dados.eventos;
}
