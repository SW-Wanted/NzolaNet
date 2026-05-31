import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';

@Component({
  selector: 'app-estados-feed',
  imports: [CabecalhoComponent, MenuLateralComponent, RouterLink],
  templateUrl: './estados-feed.component.html',
  styleUrl: './estados-feed.component.css',
})
export class EstadosFeedComponent {}
