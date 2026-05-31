import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  @Input() aberto = false;
  @Input() titulo = '';
  @Input() largura: 'normal' | 'grande' = 'normal';
  @Output() fechar = new EventEmitter<void>();
}
