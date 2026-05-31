import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { CartaoPublicacaoComponent, Publicacao } from '../../components/cartao-publicacao/cartao-publicacao.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { NzolanetDadosService } from '../../services/nzolanet-dados.service';

@Component({
  selector: 'app-feed',
  imports: [CabecalhoComponent, CartaoPublicacaoComponent, MenuLateralComponent, RouterLink],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent {
  readonly publicacoes = computed<Publicacao[]>(() =>
    this.dados.publicacoes().map((publicacao) => ({
      id: publicacao.id,
      autorNome: publicacao.autor.nome,
      autorAvatar: publicacao.autor.avatar,
      autorDescricao: publicacao.autor.descricao,
      tempoPublicacao: publicacao.tempoPublicacao,
      localizacao: publicacao.localizacao,
      conteudo: publicacao.conteudo,
      imagem: publicacao.imagem,
      imagemAlt: publicacao.imagemAlt,
      contagemBazes: publicacao.contagemBazes,
      contagemComentarios: publicacao.contagemComentarios,
      contagemPartilhas: publicacao.contagemPartilhas,
      temBaze: publicacao.temBaze,
    })),
  );

  constructor(private readonly dados: NzolanetDadosService) {}
}
