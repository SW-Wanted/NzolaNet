import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar-utilizador',
  imports: [CommonModule],
  template: `
    <img
      class="avatar"
      [class.avatar--pequeno]="tamanho === 'pequeno'"
      [class.avatar--medio]="tamanho === 'medio'"
      [class.avatar--grande]="tamanho === 'grande'"
      [src]="src"
      [alt]="alt"
    />
  `,
  styles: [`
    .avatar {
      border-radius: 50%;
      object-fit: cover;
      border: 1px solid var(--cor-contorno-variante);
      background-color: var(--cor-container-mais-baixo);
      flex-shrink: 0;
    }
    .avatar--pequeno {
      width: 32px;
      height: 32px;
    }
    .avatar--medio {
      width: 40px;
      height: 40px;
    }
    .avatar--grande {
      width: 48px;
      height: 48px;
    }
  `]
})
export class AvatarUtilizadorComponent {
  @Input() src = '';
  @Input() alt = '';
  @Input() tamanho: 'pequeno' | 'medio' | 'grande' = 'medio';
}