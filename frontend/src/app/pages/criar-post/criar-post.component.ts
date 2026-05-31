import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { NzolanetDadosService } from '../../services/nzolanet-dados.service';

@Component({
  selector: 'app-criar-post',
  imports: [CabecalhoComponent, MenuLateralComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './criar-post.component.html',
  styleUrl: './criar-post.component.css',
})
export class CriarPostComponent {
  private readonly dados = inject(NzolanetDadosService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  formulario = this.formBuilder.nonNullable.group({
    conteudo: ['', [Validators.required, Validators.minLength(10)]],
  });

  submetido = false;
  anexoSelecionado = signal('');

  publicar(): void {
    this.submetido = true;

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.dados.criarPublicacao(this.formulario.controls.conteudo.value);
    this.router.navigateByUrl('/feed');
  }

  seleccionarAnexo(tipo: string): void {
    this.anexoSelecionado.set(tipo);
  }
}
