import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { NzolanetDadosService } from '../../services/nzolanet-dados.service';

@Component({
  selector: 'app-comentarios',
  imports: [CabecalhoComponent, MenuLateralComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.css',
})
export class ComentariosComponent {
  private readonly dados = inject(NzolanetDadosService);
  private readonly formBuilder = inject(FormBuilder);
  readonly comentarios = this.dados.comentarios;
  readonly formulario = this.formBuilder.nonNullable.group({
    texto: ['', [Validators.required, Validators.minLength(3)]],
  });
  submetido = false;

  adicionarComentario(): void {
    this.submetido = true;

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.dados.adicionarComentario(this.formulario.controls.texto.value);
    this.formulario.reset();
    this.submetido = false;
  }

  removerComentario(id: string): void {
    this.dados.removerComentario(id);
  }
}
