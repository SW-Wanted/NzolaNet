import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { User } from '../../models/fase1.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-seguindo',
  imports: [CabecalhoComponent, MenuLateralComponent, RouterLink],
  templateUrl: './seguindo.component.html',
  styleUrl: './seguindo.component.css',
})
export class SeguindoComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly userService = inject(UserService);

  seguindo = signal<User[]>([]);
  carregando = signal(true);
  erro = signal('');
  emAlterar = signal<number | null>(null);
  feedback = signal('');
  private feedbackTimer: ReturnType<typeof setTimeout> | undefined;

  ngOnInit(): void {
    const userId = this.auth.currentUser()?.id;
    if (!userId) {
      this.erro.set('Não foi possível identificar o utilizador.');
      this.carregando.set(false);
      return;
    }
    this.userService.getFollowing(userId).subscribe({
      next: (users) => {
        this.seguindo.set(users);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar a lista de utilizadores seguidos. Tente novamente.');
        this.carregando.set(false);
      },
    });
  }

  deixarDeSeguir(user: User): void {
    if (this.emAlterar() !== null) return;
    this.emAlterar.set(user.id);
    this.feedback.set('');

    this.userService.unfollow(user.id).subscribe({
      next: () => {
        this.seguindo.update((lista) => lista.filter((u) => u.id !== user.id));
        this.emAlterar.set(null);
        this.mostrarFeedback(`Deixou de seguir ${user.name}.`);
      },
      error: () => {
        this.emAlterar.set(null);
        this.mostrarFeedback('Não foi possível alterar esta ligação.');
      },
    });
  }

  avatar(user: User): string {
    return (
      user.profile_photo ??
      `https://ui-avatars.com/api/?background=111827&color=ffffff&name=${encodeURIComponent(user.name)}`
    );
  }

  private mostrarFeedback(mensagem: string): void {
    if (this.feedbackTimer) clearTimeout(this.feedbackTimer);
    this.feedback.set(mensagem);
    this.feedbackTimer = setTimeout(() => this.feedback.set(''), 3500);
  }
}
