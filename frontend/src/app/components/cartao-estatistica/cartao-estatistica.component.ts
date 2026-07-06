import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Cartão estatístico reutilizável (StatCard).
 *
 * Apresenta um número, um rótulo e um ícone. Usado no dashboard de
 * administração. Se receber `rota`, todo o cartão torna-se navegável.
 */
@Component({
  selector: 'app-cartao-estatistica',
  imports: [RouterLink],
  templateUrl: './cartao-estatistica.component.html',
  styleUrl: './cartao-estatistica.component.css',
})
export class CartaoEstatisticaComponent {
  @Input() rotulo = '';
  @Input() valor: number | string = 0;
  @Input() icone = 'insights';
  @Input() variacao = '';
  /** 'primaria' | 'secundaria' | 'terciaria' | 'erro' */
  @Input() tom: 'primaria' | 'secundaria' | 'terciaria' | 'erro' = 'primaria';
  @Input() rota = '';

  get valorFormatado(): string {
    if (typeof this.valor === 'number') {
      return new Intl.NumberFormat('pt-AO').format(this.valor);
    }
    return this.valor;
  }
}
