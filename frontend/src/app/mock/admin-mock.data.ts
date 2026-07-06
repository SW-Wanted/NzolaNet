/**
 * Dados simulados (hardcoded) para a área de Administração do NzolaNet.
 *
 * ⚠️ Estes dados são apenas para demonstração visual. Não representam
 * integração com o backend. Toda a listagem, pesquisa, filtragem e
 * paginação das páginas de administração opera sobre estes arrays em
 * memória. A integração real (chamadas HTTP / Services) será feita
 * numa fase posterior.
 */

function avatar(nome: string): string {
  return `https://ui-avatars.com/api/?background=7b5900&color=ffffff&bold=true&name=${encodeURIComponent(nome)}`;
}

export type PapelUtilizador = 'user' | 'admin';
export type EstadoUtilizador = 'ativo' | 'bloqueado';
export type TipoAlvoDenuncia = 'publicacao' | 'comentario';
export type EstadoDenuncia = 'pendente' | 'aceite' | 'rejeitada';

export interface UtilizadorAdmin {
  id: number;
  nome: string;
  identificador: string;
  email: string;
  avatar: string;
  papel: PapelUtilizador;
  estado: EstadoUtilizador;
  seguidores: number;
  publicacoes: number;
  bazes: number;
  bio: string;
  localizacao: string;
  dataRegisto: string;
}

export interface PublicacaoAdmin {
  id: number;
  autor: string;
  autorAvatar: string;
  conteudo: string;
  imagem?: string;
  video?: string;
  bazes: number;
  comentarios: number;
  data: string;
}

export interface ComentarioAdmin {
  id: number;
  autor: string;
  autorAvatar: string;
  texto: string;
  publicacaoResumo: string;
  publicacaoAutor: string;
  data: string;
}

export interface BazeAdmin {
  id: number;
  utilizador: string;
  utilizadorAvatar: string;
  publicacaoResumo: string;
  autorPublicacao: string;
  data: string;
}

export interface DenunciaAdmin {
  id: number;
  tipoAlvo: TipoAlvoDenuncia;
  motivo: string;
  descricao: string;
  estado: EstadoDenuncia;
  data: string;
  denunciante: string;
  denuncianteAvatar: string;
  autorConteudo: string;
  autorConteudoAvatar: string;
  autorConteudoId: number;
  conteudo: string;
  imagemConteudo?: string;
}

export const UTILIZADORES_MOCK: UtilizadorAdmin[] = [
  {
    id: 1, nome: 'Ana Kiala', identificador: '@ana.kiala', email: 'ana.kiala@nzolanet.ao',
    avatar: avatar('Ana Kiala'), papel: 'admin', estado: 'ativo', seguidores: 1842,
    publicacoes: 128, bazes: 5210, bio: 'Curadora cultural e gestora de comunidade.',
    localizacao: 'Luanda', dataRegisto: '2024-01-12',
  },
  {
    id: 2, nome: 'Miguel Ndala', identificador: '@miguel.ndala', email: 'miguel.ndala@gmail.com',
    avatar: avatar('Miguel Ndala'), papel: 'user', estado: 'ativo', seguidores: 634,
    publicacoes: 47, bazes: 1203, bio: 'Dançarino de kizomba e semba.',
    localizacao: 'Benguela', dataRegisto: '2024-03-04',
  },
  {
    id: 3, nome: 'Teresa Mbala', identificador: '@teresa.mbala', email: 'teresa.mbala@outlook.com',
    avatar: avatar('Teresa Mbala'), papel: 'user', estado: 'ativo', seguidores: 2109,
    publicacoes: 213, bazes: 8934, bio: 'Fotógrafa de eventos culturais angolanos.',
    localizacao: 'Huambo', dataRegisto: '2023-11-22',
  },
  {
    id: 4, nome: 'João Kudissonga', identificador: '@joao.kdz', email: 'joao.kdz@gmail.com',
    avatar: avatar('João Kudissonga'), papel: 'user', estado: 'bloqueado', seguidores: 89,
    publicacoes: 12, bazes: 74, bio: 'Entusiasta de música tradicional.',
    localizacao: 'Lubango', dataRegisto: '2024-06-18',
  },
  {
    id: 5, nome: 'Nzinga Bengui', identificador: '@nzinga.b', email: 'nzinga.bengui@nzolanet.ao',
    avatar: avatar('Nzinga Bengui'), papel: 'user', estado: 'ativo', seguidores: 4521,
    publicacoes: 356, bazes: 15320, bio: 'Estilista e promotora de moda afro.',
    localizacao: 'Luanda', dataRegisto: '2023-08-30',
  },
  {
    id: 6, nome: 'Carlos Ekuikui', identificador: '@carlos.eku', email: 'carlos.ekuikui@gmail.com',
    avatar: avatar('Carlos Ekuikui'), papel: 'user', estado: 'ativo', seguidores: 312,
    publicacoes: 28, bazes: 641, bio: 'Escritor e poeta de spoken word.',
    localizacao: 'Malanje', dataRegisto: '2024-02-14',
  },
  {
    id: 7, nome: 'Beatriz Kunda', identificador: '@bia.kunda', email: 'beatriz.kunda@outlook.com',
    avatar: avatar('Beatriz Kunda'), papel: 'user', estado: 'ativo', seguidores: 978,
    publicacoes: 92, bazes: 2874, bio: 'Chef de cozinha tradicional angolana.',
    localizacao: 'Cabinda', dataRegisto: '2023-12-09',
  },
  {
    id: 8, nome: 'Paulo Chivukuvuku', identificador: '@paulo.chiv', email: 'paulo.chiv@gmail.com',
    avatar: avatar('Paulo Chivukuvuku'), papel: 'user', estado: 'bloqueado', seguidores: 45,
    publicacoes: 8, bazes: 33, bio: 'Novo na comunidade.',
    localizacao: 'Namibe', dataRegisto: '2024-07-01',
  },
];

