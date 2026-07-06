import { Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { MOTIVOS_DENUNCIA } from '../../mock/admin-mock.data';

export interface DadosDenuncia {
  motivo: string;
  descricao: string;
}

/**
 * Modal reutilizável de denúncia (ReportModal).
 *
 * Usado para denunciar publicações ou comentários. Contém motivo,
 * descrição opcional e botão enviar. Não integra com o backend — o
 * envio é apenas visual (mock) e emite os dados para o componente pai.
 */
@Component({
  selector: 'app-modal-denuncia',
  imports: [ModalComponent],
  templateUrl: './modal-denuncia.component.html',
  styleUrl: './modal-denuncia.component.css',
})
export class ModalDenunciaComponent {
  @Input() aberto = false;
  /** Tipo de conteúdo a denunciar (afeta apenas os textos apresentados). */
  @Input() tipoAlvo: 'publicacao' | 'comentario' = 'publicacao';
  /** Nome opcional do autor do conteúdo denunciado. */
  @Input() nomeAlvo = '';

  @Output() fechar = new EventEmitter<void>();
  @Output() enviar = new EventEmitter<DadosDenuncia>();

  readonly motivos = MOTIVOS_DENUNCIA;

  motivoSelecionado = signal('');
  descricao = signal('');
  submetido = signal(false);
  enviado = signal(false);

  readonly titulo = computed(() =>
    this.tipoAlvo === 'comentario' ? 'Denunciar comentário' : 'Denunciar publicação',
  );

  aoFechar(): void {
    this.fechar.emit();
    // Repõe o estado após o fecho para a próxima abertura ficar limpa.
    setTimeout(() => this.reiniciar(), 250);
  }

  aoEnviar(): void {
    this.submetido.set(true);
    if (!this.motivoSelecionado()) {
      return;
    }

    this.enviar.emit({
      motivo: this.motivoSelecionado(),
      descricao: this.descricao().trim(),
    });
    this.enviado.set(true);

    // Fecha automaticamente após confirmar visualmente o envio.
    setTimeout(() => this.aoFechar(), 1600);
  }

  private reiniciar(): void {
    this.motivoSelecionado.set('');
    this.descricao.set('');
    this.submetido.set(false);
    this.enviado.set(false);
  }
}
