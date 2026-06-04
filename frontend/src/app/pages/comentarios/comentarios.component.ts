import { Component, inject, signal } from '@angular/core';
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

  editandoId = signal<string | null>(null);
  textoEdicao = signal('');

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

  iniciarEdicao(id: string, texto: string): void {
    this.editandoId.set(id);
    this.textoEdicao.set(texto);
  }

  cancelarEdicao(): void {
    this.editandoId.set(null);
    this.textoEdicao.set('');
  }

  guardarEdicao(id: string): void {
    const texto = this.textoEdicao().trim();
    if (!texto) return;
    this.dados.comentarios.update((lista) =>
      lista.map((c) => c.id === id ? { ...c, texto } : c)
    );
    this.cancelarEdicao();
  }
}
