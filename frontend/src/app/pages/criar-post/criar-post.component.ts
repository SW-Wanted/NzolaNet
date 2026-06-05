import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-criar-post',
  imports: [CabecalhoComponent, MenuLateralComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './criar-post.component.html',
  styleUrl: './criar-post.component.css',
})
export class CriarPostComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly posts = inject(PostService);
  private readonly router = inject(Router);

  formulario = this.formBuilder.nonNullable.group({
    conteudo: ['', [Validators.required, Validators.minLength(10)]],
  });

  submetido = false;
  emSubmissao = false;
  erroApi = signal('');
  anexoSelecionado = signal('');
  previewMedia = signal('');
  tipoMedia = signal<'imagem' | 'video'>('imagem');
  private mediaSelecionada: File | undefined;

  publicar(): void {
    this.submetido = true;

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.emSubmissao = true;
    this.erroApi.set('');

    this.posts.createPost(this.formulario.controls.conteudo.value.trim(), this.mediaSelecionada).subscribe({
      next: () => void this.router.navigateByUrl('/feed'),
      error: () => {
        this.erroApi.set('Nao foi possivel publicar. Confirme o texto e o ficheiro selecionado.');
        this.emSubmissao = false;
      },
    });
  }

  aoSelecionarMedia(evento: Event, tipo: 'imagem' | 'video'): void {
    const ficheiro = (evento.target as HTMLInputElement).files?.[0];
    if (!ficheiro) return;
    const limiteMb = tipo === 'imagem' ? 8 : 50;
    const tipoValido = tipo === 'imagem' ? ficheiro.type.startsWith('image/') : ficheiro.type.startsWith('video/');

    if (!tipoValido || ficheiro.size > limiteMb * 1024 * 1024) {
      this.erroApi.set(`Selecione um ficheiro ${tipo === 'imagem' ? 'de imagem' : 'de video'} valido ate ${limiteMb} MB.`);
      (evento.target as HTMLInputElement).value = '';
      return;
    }

    this.mediaSelecionada = ficheiro;
    this.previewMedia.set(URL.createObjectURL(ficheiro));
    this.tipoMedia.set(tipo);
  }

  removerMedia(): void {
    if (this.previewMedia().startsWith('blob:')) {
      URL.revokeObjectURL(this.previewMedia());
    }
    this.previewMedia.set('');
    this.mediaSelecionada = undefined;
  }

  seleccionarAnexo(tipo: string): void {
    this.anexoSelecionado.set(tipo);
  }
}
