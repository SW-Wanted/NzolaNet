import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CabecalhoAdminComponent } from '../../../components/cabecalho-admin/cabecalho-admin.component';
import { CartaoEstatisticaComponent } from '../../../components/cartao-estatistica/cartao-estatistica.component';
import { MenuLateralAdminComponent } from '../../../components/menu-lateral-admin/menu-lateral-admin.component';
import { MenuInferiorAdminComponent } from '../../../components/menu-inferior-admin/menu-inferior-admin.component';
import {
  BAZES_MOCK,
  COMENTARIOS_MOCK,
  DENUNCIAS_MOCK,
  PUBLICACOES_MOCK,
  UTILIZADORES_MOCK,
} from '../../../mock/admin-mock.data';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    RouterLink,
    CabecalhoAdminComponent,
    CartaoEstatisticaComponent,
    MenuLateralAdminComponent,
    MenuInferiorAdminComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: '../admin-comum.css',
})
export class AdminDashboardComponent {
  readonly totalUtilizadores = UTILIZADORES_MOCK.length;
  readonly totalPublicacoes = PUBLICACOES_MOCK.length;
  readonly totalComentarios = COMENTARIOS_MOCK.length;
  readonly totalBazes = PUBLICACOES_MOCK.reduce((soma, p) => soma + p.bazes, 0);
  readonly totalDenuncias = DENUNCIAS_MOCK.length;
  readonly denunciasPendentes = DENUNCIAS_MOCK.filter((d) => d.estado === 'pendente').length;

  readonly bazesRecentes = signal(BAZES_MOCK.slice(0, 5));
  readonly denunciasRecentes = signal(
    DENUNCIAS_MOCK.filter((d) => d.estado === 'pendente').slice(0, 3),
  );

  readonly publicacoesTopo = computed(() =>
    [...PUBLICACOES_MOCK].sort((a, b) => b.bazes - a.bazes).slice(0, 3),
  );

  formatarData(valor: string): string {
    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) return '';
    return new Intl.DateTimeFormat('pt-AO', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
    }).format(data);
  }
}
