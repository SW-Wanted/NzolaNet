export interface Utilizador {
  id: string;
  nome: string;
  identificador: string;
  avatar: string;
  descricao: string;
  localizacao?: string;
  seguidores?: number;
}

export interface Publicacao {
  id: string;
  autor: Utilizador;
  tempoPublicacao: string;
  localizacao?: string;
  conteudo: string;
  imagem?: string;
  imagemAlt?: string;
  contagemBazes: number;
  contagemComentarios: number;
  contagemPartilhas: number;
  temBaze?: boolean;
}

export interface EventoCultural {
  id: string;
  titulo: string;
  descricao: string;
  local: string;
  data: string;
  mes: string;
  categoria: string;
  imagem: string;
  destaque?: boolean;
  confirmado?: boolean;
}

export interface GrupoComunidade {
  id: string;
  nome: string;
  membros: string;
  icone: string;
  participando?: boolean;
}

export interface ProdutoCultural {
  id: string;
  nome: string;
  preco: string;
  precoValor: number;
  imagem: string;
  categoria: string;
  noCarrinho?: boolean;
}

export interface ItemCarrinho {
  produtoId: string;
  quantidade: number;
}

export interface Comentario {
  id: string;
  autor: string;
  texto: string;
  estado: 'aprovado' | 'pendente' | 'removido';
}
