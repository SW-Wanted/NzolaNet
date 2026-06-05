import { Component, OnInit, signal } from '@angular/core';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { User } from '../../models/fase1.model';
import { UserService } from '../../services/user.service';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?background=111827&color=ffffff&name=NzolaNet';

@Component({
  selector: 'app-sugestoes-conexao',
  imports: [CabecalhoComponent, MenuLateralComponent],
  templateUrl: './sugestoes-conexao.component.html',
  styleUrl: './sugestoes-conexao.component.css',
})
export class SugestoesConexaoComponent implements OnInit {
  pessoas = signal<User[]>([]);
  feedback = signal('');
  carregando = signal(false);

  constructor(private readonly users: UserService) {}

  ngOnInit(): void {
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
    return user.profile_photo ?? DEFAULT_AVATAR;
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
