import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent implements OnChanges {
  @Input() aberto = false;
  @Input() titulo = '';
  @Input() largura: 'normal' | 'grande' = 'normal';
  /** 'modal' = centered overlay, 'drawer' = slides in from the right */
  @Input() variante: 'modal' | 'drawer' = 'modal';
  @Output() fechar = new EventEmitter<void>();

  /** Whether the modal has ever been opened — used to lazy-render content */
  foiAberto = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['aberto']?.currentValue === true) {
      this.foiAberto = true;
      document.body.style.overflow = 'hidden';
    } else if (changes['aberto']?.currentValue === false && this.foiAberto) {
      document.body.style.overflow = '';
    }
  }

  @HostListener('document:keydown.escape')
  aoTeclaEscape(): void {
    if (this.aberto) {
      this.fechar.emit();
    }
  }
}
