import { Routes } from '@angular/router';
import { ComentariosComponent } from './pages/comentarios/comentarios.component';
import { CriarPostComponent } from './pages/criar-post/criar-post.component';
import { EditarPerfilComponent } from './pages/editar-perfil/editar-perfil.component';
import { EntrarComponent } from './pages/entrar/entrar.component';
import { EstadosFeedComponent } from './pages/estados-feed/estados-feed.component';
import { EventosCulturaisComponent } from './pages/eventos-culturais/eventos-culturais.component';
import { FeedComponent } from './pages/feed/feed.component';
import { GruposComunidadesComponent } from './pages/grupos-comunidades/grupos-comunidades.component';
import { KizombaHubComponent } from './pages/kizomba-hub/kizomba-hub.component';
import { ModalSucessoComponent } from './pages/modal-sucesso/modal-sucesso.component';
import { ModeracaoComentariosComponent } from './pages/moderacao-comentarios/moderacao-comentarios.component';
import { NzolaMarketComponent } from './pages/nzola-market/nzola-market.component';
import { PerfilUtilizadorComponent } from './pages/perfil-utilizador/perfil-utilizador.component';
import { RecuperarSenhaComponent } from './pages/recuperar-senha/recuperar-senha.component';
import { RegistoComponent } from './pages/registo/registo.component';
import { SugestoesConexaoComponent } from './pages/sugestoes-conexao/sugestoes-conexao.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'feed' },
  { path: 'feed', component: FeedComponent },
  { path: 'entrar', component: EntrarComponent },
  { path: 'registo', component: RegistoComponent },
  { path: 'recuperar-senha', component: RecuperarSenhaComponent },
  { path: 'perfil', component: PerfilUtilizadorComponent },
  { path: 'perfil/editar', component: EditarPerfilComponent },
  { path: 'criar-post', component: CriarPostComponent },
  { path: 'grupos', component: GruposComunidadesComponent },
  { path: 'mercado', component: NzolaMarketComponent },
  { path: 'eventos', component: EventosCulturaisComponent },
  { path: 'kizomba-hub', component: KizombaHubComponent },
  { path: 'sugestoes', component: SugestoesConexaoComponent },
  { path: 'comentarios', component: ComentariosComponent },
  { path: 'comentarios/moderacao', component: ModeracaoComentariosComponent },
  { path: 'feed/estados', component: EstadosFeedComponent },
  { path: 'sucesso', component: ModalSucessoComponent },
  { path: '**', redirectTo: 'feed' },
];
