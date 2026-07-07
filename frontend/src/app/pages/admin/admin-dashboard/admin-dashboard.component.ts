import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CabecalhoAdminComponent } from '../../../components/cabecalho-admin/cabecalho-admin.component';
import { CartaoEstatisticaComponent } from '../../../components/cartao-estatistica/cartao-estatistica.component';
import { MenuLateralAdminComponent } from '../../../components/menu-lateral-admin/menu-lateral-admin.component';
import { MenuInferiorAdminComponent } from '../../../components/menu-inferior-admin/menu-inferior-admin.component';
import { AdminService } from '../../../services/admin.service';
import { mensagemErroHttp } from '../../../utils/erro.utils';

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
export class AdminDashboardComponent implements OnInit {
  private readonly admin = inject(AdminService);

  readonly carregando = signal(true);
  readonly erro = signal('');
  readonly totais = signal({
    users: 0,
    active_users: 0,
    inactive_users: 0,
    posts: 0,
    comments: 0,
    likes: 0,
    reports: 0,
    pending_reports: 0,
  });

  readonly bazesRecentes = signal<any[]>([]);
  readonly denunciasRecentes = signal<any[]>([]);
  readonly publicacoesTopo = signal<any[]>([]);

  readonly totalUtilizadores = computed(() => this.totais().users);
  readonly totalPublicacoes = computed(() => this.totais().posts);
  readonly totalComentarios = computed(() => this.totais().comments);
  readonly totalBazes = computed(() => this.totais().likes);
  readonly totalDenuncias = computed(() => this.totais().reports);
  readonly denunciasPendentes = computed(() => this.totais().pending_reports);

  ngOnInit(): void {
    this.carregarDashboard();
  }

  carregarDashboard(): void {
    this.carregando.set(true);
    this.erro.set('');

    this.admin.getDashboard().subscribe({
      next: (dashboard) => {
        this.totais.set(dashboard.totals);
        this.denunciasRecentes.set(dashboard.recent_reports);
        this.publicacoesTopo.set(dashboard.top_posts);
        this.bazesRecentes.set(dashboard.recent_likes);
        this.carregando.set(false);
      },
      error: (err) => {
        this.erro.set(mensagemErroHttp(err));
        this.carregando.set(false);
      },
    });
  }

  formatarData(valor: string): string {
    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) return '';
    return new Intl.DateTimeFormat('pt-AO', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
    }).format(data);
  }
}
