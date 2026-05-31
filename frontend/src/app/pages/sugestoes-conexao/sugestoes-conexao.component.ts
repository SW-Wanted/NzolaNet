import { Component, signal } from '@angular/core';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';

@Component({
  selector: 'app-sugestoes-conexao',
  imports: [CabecalhoComponent, MenuLateralComponent],
  templateUrl: './sugestoes-conexao.component.html',
  styleUrl: './sugestoes-conexao.component.css',
})
export class SugestoesConexaoComponent {
  pessoas = [
    { nome: 'Auroval Banger', identificador: '@nzolanetvive', seguindo: false },
    { nome: 'Koista Baron', identificador: '@nzolanetvee', seguindo: false },
    { nome: 'Sonca Awrama', identificador: '@nzolanetinar', seguindo: false },
    { nome: 'Lueji Arte', identificador: '@luejiarte', seguindo: false },
  ];
  feedback = signal('');

  alternarSeguir(nome: string): void {
    this.pessoas = this.pessoas.map((pessoa) =>
      pessoa.nome === nome ? { ...pessoa, seguindo: !pessoa.seguindo } : pessoa,
    );
    this.feedback.set('Sugestões atualizadas.');
  }
}
