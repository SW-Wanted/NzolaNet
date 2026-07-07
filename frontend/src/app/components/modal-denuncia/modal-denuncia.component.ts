import { Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { ReportService } from '../../services/report.service';
import { mensagemErroHttp } from '../../utils/erro.utils';

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
  constructor(private readonly reports: ReportService) {}

  @Input() aberto = false;
  /** Tipo de conteúdo a denunciar (afeta apenas os textos apresentados). */
  @Input() tipoAlvo: 'publicacao' | 'comentario' = 'publicacao';
  @Input() alvoId: number | null = null;
  /** Nome opcional do autor do conteúdo denunciado. */
  @Input() nomeAlvo = '';

  @Output() fechar = new EventEmitter<void>();
  @Output() enviar = new EventEmitter<DadosDenuncia>();

  readonly motivos = ['Spam', 'Discurso de ódio', 'Assédio', 'Conteúdo ofensivo', 'Outro'];

  motivoSelecionado = signal('');
  descricao = signal('');
  submetido = signal(false);
  enviado = signal(false);
  enviando = signal(false);
  erro = signal('');

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

    const dados = {
      motivo: this.motivoSelecionado(),
      descricao: this.descricao().trim(),
    };

    if (!this.alvoId) {
      this.enviar.emit(dados);
      this.enviado.set(true);
      setTimeout(() => this.aoFechar(), 1600);
      return;
    }

    this.enviando.set(true);
    this.erro.set('');

    const request =
      this.tipoAlvo === 'comentario'
        ? this.reports.reportComment(this.alvoId, dados)
        : this.reports.reportPost(this.alvoId, dados);

    request.subscribe({
      next: () => {
        this.enviar.emit(dados);
        this.enviado.set(true);
        this.enviando.set(false);
        setTimeout(() => this.aoFechar(), 1600);
      },
      error: (err) => {
        this.erro.set(mensagemErroHttp(err));
        this.enviando.set(false);
      },
    });
  }

  private reiniciar(): void {
    this.motivoSelecionado.set('');
    this.descricao.set('');
    this.submetido.set(false);
    this.enviado.set(false);
    this.enviando.set(false);
    this.erro.set('');
  }
}
