import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CabecalhoAdminComponent } from '../../../components/cabecalho-admin/cabecalho-admin.component';
import { MenuLateralAdminComponent } from '../../../components/menu-lateral-admin/menu-lateral-admin.component';
import { MenuInferiorAdminComponent } from '../../../components/menu-inferior-admin/menu-inferior-admin.component';
import { ModalComponent } from '../../../components/modal/modal.component';
import { DialogoConfirmacaoComponent } from '../../../components/dialogo-confirmacao/dialogo-confirmacao.component';
import { DENUNCIAS_MOCK, DenunciaAdmin, EstadoDenuncia } from '../../../mock/admin-mock.data';

type FiltroEstado = 'todas' | EstadoDenuncia;
type FiltroTipo = 'todos' | 'publicacao' | 'comentario';

@Component({
  selector: 'app-admin-denuncias',
  imports: [
    RouterLink,
    CabecalhoAdminComponent,
    MenuLateralAdminComponent,
    MenuInferiorAdminComponent,
    ModalComponent,
    DialogoConfirmacaoComponent,
  ],
  templateUrl: './admin-denuncias.component.html',
  styleUrl: './admin-denuncias.component.css',
})
export class AdminDenunciasComponent {
  readonly denuncias = signal<DenunciaAdmin[]>([...DENUNCIAS_MOCK]);
  readonly filtroEstado = signal<FiltroEstado>('todas');
  readonly filtroTipo = signal<FiltroTipo>('todos');

  readonly detalhe = signal<DenunciaAdmin | null>(null);
  readonly modalDetalheAberto = signal(false);
  readonly alvoEliminarConteudo = signal<DenunciaAdmin | null>(null);
  readonly feedback = signal('');

  readonly filtradas = computed(() => {
    const estado = this.filtroEstado();
    const tipo = this.filtroTipo();
    return this.denuncias().filter((d) => {
      const estadoOk = estado === 'todas' || d.estado === estado;
      const tipoOk = tipo === 'todos' || d.tipoAlvo === tipo;
      return estadoOk && tipoOk;
    });
  });

  readonly contagemPendentes = computed(
    () => this.denuncias().filter((d) => d.estado === 'pendente').length,
  );

  verDetalhe(d: DenunciaAdmin): void {
    this.detalhe.set(d);
    this.feedback.set('');
    this.modalDetalheAberto.set(true);
  }

  aceitar(d: DenunciaAdmin): void {
    this.atualizarEstado(d.id, 'aceite');
    this.feedback.set('Denúncia aceite. O conteúdo pode agora ser eliminado.');
  }

  rejeitar(d: DenunciaAdmin): void {
    this.atualizarEstado(d.id, 'rejeitada');
    this.feedback.set('Denúncia rejeitada. O conteúdo permanece publicado.');
  }

  pedirEliminarConteudo(d: DenunciaAdmin): void {
    this.alvoEliminarConteudo.set(d);
  }

  confirmarEliminarConteudo(): void {
    const alvo = this.alvoEliminarConteudo();
    if (alvo) {
      this.atualizarEstado(alvo.id, 'aceite');
      this.feedback.set(
        alvo.tipoAlvo === 'publicacao'
          ? 'Publicação eliminada e denúncia resolvida.'
          : 'Comentário eliminado e denúncia resolvida.',
      );
    }
    this.alvoEliminarConteudo.set(null);
  }

  rotuloEstado(estado: EstadoDenuncia): string {
    return { pendente: 'Pendente', aceite: 'Aceite', rejeitada: 'Rejeitada' }[estado];
  }

  formatarData(valor: string): string {
    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) return '';
    return new Intl.DateTimeFormat('pt-AO', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
    }).format(data);
  }

  private atualizarEstado(id: number, estado: EstadoDenuncia): void {
    this.denuncias.update((lista) =>
      lista.map((d) => (d.id === id ? { ...d, estado } : d)),
    );
    const atual = this.detalhe();
    if (atual?.id === id) {
      this.detalhe.set({ ...atual, estado });
    }
  }
}
