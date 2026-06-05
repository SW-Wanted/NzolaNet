import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { CartaoPublicacaoComponent, Publicacao } from '../../components/cartao-publicacao/cartao-publicacao.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { Comentario } from '../../models/nzolanet.model';
import { NzolanetDadosService } from '../../services/nzolanet-dados.service';

@Component({
  selector: 'app-feed',
  imports: [CabecalhoComponent, CartaoPublicacaoComponent, MenuLateralComponent, RouterLink, ModalComponent, ReactiveFormsModule],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent {
  // ── Feed filters ──────────────────────────────────────────────────
  filtroActivo = signal<'todos' | 'seguidos'>('todos');
  seguindo: Record<string, boolean> = { auroval: false, sonca: false };
  private readonly autoresSeguidos = new Set(['pub-1']);
  private readonly dados = inject(NzolanetDadosService);
  private readonly fb = inject(FormBuilder);

  // ── Create Post modal ─────────────────────────────────────────────
  modalCriarAberto = signal(false);
  criarSubmetido = false;
  previewMedia = signal('');
  tipoMedia = signal<'imagem' | 'video'>('imagem');

  readonly formularioCriar = this.fb.nonNullable.group({
    conteudo: ['', [Validators.required, Validators.minLength(10)]],
  });

  // ── Comments drawer ───────────────────────────────────────────────
  drawerComentariosAberto = signal(false);
  publicacaoActiva = signal<Publicacao | null>(null);
  editandoComentarioId = signal<string | null>(null);
  textoEdicaoComentario = signal('');
  comentarioSubmetido = false;

  readonly formularioComentario = this.fb.nonNullable.group({
    texto: ['', [Validators.required, Validators.minLength(3)]],
  });

  readonly comentarios = this.dados.comentarios;

  // ── Publications ──────────────────────────────────────────────────
  readonly publicacoes = computed<Publicacao[]>(() => {
    const lista = this.dados.publicacoes().map((p) => ({
      id: p.id,
      autorNome: p.autor.nome,
      autorAvatar: p.autor.avatar,
      autorDescricao: p.autor.descricao,
      tempoPublicacao: p.tempoPublicacao,
      localizacao: p.localizacao,
      conteudo: p.conteudo,
      imagem: p.imagem,
      imagemAlt: p.imagemAlt,
      contagemBazes: p.contagemBazes,
      contagemComentarios: p.contagemComentarios,
      contagemPartilhas: p.contagemPartilhas,
      temBaze: p.temBaze,
    }));
    if (this.filtroActivo() === 'seguidos') {
      return lista.filter((p) => this.autoresSeguidos.has(p.id));
    }
    return lista;
  });

  // ── Follow ────────────────────────────────────────────────────────
  alternarSeguir(chave: string): void {
    this.seguindo = { ...this.seguindo, [chave]: !this.seguindo[chave] };
  }

  // ── Create Post ───────────────────────────────────────────────────
  abrirCriarPost(): void {
    this.formularioCriar.reset();
    this.previewMedia.set('');
    this.criarSubmetido = false;
    this.modalCriarAberto.set(true);
  }

  publicar(): void {
    this.criarSubmetido = true;
    if (this.formularioCriar.invalid) {
      this.formularioCriar.markAllAsTouched();
      return;
    }
    this.dados.criarPublicacao(this.formularioCriar.controls.conteudo.value);
    this.modalCriarAberto.set(false);
    this.formularioCriar.reset();
    this.previewMedia.set('');
    this.criarSubmetido = false;
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

  removerMedia(): void { this.previewMedia.set(''); }

  // ── Comments drawer ───────────────────────────────────────────────
  abrirComentarios(publicacao: Publicacao): void {
    this.publicacaoActiva.set(publicacao);
    this.drawerComentariosAberto.set(true);
    this.formularioComentario.reset();
    this.comentarioSubmetido = false;
  }

  fecharComentarios(): void {
    this.drawerComentariosAberto.set(false);
    this.publicacaoActiva.set(null);
    this.cancelarEdicaoComentario();
  }

  adicionarComentario(): void {
    this.comentarioSubmetido = true;
    if (this.formularioComentario.invalid) {
      this.formularioComentario.markAllAsTouched();
      return;
    }
    this.dados.adicionarComentario(this.formularioComentario.controls.texto.value);
    this.formularioComentario.reset();
    this.comentarioSubmetido = false;
  }

  removerComentario(id: string): void { this.dados.removerComentario(id); }

  iniciarEdicaoComentario(id: string, texto: string): void {
    this.editandoComentarioId.set(id);
    this.textoEdicaoComentario.set(texto);
  }

  cancelarEdicaoComentario(): void {
    this.editandoComentarioId.set(null);
    this.textoEdicaoComentario.set('');
  }

  guardarEdicaoComentario(id: string): void {
    const texto = this.textoEdicaoComentario().trim();
    if (!texto) return;
    this.dados.comentarios.update((lista) =>
      lista.map((c) => (c.id === id ? { ...c, texto } : c))
    );
    this.cancelarEdicaoComentario();
  }

  // ── Feed actions ──────────────────────────────────────────────────
  aoEliminar(id: string): void { this.dados.eliminarPublicacao(id); }

  aoEditar(evento: { id: string; conteudo: string }): void {
    this.dados.publicacoes.update((lista) =>
      lista.map((pub) => pub.id === evento.id ? { ...pub, conteudo: evento.conteudo } : pub)
    );
  }

  aoAtualizar(): void {
    const el = document.querySelector('.conteudo-principal');
    el?.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
