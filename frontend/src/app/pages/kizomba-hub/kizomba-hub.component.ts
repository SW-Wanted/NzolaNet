import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';

@Component({
  selector: 'app-kizomba-hub',
  imports: [CabecalhoComponent, MenuLateralComponent, ModalComponent, RouterLink],
  templateUrl: './kizomba-hub.component.html',
  styleUrl: './kizomba-hub.component.css',
})
export class KizombaHubComponent {
  aulaActual = signal<{ titulo: string; tempo: string; imagem: string } | null>(null);
  aulas = [
    {
      titulo: 'Passos base de Kizomba',
      tempo: '12 min',
      imagem:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAQyCxYTrGTvudis_SU_kdT9jUuVWq9DN-Mkuj80cvluFlQF_565vx4GgHaAK-XfZYyy3lTPnUL1Dn04JwIAtU_ALs9X6meSm-XmSmdhAo_rK5sw3QMuXMfVoRCjdXzDsfVk_94wf_3FQBJfyyODaOftfvffHm9mOkzLy0Kb3muxoQEgiQ4PVNfUnhqWthga2o6ik9cSGgaqGWDM2LyMW_fV31hCRCEmOu-Liyrzf69ykPU6q664BnRGN2AR5DxPywt0jOx77M-v40H',
    },
    {
      titulo: 'Semba social em par',
      tempo: '18 min',
      imagem:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBNmdzREkj0m7ajCQJ41iIcqddr9lliJZmzn4dLMY09lbDw4cNrlXs3N6VvvpxmI9WgmvFKgFM_-jmsirQ-fB2mS10p3PeYXlPUx14D52JkpAJugbjFHebgZrw0gSVcLQtceVTUcGBpy2oQ8ybjaqrf7Rzr0DsZj4v8ggdf6tSL8_WMXMUuPQdXFyI8JDb1w2AEXAG8NmYboa28P9OXJ0HL9SQwul2zYOSNdpMYhUILqggyRh4caJzDEgdhH84VPEYBlSMyUbL0FMzZ',
    },
  ];

  continuar(): void {
    this.aulaActual.set(this.aulas[0]);
  }
}
