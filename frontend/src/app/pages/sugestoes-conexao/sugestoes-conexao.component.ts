import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { User } from '../../models/fase1.model';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-sugestoes-conexao',
  imports: [CabecalhoComponent, MenuLateralComponent, RouterLink],
  templateUrl: './sugestoes-conexao.component.html',
  styleUrl: './sugestoes-conexao.component.css',
})
export class SugestoesConexaoComponent implements OnInit {
  private termoBusca = signal('');

  pessoas = signal<User[]>([]);
  feedback = signal('');
  carregando = signal(false);

  readonly pessoasFiltradas = computed(() => {
    const termo = this.termoBusca().toLowerCase().trim();
    if (!termo) return this.pessoas();
    return this.pessoas().filter((p) => p.name.toLowerCase().includes(termo));
  });

  constructor(
    private readonly users: UserService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.termoBusca.set(params.get('q') ?? '');
    });
    this.carregarPessoas();
  }

  alternarSeguir(pessoa: User): void {
    this.feedback.set('');
    const request = pessoa.is_following ? this.users.unfollow(pessoa.id) : this.users.toggleFollow(pessoa.id);

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
        this.feedback.set(pessoa.is_following ? 'Utilizador removido dos seguidos.' : 'Utilizador seguido com sucesso.');
      },
      error: () => this.feedback.set('Nao foi possivel atualizar esta conexao.'),
    });
  }

  avatar(user: User): string {
    return user.profile_photo ?? `https://ui-avatars.com/api/?background=111827&color=ffffff&name=${encodeURIComponent(user.name)}`;
  }

  private carregarPessoas(): void {
    this.carregando.set(true);
    this.users.getUsers().subscribe({
      next: (users) => {
        this.pessoas.set(users);
        this.carregando.set(false);
      },
      error: () => {
        this.feedback.set('Nao foi possivel carregar sugestoes reais.');
        this.carregando.set(false);
      },
    });
  }
}
