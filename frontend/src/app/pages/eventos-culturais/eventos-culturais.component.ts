import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { EventoCultural } from '../../models/nzolanet.model';
import { NzolanetDadosService } from '../../services/nzolanet-dados.service';

@Component({
  selector: 'app-eventos-culturais',
  imports: [CabecalhoComponent, MenuLateralComponent, ModalComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './eventos-culturais.component.html',
  styleUrl: './eventos-culturais.component.css',
})
export class EventosCulturaisComponent {
  private readonly dados = inject(NzolanetDadosService);
  private readonly formBuilder = inject(FormBuilder);

  mostrarApenasConfirmados = signal(false);
  modalFiltrosAberto = signal(false);
  modalCriarAberto = signal(false);
  eventoDetalhe = signal<EventoCultural | null>(null);
  feedback = signal('');

  readonly eventos = computed(() => {
    const eventos = this.dados.eventos();
    return this.mostrarApenasConfirmados()
      ? eventos.filter((evento) => evento.confirmado)
      : eventos;
  });

  readonly formularioEvento = this.formBuilder.nonNullable.group({
    titulo: ['', [Validators.required, Validators.minLength(3)]],
    descricao: ['', [Validators.required, Validators.minLength(10)]],
    local: ['', [Validators.required]],
    data: ['15', [Validators.required]],
    mes: ['Jan', [Validators.required]],
    categoria: ['Cultura', [Validators.required]],
  });

  submetido = false;

  confirmarEvento(id: string): void {
    this.dados.confirmarEvento(id);
    this.feedback.set('Presença confirmada com sucesso.');
  }

  alternarConfirmados(): void {
    this.mostrarApenasConfirmados.update((valor) => !valor);
  }

  abrirDetalhes(evento: EventoCultural): void {
    this.eventoDetalhe.set(evento);
  }

  criarEvento(): void {
    this.submetido = true;

    if (this.formularioEvento.invalid) {
      this.formularioEvento.markAllAsTouched();
      return;
    }

    this.dados.criarEvento(this.formularioEvento.getRawValue());
    this.formularioEvento.reset({
      titulo: '',
      descricao: '',
      local: '',
      data: '15',
      mes: 'Jan',
      categoria: 'Cultura',
    });
    this.submetido = false;
    this.modalCriarAberto.set(false);
    this.feedback.set('Evento criado com sucesso.');
  }

  eliminarEvento(id: string): void {
    this.dados.eliminarEvento(id);
    this.eventoDetalhe.set(null);
    this.feedback.set('Evento eliminado.');
  }
}
