import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { NzolanetDadosService } from '../../services/nzolanet-dados.service';

@Component({
  selector: 'app-nzola-market',
  imports: [CabecalhoComponent, MenuLateralComponent, ModalComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './nzola-market.component.html',
  styleUrl: './nzola-market.component.css',
})
export class NzolaMarketComponent {
  private readonly dados = inject(NzolanetDadosService);
  private readonly formBuilder = inject(FormBuilder);
  readonly produtos = this.dados.produtos;
  readonly itensCarrinho = this.dados.itensCarrinho;
  readonly totalCarrinho = this.dados.totalCarrinho;
  modalCarrinhoAberto = signal(false);
  modalProdutoAberto = signal(false);
  feedback = signal('');

  formularioProduto = this.formBuilder.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    categoria: ['Arte', [Validators.required]],
    precoValor: [1000, [Validators.required, Validators.min(1)]],
  });

  submetido = false;

  alternarCarrinho(id: string): void {
    this.dados.alternarProduto(id);
    this.feedback.set('Carrinho atualizado.');
  }

  actualizarQuantidade(produtoId: string, evento: Event): void {
    const input = evento.target as HTMLInputElement;
    this.dados.actualizarQuantidadeCarrinho(produtoId, Number(input.value));
  }

  removerDoCarrinho(produtoId: string): void {
    this.dados.removerDoCarrinho(produtoId);
  }

  criarProduto(): void {
    this.submetido = true;

    if (this.formularioProduto.invalid) {
      this.formularioProduto.markAllAsTouched();
      return;
    }

    const produto = this.formularioProduto.getRawValue();
    this.dados.criarProduto({
      ...produto,
      preco: `${produto.precoValor.toLocaleString('pt-AO')} Kz`,
    });
    this.formularioProduto.reset({ nome: '', categoria: 'Arte', precoValor: 1000 });
    this.submetido = false;
    this.modalProdutoAberto.set(false);
    this.feedback.set('Produto criado com sucesso.');
  }
}
