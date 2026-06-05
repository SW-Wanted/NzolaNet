import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';

@Component({
  selector: 'app-notificacoes',
  imports: [CabecalhoComponent, MenuLateralComponent, RouterLink],
  template: `
    <section class="pagina-social">
      <div class="estrutura-aplicacao">
        <app-menu-lateral />
        <main>
          <app-cabecalho />
          <div class="conteudo-principal">
            <div class="conteudo-limite">
              <header class="cabecalho-pagina">
                <div>
                  <span class="rotulo-seccao">Actividade</span>
                  <h1 class="titulo-pagina">Notificações</h1>
                </div>
                <a class="botao-contornado" routerLink="/feed">Voltar ao feed</a>
              </header>
              <div class="cartao cartao-preenchido notificacoes-vazio">
                <span class="material-symbols-outlined notificacoes-icone">notifications_off</span>
                <p class="notificacoes-titulo">Sem notificações de momento</p>
                <p class="texto-cartao">Aqui aparecerão os seus bazes, comentários e novos seguidores.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  `,
  styles: [`
    @import '../telas.css';

    .cabecalho-pagina {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }

    .notificacoes-vazio {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 60px 24px;
      text-align: center;
    }

    .notificacoes-icone {
      font-size: 56px;
      color: var(--cor-no-superficie-variante);
    }

    .notificacoes-titulo {
      font-size: 18px;
      font-weight: 700;
      color: var(--cor-no-superficie);
    }
  `],
})
export class NotificacoesComponent {}
