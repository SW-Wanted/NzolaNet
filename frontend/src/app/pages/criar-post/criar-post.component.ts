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
  previewMedia = signal('');
  tipoMedia = signal<'imagem' | 'video'>('imagem');

  publicar(): void {
    this.submetido = true;

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.dados.criarPublicacao(this.formulario.controls.conteudo.value);
    this.router.navigateByUrl('/feed');
  }

  aoSelecionarMedia(evento: Event, tipo: 'imagem' | 'video'): void {
    const ficheiro = (evento.target as HTMLInputElement).files?.[0];
    if (!ficheiro) return;
    const leitor = new FileReader();
    leitor.onload = () => {
      this.previewMedia.set(leitor.result as string);
      this.tipoMedia.set(tipo);
    };
    leitor.readAsDataURL(ficheiro);
  }

  removerMedia(): void {
    this.previewMedia.set('');
  }

  seleccionarAnexo(tipo: string): void {
    this.anexoSelecionado.set(tipo);
  }
}