export const PUBLICACOES_MOCK: PublicacaoAdmin[] = [
  {
    id: 101, autor: 'Nzinga Bengui', autorAvatar: avatar('Nzinga Bengui'),
    conteudo: 'Nova coleção de tecidos com padrões tradicionais chega esta semana à Nzola Market! 🧵✨',
    imagem: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600',
    bazes: 842, comentarios: 96, data: '2026-07-05T14:20:00',
  },
  {
    id: 102, autor: 'Teresa Mbala', autorAvatar: avatar('Teresa Mbala'),
    conteudo: 'Registei os melhores momentos do festival de semba no Kilamba. Que noite mágica!',
    imagem: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600',
    bazes: 1204, comentarios: 210, data: '2026-07-04T21:10:00',
  },
  {
    id: 103, autor: 'Miguel Ndala', autorAvatar: avatar('Miguel Ndala'),
    conteudo: 'Aula aberta de kizomba este sábado, na Marginal de Luanda. Todos convidados! 💃🕺',
    bazes: 431, comentarios: 58, data: '2026-07-03T09:45:00',
  },
  {
    id: 104, autor: 'Beatriz Kunda', autorAvatar: avatar('Beatriz Kunda'),
    conteudo: 'Receita de mufete passo a passo no meu novo vídeo. Bom apetite!',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    bazes: 673, comentarios: 121, data: '2026-07-02T18:30:00',
  },
  {
    id: 105, autor: 'Carlos Ekuikui', autorAvatar: avatar('Carlos Ekuikui'),
    conteudo: 'Um poema para as ruas de Luanda ao amanhecer. "A cidade acorda em kimbundu..."',
    bazes: 289, comentarios: 44, data: '2026-07-01T06:15:00',
  },
  {
    id: 106, autor: 'Ana Kiala', autorAvatar: avatar('Ana Kiala'),
    conteudo: 'Bem-vindos a todos os novos membros da NzolaNet! Partilhem a vossa cultura. 🇦🇴',
    bazes: 1533, comentarios: 302, data: '2026-06-30T11:00:00',
  },
];

export const COMENTARIOS_MOCK: ComentarioAdmin[] = [
  {
    id: 201, autor: 'Miguel Ndala', autorAvatar: avatar('Miguel Ndala'),
    texto: 'Que coleção incrível! Já quero encomendar. 🔥',
    publicacaoResumo: 'Nova coleção de tecidos com padrões...', publicacaoAutor: 'Nzinga Bengui',
    data: '2026-07-05T15:02:00',
  },
  {
    id: 202, autor: 'Beatriz Kunda', autorAvatar: avatar('Beatriz Kunda'),
    texto: 'As fotos ficaram lindíssimas, Teresa! Parabéns pelo trabalho.',
    publicacaoResumo: 'Registei os melhores momentos do festival...', publicacaoAutor: 'Teresa Mbala',
    data: '2026-07-04T22:00:00',
  },
  {
    id: 203, autor: 'João Kudissonga', autorAvatar: avatar('João Kudissonga'),
    texto: 'Isto é uma vergonha, não devia ser permitido aqui!!!',
    publicacaoResumo: 'Aula aberta de kizomba este sábado...', publicacaoAutor: 'Miguel Ndala',
    data: '2026-07-03T10:30:00',
  },
  {
    id: 204, autor: 'Carlos Ekuikui', autorAvatar: avatar('Carlos Ekuikui'),
    texto: 'Vou levar a família toda. Obrigado pelo convite!',
    publicacaoResumo: 'Aula aberta de kizomba este sábado...', publicacaoAutor: 'Miguel Ndala',
    data: '2026-07-03T12:15:00',
  },
  {
    id: 205, autor: 'Teresa Mbala', autorAvatar: avatar('Teresa Mbala'),
    texto: 'Mufete é vida! Já guardei a receita. 😋',
    publicacaoResumo: 'Receita de mufete passo a passo...', publicacaoAutor: 'Beatriz Kunda',
    data: '2026-07-02T19:05:00',
  },
];

