import { Component, ElementRef, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { Message } from '../../models/chat.model';
import { User } from '../../models/fase1.model';
import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-chat',
  imports: [CabecalhoComponent, MenuLateralComponent, RouterLink],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit {
  @ViewChild('mensagensContainer') mensagensContainer?: ElementRef<HTMLDivElement>;

  private readonly userService = inject(UserService);
  private readonly chatService = inject(ChatService);
  private readonly auth = inject(AuthService);

  readonly utilizadorActual = computed(() => this.auth.currentUser());

  // Contacts — loaded from UserService today; will be replaced by
  // ChatService.getConversations() once the backend is ready.
  contactos = signal<User[]>([]);
  carregandoContactos = signal(true);
  erroContactos = signal('');

  // Active conversation state
  conversaActiva = signal<User | null>(null);
  mensagens = signal<Message[]>([]);
  carregandoMensagens = signal(false);

  // Input signal — wired but sending is disabled until backend is ready.
  textoMensagem = signal('');
  pesquisaContacto = signal('');

  readonly contactosFiltrados = computed(() => {
    const termo = this.pesquisaContacto().toLowerCase().trim();
    const currentId = this.utilizadorActual()?.id;
    const lista = this.contactos().filter((c) => c.id !== currentId);
    if (!termo) return lista;
    return lista.filter((c) =>
      c.name.toLowerCase().includes(termo) ||
      (c.email ?? '').toLowerCase().includes(termo),
    );
  });

  ngOnInit(): void {
    // TODO: Replace getUsers() with chatService.getConversations() once backend
    //       provides GET /api/conversations. Map each Conversation to its other
    //       participant for display in the left panel.
    this.userService.getUsers(50).subscribe({
      next: (users) => {
        this.contactos.set(users);
        this.carregandoContactos.set(false);
      },
      error: () => {
        this.erroContactos.set('Não foi possível carregar os contactos.');
        this.carregandoContactos.set(false);
      },
    });
  }

  abrirConversa(user: User): void {
    this.conversaActiva.set(user);
    this.mensagens.set([]);
    this.textoMensagem.set('');
    this.carregandoMensagens.set(true);

    // TODO: Replace user.id with the real conversation ID once
    //       ChatService.getConversations() is wired up.
    this.chatService.getMessages(user.id).subscribe({
      next: (msgs) => {
        this.mensagens.set(msgs);
        this.carregandoMensagens.set(false);
        setTimeout(() => this.scrollParaFim(), 50);

        // TODO: Call markAsRead once the backend supports it.
        // this.chatService.markAsRead(conversationId).subscribe();
      },
      error: () => {
        this.carregandoMensagens.set(false);
      },
    });
  }

  enviarMensagem(): void {
    // TODO: Implement when ChatService.sendMessage() has a real backend:
    //
    // const texto = this.textoMensagem().trim();
    // const activa = this.conversaActiva();
    // if (!texto || !activa) return;
    //
    // this.chatService.sendMessage(activa.id, { body: texto }).subscribe({
    //   next: (msg) => {
    //     if (msg) this.mensagens.update((list) => [...list, msg]);
    //     this.textoMensagem.set('');
    //     setTimeout(() => this.scrollParaFim(), 50);
    //   },
    // });
  }

  aoTeclaEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      // TODO: Call enviarMensagem() when the backend is ready.
    }
  }

  previewContacto(user: User): string {
    // TODO: Replace with last_message.body from Conversation once API is ready.
    return user.bio ?? '';
  }

  formatarHora(isoString: string): string {
    try {
      return new Date(isoString).toLocaleTimeString('pt-PT', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  }

  avatar(user: User): string {
    return (
      user.profile_photo ??
      `https://ui-avatars.com/api/?background=111827&color=ffffff&name=${encodeURIComponent(user.name)}`
    );
  }

  private scrollParaFim(): void {
    const el = this.mensagensContainer?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }
}
