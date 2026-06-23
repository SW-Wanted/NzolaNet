import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { User } from '../../models/fase1.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sugestoes-conexao',
  imports: [CabecalhoComponent, MenuLateralComponent, RouterLink],
  templateUrl: './sugestoes-conexao.component.html',
  styleUrl: './sugestoes-conexao.component.css',
})
export class SugestoesConexaoComponent implements OnInit, OnDestroy {
  private readonly auth = inject(AuthService);
  private termoBusca = signal('');
  private sub?: Subscription;

  pessoas = signal<User[]>([]);
  feedback = signal('');
  erro = signal('');
  carregando = signal(true);
  termoPesquisa = signal('');

  readonly pessoasFiltradas = computed(() => {
    const termo = this.termoBusca().toLowerCase().trim();
    const currentId = this.auth.currentUser()?.id;
    const lista = this.pessoas().filter((p) => p.id !== currentId);
    if (!termo) return lista;
    return lista.filter((p) =>
      p.name.toLowerCase().includes(termo) ||
      (p.email ?? '').toLowerCase().includes(termo)
    );
  });

  constructor(
    private readonly users: UserService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.sub = this.route.queryParamMap.subscribe((params) => {
      const q = params.get('q') ?? '';
      this.termoBusca.set(q);
      this.termoPesquisa.set(q);
    });
    this.carregarPessoas();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  carregarPessoas(): void {
    this.carregando.set(true);
    this.erro.set('');
    this.feedback.set('');
    this.users.getUsers().subscribe({
      next: (users) => {
        this.pessoas.set(users);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar as sugestões. Verifique a sua ligação e tente novamente.');
        this.carregando.set(false);
      },
    });
  }

  alternarSeguir(pessoa: User): void {
    this.feedback.set('');
    const request = pessoa.is_following
      ? this.users.unfollow(pessoa.id)
      : this.users.toggleFollow(pessoa.id);

    request.subscribe({
      next: () => {
        this.pessoas.update((pessoas) =>
          pessoas.map((item) =>
            item.id === pessoa.id
              ? {
                  ...item,
                  is_following: !pessoa.is_following,
                  followers_count: Math.max(0, item.followers_count + (pessoa.is_following ? -1 : 1)),
                }
              : item,
          ),
        );
        this.feedback.set(
          pessoa.is_following ? 'Deixou de seguir este utilizador.' : 'Utilizador seguido com sucesso.',
        );
      },
      error: () => this.feedback.set('Não foi possível atualizar esta ligação. Tente novamente.'),
    });
  }

  avatar(user: User): string {
    return (
      user.profile_photo ??
      `https://ui-avatars.com/api/?background=111827&color=ffffff&name=${encodeURIComponent(user.name)}`
    );
  }
}
