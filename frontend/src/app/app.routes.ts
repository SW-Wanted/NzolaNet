import { Routes } from '@angular/router';
import { ComentariosComponent } from './pages/comentarios/comentarios.component';
import { CriarPostComponent } from './pages/criar-post/criar-post.component';
import { EditarPerfilComponent } from './pages/editar-perfil/editar-perfil.component';
import { EntrarComponent } from './pages/entrar/entrar.component';
import { EstatisticasLikesComponent } from './pages/estatisticas-likes/estatisticas-likes.component';
import { EventosCulturaisComponent } from './pages/eventos-culturais/eventos-culturais.component';
import { FeedComponent } from './pages/feed/feed.component';
import { GruposComunidadesComponent } from './pages/grupos-comunidades/grupos-comunidades.component';
import { KizombaHubComponent } from './pages/kizomba-hub/kizomba-hub.component';
import { ModalSucessoComponent } from './pages/modal-sucesso/modal-sucesso.component';
import { ModeracaoComentariosComponent } from './pages/moderacao-comentarios/moderacao-comentarios.component';
import { MinhasPublicacoesComponent } from './pages/minhas-publicacoes/minhas-publicacoes.component';
import { NaoEncontradoComponent } from './pages/nao-encontrado/nao-encontrado.component';
import { NzolaMarketComponent } from './pages/nzola-market/nzola-market.component';
import { PerfilUtilizadorComponent } from './pages/perfil-utilizador/perfil-utilizador.component';
import { RecuperarSenhaComponent } from './pages/recuperar-senha/recuperar-senha.component';
import { RegistoComponent } from './pages/registo/registo.component';
import { NotificacoesComponent } from './pages/notificacoes/notificacoes.component';
import { PerfilPublicoComponent } from './pages/perfil-publico/perfil-publico.component';
import { SeguidoresComponent } from './pages/seguidores/seguidores.component';
import { SeguindoComponent } from './pages/seguindo/seguindo.component';
import { SugestoesConexaoComponent } from './pages/sugestoes-conexao/sugestoes-conexao.component';
import { AdminUtilizadoresComponent } from './pages/admin-utilizadores/admin-utilizadores.component';
import { ChatComponent } from './pages/chat/chat.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'feed' },
  { path: 'feed', component: FeedComponent, canActivate: [authGuard] },
  { path: 'entrar', component: EntrarComponent },
  { path: 'registo', component: RegistoComponent },
  { path: 'recuperar-senha', component: RecuperarSenhaComponent },
  { path: 'perfil', component: PerfilUtilizadorComponent, canActivate: [authGuard] },
  { path: 'perfil/editar', component: EditarPerfilComponent, canActivate: [authGuard] },
  { path: 'perfil/seguidores', component: SeguidoresComponent, canActivate: [authGuard] },
  { path: 'perfil/seguindo', component: SeguindoComponent, canActivate: [authGuard] },
  { path: 'criar-post', component: CriarPostComponent, canActivate: [authGuard] },
  { path: 'minhas-publicacoes', component: MinhasPublicacoesComponent, canActivate: [authGuard] },
  { path: 'grupos', component: GruposComunidadesComponent },
  { path: 'mercado', component: NzolaMarketComponent },
  { path: 'eventos', component: EventosCulturaisComponent },
  { path: 'kizomba-hub', component: KizombaHubComponent },
  { path: 'notificacoes', component: NotificacoesComponent, canActivate: [authGuard] },
  { path: 'utilizador/:id', component: PerfilPublicoComponent, canActivate: [authGuard] },
  { path: 'sugestoes', component: SugestoesConexaoComponent, canActivate: [authGuard] },
  { path: 'comentarios', component: ComentariosComponent, canActivate: [authGuard] },
  { path: 'comentarios/moderacao', component: ModeracaoComentariosComponent, canActivate: [authGuard] },
  { path: 'estatisticas-likes', component: EstatisticasLikesComponent, canActivate: [authGuard] },
  { path: 'chat', component: ChatComponent, canActivate: [authGuard] },
  { path: 'admin/utilizadores', component: AdminUtilizadoresComponent, canActivate: [adminGuard] },
  { path: 'feed/estados', redirectTo: 'feed', pathMatch: 'full' },
  { path: 'sucesso', component: ModalSucessoComponent },
  { path: '**', component: NaoEncontradoComponent },
];
