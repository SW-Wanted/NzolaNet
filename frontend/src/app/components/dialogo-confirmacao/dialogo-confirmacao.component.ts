import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';

/**
 * Diálogo reutilizável de confirmação (DeleteConfirmationDialog).
 *
 * Usado para confirmar ações destrutivas (ex.: eliminar publicação,
 * comentário ou utilizador) em toda a aplicação. Não integra com o
 * backend — apenas emite os eventos confirmar / cancelar.
 */
@Component({
  selector: 'app-dialogo-confirmacao',
  imports: [ModalComponent],
  templateUrl: './dialogo-confirmacao.component.html',
})
export class DialogoConfirmacaoComponent {
  @Input() aberto = false;
  @Input() titulo = 'Confirmar ação';
  @Input() mensagem = 'Tem a certeza que deseja continuar? Esta ação não pode ser desfeita.';
  @Input() rotuloConfirmar = 'Eliminar';
  @Input() rotuloCancelar = 'Cancelar';
  @Input() icone = 'delete';

  @Output() confirmar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();
}
