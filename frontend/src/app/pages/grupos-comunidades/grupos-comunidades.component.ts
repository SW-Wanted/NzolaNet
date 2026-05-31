import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { GrupoComunidade } from '../../models/nzolanet.model';
import { NzolanetDadosService } from '../../services/nzolanet-dados.service';

@Component({
  selector: 'app-grupos-comunidades',
  imports: [CabecalhoComponent, MenuLateralComponent, ModalComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './grupos-comunidades.component.html',
  styleUrl: './grupos-comunidades.component.css',
})
export class GruposComunidadesComponent {
  private readonly dados = inject(NzolanetDadosService);
  private readonly formBuilder = inject(FormBuilder);
  readonly grupos = this.dados.grupos;
  modalCriarAberto = signal(false);
  grupoDetalhe = signal<GrupoComunidade | null>(null);
  feedback = signal('');
  submetido = false;

  formularioGrupo = this.formBuilder.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    membros: ['1 membro', [Validators.required]],
  });

  alternarParticipacao(id: string): void {
    this.dados.alternarGrupo(id);
    this.feedback.set('Estado do grupo atualizado.');
  }

  abrirGrupo(grupo: GrupoComunidade): void {
    this.grupoDetalhe.set(grupo);
  }

  criarGrupo(): void {
    this.submetido = true;

    if (this.formularioGrupo.invalid) {
      this.formularioGrupo.markAllAsTouched();
      return;
    }

    const grupo = this.formularioGrupo.getRawValue();
    this.dados.criarGrupo(grupo.nome, grupo.membros);
    this.formularioGrupo.reset({ nome: '', membros: '1 membro' });
    this.submetido = false;
    this.modalCriarAberto.set(false);
    this.feedback.set('Grupo criado com sucesso.');
  }

  eliminarGrupo(id: string): void {
    this.dados.eliminarGrupo(id);
    this.grupoDetalhe.set(null);
    this.feedback.set('Grupo eliminado.');
  }
}
