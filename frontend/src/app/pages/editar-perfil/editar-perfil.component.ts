import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { NzolanetDadosService } from '../../services/nzolanet-dados.service';

@Component({
  selector: 'app-editar-perfil',
  imports: [CabecalhoComponent, MenuLateralComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './editar-perfil.component.html',
  styleUrl: './editar-perfil.component.css',
})
export class EditarPerfilComponent {
  private readonly dados = inject(NzolanetDadosService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly utilizador = this.dados.utilizadorActual();

  readonly avatarPreview = signal<string>(this.utilizador.avatar);

  formulario = this.formBuilder.nonNullable.group({
    nome: [this.utilizador.nome, [Validators.required, Validators.minLength(3)]],
    descricaoCurta: ['Curadora cultural', [Validators.required]],
    biografia: [this.utilizador.descricao, [Validators.required, Validators.minLength(12)]],
  });

  submetido = false;

  aoSelecionarFoto(evento: Event): void {
    const ficheiro = (evento.target as HTMLInputElement).files?.[0];
    if (!ficheiro) return;
    const leitor = new FileReader();
    leitor.onload = () => this.avatarPreview.set(leitor.result as string);
    leitor.readAsDataURL(ficheiro);
  }

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
      avatar: this.avatarPreview(),
    }));
    this.router.navigateByUrl('/perfil');
  }
}
