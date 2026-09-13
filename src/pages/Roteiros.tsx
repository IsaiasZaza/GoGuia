import React, { useState } from 'react';
import { Heart, MapPin, User, Clock, Map } from 'lucide-react';

// IMPORTAÇÃO DA LOGO CUSTOMIZADA
import Logo from '../components/Logo';

// 1. IMPORTAÇÃO DAS IMAGENS LOCAIS DA PASTA ASSETS
import imgBikeBrasilia from '../assets/bike_Eixo_Monumental.jpg';
import imgAngra from '../assets/Angra.jpg';
import imgPaulista from '../assets/Av_Paulista.jpg';
import imgFazendinhaDF from '../assets/fazendinha_df.jpg';
import imgHipismoBrasilia from '../assets/hipismo.jpg'; // Certifique-se de que o arquivo está aqui

// Interface para estruturar os dados dos Roteiros
interface TourItem {
  id: string;
  title: string;
  description: string;
  location: string;
  guideName: string;
  price: number;
  duration: string;
  distance: string;
  imageUrl: string;
  category: 'lazer' | 'cultural' | 'rural';
}

export default function RoteirosScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('TUDO');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Array de Roteiros com os dados fornecidos e imagens locais associadas
  const tours: TourItem[] = [
    {
      id: '1',
      title: 'Bike Tour do Eixo Monumental - Brasília',
      description: 'Neste roteiro você conhecerá parte do projeto urbanístico de Lucio Costa e diversas obras de Oscar Niemeyer, um dos maiores arquitectos de todos os tempos.',
      location: 'Brasília / DF',
      guideName: 'Pedro Marcos França',
      price: 180.00,
      duration: '3 h',
      distance: '15 Km',
      category: 'cultural',
      imageUrl: imgBikeBrasilia,
    },
    {
      id: '2',
      title: 'Um Dia no Rio - City Tour Completo',
      description: 'Selecionamos os principais pontos turísticos do Rio de Janeiro para serem visitados em um roteiro único e dinâmico, com conforto e segurança. Além disso, oferecemos o acompanhamento de um guia que maximiza a experiência de nossos turistas contando as curiosidades e fatos históricos da cidade.',
      location: 'Rio de Janeiro / RJ',
      guideName: 'Carlos Alberto Lima',
      price: 300.00,
      duration: '8 h',
      distance: '45 Km',
      category: 'lazer',
      imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=500',
    },
    {
      id: '3',
      title: 'Excursão de Dia Inteiro a Angra dos Reis e Ilha Grande',
      description: 'Prepare-se para viver um dia inesquecível explorando dois dos destinos mais paradisíacos do Brasil! Localizados na deslumbrante Costa Verde, Angra dos Reis e Ilha Grande oferecem um espetáculo de natureza, onde o mar azul cristalino se encontra com o verde exuberante da mata atlântica.',
      location: 'Angra dos Reis / RJ',
      guideName: 'Mariana Costa Reis',
      price: 250.00,
      duration: '10 h',
      distance: '120 Km',
      category: 'lazer',
      imageUrl: imgAngra,
    },
    {
      id: '4',
      title: 'Passeio a Pé pela Avenida Paulista – A Mais Famosa do Brasil',
      description: 'Faça um passeio a pé pela avenida Paulista e desvende as histórias da avenida mais famosa do Brasil.',
      location: 'São Paulo / SP',
      guideName: 'Fernanda Souza',
      price: 90.00,
      duration: '2 h',
      distance: '4 Km',
      category: 'cultural',
      imageUrl: imgPaulista,
    },
    {
      id: '5',
      title: 'Centro Hípico Lago Sul - Brasília',
      description: 'Desconecte-se da rotina e reconecte-se com a natureza em uma cavalgada inesquecível. Sinta a liberdade de explorar trilhas exclusivas, desfrutando de paisagens deslumbrantes no ritmo único do cavalo, ideal tanto para iniciantes quanto para cavaleiros experientes.',
      location: 'Brasília / DF',
      guideName: 'Ricardo Silveira',
      price: 150.00,
      duration: '2 h',
      distance: '8 Km',
      category: 'rural',
      imageUrl: imgHipismoBrasilia, // Imagem ajustada
    },
    {
      id: '6',
      title: 'Fazenda Azul',
      description: 'Aproveite o nosso passeio incrível pela fazenda Azul, conhecendo diversas cachoeiras e animais exóticos, além de um excelente pequenique.',
      location: 'Planaltina / DF',
      guideName: 'Antônio Bezerra',
      price: 120.00,
      duration: '5 h',
      distance: '12 Km',
      category: 'rural',
      imageUrl: imgFazendinhaDF,
    }
  ];

  // Filtros aplicados na listagem de forma reativa
  const filteredTours = tours.filter(tour => {
    const matchesCategory = selectedCategory === 'TUDO' || tour.category === selectedCategory.toLowerCase();
    const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tour.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#f4f4f6] font-sans antialiased text-gray-700">

      {/* 1. BARRA DE NAVEGAÇÃO SUPERIOR (PADRÃO GOGUIA) */}
      <header className="flex items-center justify-between px-8 py-3 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <Logo />
        <div className="flex items-center gap-6">
          <button className="bg-[#F27420] text-white px-6 py-2.5 rounded-full font-bold text-sm tracking-wide shadow-sm hover:bg-[#d65f15] transition-colors flex items-center gap-2">
            <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center text-[10px]">👤</div>
            Minha Conta
          </button>
        </div>
      </header>

      {/* 2. CONTEÚDO DA TELA (GRID LATERAL + PRODUTOS) */}
      <div className="flex flex-1 max-w-[1300px] w-full mx-auto p-6 gap-8">

        {/* COLUNA ESQUERDA: MENU DE CATEGORIAS */}
        <aside className="w-[200px] flex-shrink-0 flex flex-col gap-3 pt-14">
          {['TUDO', 'Lazer', 'Cultural', 'Rural'].map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-4 py-2 text-left font-bold text-sm transition-all rounded ${
                  isSelected
                    ? 'bg-[#F27420] text-white pr-6 shadow-sm'
                    : 'text-[#1F3A66] hover:bg-gray-200/60'
                }`}
                style={{
                  clipPath: isSelected ? 'polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)' : 'none'
                }}
              >
                {cat.toUpperCase()}
              </button>
            );
          })}
        </aside>

        {/* COLUNA DIREITA: BARRA DE PESQUISA + LISTA DE CARDS */}
        <main className="flex-1 flex flex-col gap-6">

          {/* Barra de Pesquisa */}
          <div className="w-full bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar pelo nome ou local . . ."
              className="flex-1 bg-[#eaeaea]/60 text-sm text-gray-700 placeholder-gray-500 rounded px-4 py-2 focus:outline-none"
            />
            <button className="bg-[#1F3A66] text-white font-bold text-xs px-6 py-2 rounded shadow hover:bg-[#152847] transition-colors">
              Buscar
            </button>
          </div>

          {/* Listagem de Roteiros Reativa */}
          <div className="flex flex-col gap-5">
            {filteredTours.length > 0 ? (
              filteredTours.map((tour) => (
                <div
                  key={tour.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex p-4 gap-5 relative group hover:shadow-md transition-shadow"
                >

                  {/* Container da Imagem com Badge de Favorito */}
                  <div className="w-[260px] h-[170px] rounded-lg overflow-hidden relative flex-shrink-0 bg-gray-100">
                    <img
                      src={tour.imageUrl}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <button className="absolute top-2 left-2 bg-white/90 p-1.5 rounded-full shadow-md hover:bg-white transition-colors">
                      <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
                    </button>
                  </div>

                  {/* Informações Completas do Roteiro */}
                  <div className="flex flex-col justify-between flex-1 min-w-0 pr-4">
                    <div>
                      {/* Título */}
                      <h2 className="text-xl font-bold text-gray-900 leading-tight truncate">
                        {tour.title}
                      </h2>

                      {/* Descrição Curta */}
                      <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">
                        {tour.description}
                      </p>
                    </div>

                    {/* Metadados: Localização e Guia */}
                    <div className="flex flex-col gap-1.5 mt-3">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1F3A66]">
                        <MapPin className="w-3.5 h-3.5 text-[#1F3A66]" />
                        <span>{tour.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                        <User className="w-3.5 h-3.5 text-gray-500" />
                        <span>{tour.guideName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Detalhes de Duração, Distância, Valor e Botão (Canto Direito) */}
                  <div className="w-[140px] flex flex-col justify-between items-end flex-shrink-0 pl-2 border-l border-gray-100">
                    {/* Duração / Distância */}
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 font-bold bg-gray-50 px-2 py-1 rounded">
                      <Clock className="w-3 h-3" />
                      <span>{tour.duration}</span>
                      <span>/</span>
                      <Map className="w-3 h-3" />
                      <span>{tour.distance}</span>
                    </div>

                    {/* Bloco de Preço e Ação */}
                    <div className="w-full text-right mt-auto">
                      <div className="text-xs text-[#1F3A66] font-bold">R$</div>
                      <div className="text-2xl font-black text-[#1F3A66] -mt-1">
                        {tour.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                      <button className="w-full mt-2 bg-[#1F3A66] text-white text-sm font-bold py-2 rounded-md shadow-sm hover:bg-[#152847] transition-colors">
                        Ver
                      </button>
                    </div>

                  </div>

                </div>
              ))
            ) : (
              <div className="bg-white p-8 rounded-lg border text-center text-gray-400 font-medium text-sm">
                Nenhum roteiro encontrado para os filtros selecionados.
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}