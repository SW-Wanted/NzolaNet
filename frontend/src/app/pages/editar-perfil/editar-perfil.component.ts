import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { NzolanetDadosService } from '../../services/nzolanet-dados.service';

@Component({
  selector: 'app-editar-perfil',
  imports: [CabecalhoComponent, MenuLateralComponent, ReactiveFormsModule],
  templateUrl: './editar-perfil.component.html',
  styleUrl: './editar-perfil.component.css',
})
export class EditarPerfilComponent {
  private readonly dados = inject(NzolanetDadosService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly utilizador = this.dados.utilizadorActual();

  formulario = this.formBuilder.nonNullable.group({
    nome: [this.utilizador.nome, [Validators.required, Validators.minLength(3)]],
    descricaoCurta: ['Curadora cultural', [Validators.required]],
    biografia: [this.utilizador.descricao, [Validators.required, Validators.minLength(12)]],
  });

  submetido = false;

  guardar(): void {
    this.submetido = true;

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valores = this.formulario.getRawValue();
    this.dados.utilizadorActual.update((utilizador) => ({
      ...utilizador,
      nome: valores.nome,
      descricao: valores.biografia,
    }));
    this.router.navigateByUrl('/perfil');
  }
}
