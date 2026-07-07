import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { Notification } from '../../models/fase1.model';
import { NotificationService } from '../../services/notification.service';
import { mensagemErroHttp } from '../../utils/erro.utils';

@Component({
  selector: 'app-notificacoes',
  imports: [CabecalhoComponent, MenuLateralComponent, RouterLink],
  templateUrl: './notificacoes.component.html',
  styleUrl: './notificacoes.component.css',
})
export class NotificacoesComponent implements OnInit {
  private readonly notificationService = inject(NotificationService);

  readonly notificacoes = signal<Notification[]>([]);
  readonly carregando = signal(true);
  readonly erroApi = signal('');

  ngOnInit(): void {
    this.carregarNotificacoes();
  }

  marcarComoLida(id: number): void {
    this.notificationService.markAsRead(id).subscribe({
      next: (notificacao) => {
        this.notificacoes.update((lista) =>
          lista.map((n) => (n.id === id ? notificacao : n)),
        );
      },
    });
  }

  rotuloDeTipo(tipo: string): string {
    switch (tipo) {
      case 'like':
        return 'deu baze na sua publicação';
      case 'comment':
        return 'comentou a sua publicação';
      case 'follow':
        return 'começou a segui-lo';
      case 'report_created':
        return 'submeteu uma denúncia para revisão';
      default:
        return 'interagiu consigo';
    }
  }

  iconeDeTipo(tipo: string): string {
    switch (tipo) {
      case 'like':
        return 'favorite';
      case 'comment':
        return 'chat_bubble';
      case 'follow':
        return 'person_add';
      case 'report_created':
        return 'flag';
      default:
        return 'notifications';
    }
  }

  avatarFallback(name: string): string {
    return `https://ui-avatars.com/api/?background=111827&color=ffffff&name=${encodeURIComponent(name)}`;
  }

  formatarData(value: string): string {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('pt-AO', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  private carregarNotificacoes(): void {
    this.carregando.set(true);
    this.erroApi.set('');
    this.notificationService.getNotifications().subscribe({
      next: (lista) => {
        this.notificacoes.set(lista);
        this.carregando.set(false);
      },
      error: (err) => {
        this.erroApi.set(mensagemErroHttp(err));
        this.carregando.set(false);
      },
    });
  }
}