export const BAZES_MOCK: BazeAdmin[] = [
  {
    id: 301, utilizador: 'Miguel Ndala', utilizadorAvatar: avatar('Miguel Ndala'),
    publicacaoResumo: 'Nova coleção de tecidos com padrões...', autorPublicacao: 'Nzinga Bengui',
    data: '2026-07-05T14:25:00',
  },
  {
    id: 302, utilizador: 'Beatriz Kunda', utilizadorAvatar: avatar('Beatriz Kunda'),
    publicacaoResumo: 'Registei os melhores momentos do festival...', autorPublicacao: 'Teresa Mbala',
    data: '2026-07-04T21:40:00',
  },
  {
    id: 303, utilizador: 'Nzinga Bengui', utilizadorAvatar: avatar('Nzinga Bengui'),
    publicacaoResumo: 'Bem-vindos a todos os novos membros...', autorPublicacao: 'Ana Kiala',
    data: '2026-06-30T12:10:00',
  },
  {
    id: 304, utilizador: 'Carlos Ekuikui', utilizadorAvatar: avatar('Carlos Ekuikui'),
    publicacaoResumo: 'Receita de mufete passo a passo...', autorPublicacao: 'Beatriz Kunda',
    data: '2026-07-02T18:55:00',
  },
  {
    id: 305, utilizador: 'Teresa Mbala', utilizadorAvatar: avatar('Teresa Mbala'),
    publicacaoResumo: 'Aula aberta de kizomba este sábado...', autorPublicacao: 'Miguel Ndala',
    data: '2026-07-03T09:50:00',
  },
  {
    id: 306, utilizador: 'Ana Kiala', utilizadorAvatar: avatar('Ana Kiala'),
    publicacaoResumo: 'Um poema para as ruas de Luanda...', autorPublicacao: 'Carlos Ekuikui',
    data: '2026-07-01T07:00:00',
  },
];

export const DENUNCIAS_MOCK: DenunciaAdmin[] = [
  {
    id: 401, tipoAlvo: 'comentario', motivo: 'Discurso de ódio',
    descricao: 'O comentário contém linguagem agressiva e ofensiva dirigida ao autor.',
    estado: 'pendente', data: '2026-07-05T16:00:00',
    denunciante: 'Miguel Ndala', denuncianteAvatar: avatar('Miguel Ndala'),
    autorConteudo: 'João Kudissonga', autorConteudoAvatar: avatar('João Kudissonga'), autorConteudoId: 4,
    conteudo: 'Isto é uma vergonha, não devia ser permitido aqui!!!',
  },
  {
    id: 402, tipoAlvo: 'publicacao', motivo: 'Spam ou publicidade enganosa',
    descricao: 'Publicação repetida várias vezes com links suspeitos.',
    estado: 'pendente', data: '2026-07-04T11:30:00',
    denunciante: 'Teresa Mbala', denuncianteAvatar: avatar('Teresa Mbala'),
    autorConteudo: 'Paulo Chivukuvuku', autorConteudoAvatar: avatar('Paulo Chivukuvuku'), autorConteudoId: 8,
    conteudo: 'GANHE DINHEIRO RÁPIDO!!! Clique no link do meu perfil agora mesmo!!!',
    imagemConteudo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600',
  },
  {
    id: 403, tipoAlvo: 'publicacao', motivo: 'Conteúdo impróprio',
    descricao: '',
    estado: 'aceite', data: '2026-07-02T08:20:00',
    denunciante: 'Beatriz Kunda', denuncianteAvatar: avatar('Beatriz Kunda'),
    autorConteudo: 'João Kudissonga', autorConteudoAvatar: avatar('João Kudissonga'), autorConteudoId: 4,
    conteudo: 'Publicação removida por violar as normas da comunidade.',
  },
  {
    id: 404, tipoAlvo: 'comentario', motivo: 'Assédio',
    descricao: 'Comentários repetidos e indesejados na mesma publicação.',
    estado: 'rejeitada', data: '2026-06-29T19:45:00',
    denunciante: 'Carlos Ekuikui', denuncianteAvatar: avatar('Carlos Ekuikui'),
    autorConteudo: 'Paulo Chivukuvuku', autorConteudoAvatar: avatar('Paulo Chivukuvuku'), autorConteudoId: 8,
    conteudo: 'Segue-me de volta, segue-me de volta, segue-me de volta...',
  },
];

/** Motivos de denúncia partilhados pelo modal de denúncia e pela gestão. */
export const MOTIVOS_DENUNCIA: string[] = [
  'Spam ou publicidade enganosa',
  'Discurso de ódio',
  'Assédio',
  'Conteúdo impróprio',
  'Informação falsa',
  'Violência',
  'Outro',
];
