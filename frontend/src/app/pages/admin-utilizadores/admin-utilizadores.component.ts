import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CabecalhoAdminComponent } from '../../components/cabecalho-admin/cabecalho-admin.component';
import { MenuLateralAdminComponent } from '../../components/menu-lateral-admin/menu-lateral-admin.component';
import { MenuInferiorAdminComponent } from '../../components/menu-inferior-admin/menu-inferior-admin.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { User } from '../../models/fase1.model';
import { AdminService } from '../../services/admin.service';
import { mensagemErroHttp } from '../../utils/erro.utils';

@Component({
  selector: 'app-admin-utilizadores',
  imports: [
    CabecalhoAdminComponent,
    MenuLateralAdminComponent,
    MenuInferiorAdminComponent,
    RouterLink,
    ModalComponent,
  ],
  templateUrl: './admin-utilizadores.component.html',
  styleUrl: './admin-utilizadores.component.css',
})
export class AdminUtilizadoresComponent implements OnInit {
  private readonly admin = inject(AdminService);

  utilizadores = signal<User[]>([]);
  carregando = signal(true);
  erro = signal('');
  paginaActual = signal(1);
  ultimaPagina = signal(1);
  total = signal(0);
  readonly POR_PAGINA = 20;

  termoBusca = signal('');
  filtroRole = signal<'todos' | 'user' | 'admin'>('todos');

  utilizadorDetalhe = signal<User | null>(null);
  modalDetalheAberto = signal(false);
  modalAvisoAberto = signal(false);
  mensagemAviso = signal('');

  readonly utilizadoresFiltrados = computed(() => {
    const termo = this.termoBusca().toLowerCase().trim();
    const role = this.filtroRole();
    return this.utilizadores().filter((u) => {
      const nomeMatch = !termo || u.name.toLowerCase().includes(termo) || (u.email ?? '').toLowerCase().includes(termo);
      const roleMatch = role === 'todos' || u.role === role;
      return nomeMatch && roleMatch;
    });
  });

  ngOnInit(): void {
    this.carregarPagina(1);
  }

  carregarPagina(pagina: number): void {
    this.carregando.set(true);
    this.erro.set('');
    this.admin.getUsersPage(pagina, this.POR_PAGINA).subscribe({
      next: ({ users, lastPage, total }) => {
        this.utilizadores.set(users);
        this.paginaActual.set(pagina);
        this.ultimaPagina.set(lastPage);
        this.total.set(total);
        this.carregando.set(false);
      },
      error: (err) => {
        this.erro.set(mensagemErroHttp(err));
        this.carregando.set(false);
      },
    });
  }

  paginaAnterior(): void {
    if (this.paginaActual() > 1) this.carregarPagina(this.paginaActual() - 1);
  }

  proximaPagina(): void {
    if (this.paginaActual() < this.ultimaPagina()) this.carregarPagina(this.paginaActual() + 1);
  }

  verDetalhe(user: User): void {
    this.utilizadorDetalhe.set(user);
    this.modalDetalheAberto.set(true);
  }

  mostrarAviso(mensagem: string): void {
    this.mensagemAviso.set(mensagem);
    this.modalAvisoAberto.set(true);
  }

  alternarEstado(user: User): void {
    this.erro.set('');

    this.admin.setUserActive(user.id, !(user.is_active ?? true)).subscribe({
      next: (atualizado) => {
        this.utilizadores.update((lista) =>
          lista.map((u) => (u.id === atualizado.id ? atualizado : u)),
        );
        const detalhe = this.utilizadorDetalhe();
        if (detalhe?.id === atualizado.id) {
          this.utilizadorDetalhe.set(atualizado);
        }
      },
      error: (err) => this.mostrarAviso(mensagemErroHttp(err)),
    });
  }

  eliminarUtilizador(user: User): void {
    const confirmado = window.confirm(`Eliminar definitivamente a conta de ${user.name}?`);
    if (!confirmado) {
      return;
    }

    this.admin.deleteUser(user.id).subscribe({
      next: () => {
        this.utilizadores.update((lista) => lista.filter((u) => u.id !== user.id));
        this.total.update((valor) => Math.max(0, valor - 1));
        if (this.utilizadorDetalhe()?.id === user.id) {
          this.modalDetalheAberto.set(false);
          this.utilizadorDetalhe.set(null);
        }
      },
      error: (err) => this.mostrarAviso(mensagemErroHttp(err)),
    });
  }

  avatar(user: User): string {
    return (
      user.profile_photo ??
      `https://ui-avatars.com/api/?background=111827&color=ffffff&name=${encodeURIComponent(user.name)}`
    );
  }

  rolePilula(role: string): string {
    return role === 'admin' ? 'Administrador' : 'Utilizador';
  }
}
