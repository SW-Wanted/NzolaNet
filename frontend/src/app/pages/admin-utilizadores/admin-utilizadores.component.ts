import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CabecalhoAdminComponent } from '../../components/cabecalho-admin/cabecalho-admin.component';
import { MenuLateralAdminComponent } from '../../components/menu-lateral-admin/menu-lateral-admin.component';
import { MenuInferiorAdminComponent } from '../../components/menu-inferior-admin/menu-inferior-admin.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { User } from '../../models/fase1.model';
import { UserService } from '../../services/user.service';

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
  private readonly userService = inject(UserService);

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
    this.userService.getUsersPage(pagina, this.POR_PAGINA).subscribe({
      next: ({ users, lastPage, total }) => {
        this.utilizadores.set(users);
        this.paginaActual.set(pagina);
        this.ultimaPagina.set(lastPage);
        this.total.set(total);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar os utilizadores. Verifique a sua ligação e tente novamente.');
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
