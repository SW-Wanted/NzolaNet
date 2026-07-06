import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { User } from '../../models/fase1.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-seguidores',
  imports: [CabecalhoComponent, MenuLateralComponent, RouterLink],
  templateUrl: './seguidores.component.html',
  styleUrl: './seguidores.component.css',
})
export class SeguidoresComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly userService = inject(UserService);

  seguidores = signal<User[]>([]);
  carregando = signal(true);
  erro = signal('');

  ngOnInit(): void {
    const userId = this.auth.currentUser()?.id;
    if (!userId) {
      this.erro.set('Não foi possível identificar o utilizador.');
      this.carregando.set(false);
      return;
    }
    this.userService.getFollowers(userId).subscribe({
      next: (users) => {
        this.seguidores.set(users);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar os seguidores. Tente novamente.');
        this.carregando.set(false);
      },
    });
  }

  avatar(user: User): string {
    return (
      user.profile_photo ??
      `https://ui-avatars.com/api/?background=111827&color=ffffff&name=${encodeURIComponent(user.name)}`
    );
  }
}
