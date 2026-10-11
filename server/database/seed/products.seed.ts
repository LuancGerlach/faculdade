import type { Product } from '../../entity/Product.js';

export type ProductSeed = Omit<Product, 'id' | 'createdAt'>;

const defaultModules = (mapName: string) => [
  {
    title: 'Módulo 1 · Fundamentos',
    duration: '32min',
    lessons: [
      { title: `Posições de abertura em ${mapName}`, duration: '08:12' },
      { title: 'Cross de mid e leitura', duration: '07:40' },
    ],
  },
  {
    title: 'Módulo 2 · Utility',
    duration: '58min',
    lessons: [
      { title: 'Smokes de retenção', duration: '09:05' },
      { title: 'Molotovs de atraso', duration: '06:22' },
    ],
  },
  {
    title: 'Módulo 3 · Retakes e rotação',
    duration: '1h10',
    lessons: [{ title: 'Retake padrão', duration: '11:18' }],
  },
];

export const productsSeed: ProductSeed[] = [
  {
    title: 'Default de CT em Mirage', type: 'CURSO', category: 'Táticas', map: 'Mirage',
    priceInCents: 7900, oldPriceInCents: 12900, rating: 4.9, reviewsCount: 312, salesCount: 1840, badge: 'TOP',
    author: 'Coach Rafa',
    description: 'Aprenda o posicionamento defensivo padrão em Mirage: como cobrir A e B com utility, rotações rápidas e leitura de rush. Ideal para quem quer subir de elo jogando de CT.',
    modules: defaultModules('Mirage'),
  },
  {
    title: '100 lineups de Inferno', type: 'EBOOK', category: 'Granadas', map: 'Inferno',
    priceInCents: 3900, oldPriceInCents: null, rating: 4.4, reviewsCount: 188, salesCount: 1520, badge: 'NOVO',
    author: 'Nade King',
    description: 'E-book com 100 lineups de smoke, molotov e flash para Inferno, com prints de posicionamento e mira. Do básico de banana até os execs completos de A e B.',
    modules: [],
  },
  {
    title: 'Treino de mira e spray', type: 'CURSO', category: 'Aim', map: null,
    priceInCents: 5900, oldPriceInCents: null, rating: 4.8, reviewsCount: 421, salesCount: 2210, badge: null,
    author: 'Aimbot Ana',
    description: 'Rotina diária de treino de mira, controle de spray de AK, M4 e AWP, e configuração de sensibilidade para consistência.',
    modules: defaultModules('Aim Botz'),
  },
  {
    title: 'Retakes de Inferno B', type: 'CURSO', category: 'Táticas', map: 'Inferno',
    priceInCents: 5900, oldPriceInCents: 7900, rating: 4.9, reviewsCount: 140, salesCount: 980, badge: 'TOP',
    author: 'Coach Rafa',
    description: 'Como retomar o bomb B de Inferno em 2v3, 3v3 e 4v4: utility de entrada, trades e posições pós-plant.',
    modules: defaultModules('Inferno'),
  },
  {
    title: 'Controle de Banana', type: 'CURSO', category: 'Táticas', map: 'Inferno',
    priceInCents: 4900, oldPriceInCents: null, rating: 4.7, reviewsCount: 96, salesCount: 640, badge: null,
    author: 'Coach Rafa',
    description: 'Domine a banana de Inferno dos dois lados: utilidade de controle, timings e leitura do adversário.',
    modules: defaultModules('Inferno'),
  },
  {
    title: 'Buy rounds em Inferno', type: 'EBOOK', category: 'Economia', map: 'Inferno',
    priceInCents: 2900, oldPriceInCents: null, rating: 4.3, reviewsCount: 74, salesCount: 410, badge: null,
    author: 'Eco Edu',
    description: 'Guia de economia aplicado a Inferno: quando forçar, quando salvar e como coordenar compras com o time.',
    modules: [],
  },
  {
    title: 'Duelos em apartamentos', type: 'CURSO', category: 'Aim', map: 'Inferno',
    priceInCents: 4400, oldPriceInCents: null, rating: 4.5, reviewsCount: 58, salesCount: 350, badge: 'NOVO',
    author: 'Aimbot Ana',
    description: 'Peek, pre-aim e posicionamento para vencer duelos nos apartamentos de Inferno.',
    modules: defaultModules('Inferno'),
  },
  {
    title: 'Bundle completo Inferno', type: 'PACOTE', category: 'Pacote', map: 'Inferno',
    priceInCents: 9900, oldPriceInCents: 18600, rating: 4.9, reviewsCount: 205, salesCount: 1200, badge: 'TOP',
    author: 'Equipe CS2 Market',
    description: 'Todos os conteúdos de Inferno em um só pacote: retakes, banana, apartamentos, lineups e economia.',
    modules: [],
  },
  {
    title: 'Smokes essenciais de Mirage', type: 'EBOOK', category: 'Granadas', map: 'Mirage',
    priceInCents: 3400, oldPriceInCents: null, rating: 4.6, reviewsCount: 260, salesCount: 1700, badge: null,
    author: 'Nade King',
    description: 'As smokes que todo jogador precisa saber em Mirage: execs de A, B e controle de mid.',
    modules: [],
  },
  {
    title: 'Execs de Ancient', type: 'CURSO', category: 'Táticas', map: 'Ancient',
    priceInCents: 6900, oldPriceInCents: null, rating: 4.6, reviewsCount: 87, salesCount: 520, badge: 'NOVO',
    author: 'Coach Rafa',
    description: 'Execuções completas de A e B em Ancient com utility coordenado para 5 jogadores.',
    modules: defaultModules('Ancient'),
  },
  {
    title: 'Rotações em Nuke', type: 'CURSO', category: 'Táticas', map: 'Nuke',
    priceInCents: 6400, oldPriceInCents: 8900, rating: 4.7, reviewsCount: 112, salesCount: 600, badge: null,
    author: 'Coach Rafa',
    description: 'Entenda a verticalidade de Nuke: rotações por rampa, vents e hut para defender e atacar melhor.',
    modules: defaultModules('Nuke'),
  },
  {
    title: 'Guia de economia competitiva', type: 'EBOOK', category: 'Economia', map: null,
    priceInCents: 2500, oldPriceInCents: null, rating: 4.2, reviewsCount: 66, salesCount: 480, badge: null,
    author: 'Eco Edu',
    description: 'Regras de loss bonus, compras de pistol, force buy e full save explicadas com exemplos de partidas.',
    modules: [],
  },
  {
    title: 'Bundle Mirage Pro', type: 'PACOTE', category: 'Pacote', map: 'Mirage',
    priceInCents: 10900, oldPriceInCents: 16700, rating: 4.8, reviewsCount: 133, salesCount: 760, badge: null,
    author: 'Equipe CS2 Market',
    description: 'Default de CT, smokes essenciais e retakes de Mirage com desconto de pacote.',
    modules: [],
  },
];
