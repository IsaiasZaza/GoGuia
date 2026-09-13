import React, { useState } from 'react';
import {
  Search,
  Home,
  Bookmark,
  List,
  MessageSquare,
  Send,
  Heart
} from 'lucide-react';

// 1. IMPORTAÇÃO DAS IMAGENS LOCAIS DA PASTA ASSETS
import imgVinicola from '../assets/Vinicola.jpg';
import imgExcursao from '../assets/Excursao_Guiada.jpg';
import imgCatedral from '../assets/Catedral_da_fe.webp';
import imgCentroCultural from '../assets/Centro_Cultural_BB.jpg';

// 2. IMPORTAÇÃO DA LOGO CUSTOMIZADA
import Logo from '../components/Logo';
// Interfaces de Tipo para os Dados
interface ChatListItem {
  id: string;
  tourName: string;
  guideName: string;
  status: 'online' | 'offline';
  lastMessage: string;
  timeOrDate: string;
  imageUrl: string;
  active?: boolean;
}

interface Message {
  id: string;
  text: string;
  time: string;
  sender: 'me' | 'other';
}

export default function ChatScreen() {
  // Mock de dados atualizado com as variáveis das imagens importadas
  const [chats, setChats] = useState<ChatListItem[]>([
    {
      id: '1',
      tourName: 'Passeio Vinícola Brasília',
      guideName: 'Marcelo Oliveira',
      status: 'online',
      lastMessage: 'Tudo Certo! Ansiosa',
      timeOrDate: '14:30',
      imageUrl: imgVinicola,
      active: true,
    },
    {
      id: '2',
      tourName: 'Excursão Guiada Acrópole e Partenão',
      guideName: 'Laura Dias',
      status: 'offline',
      lastMessage: 'Foi excelente!',
      timeOrDate: '12/02',
      imageUrl: imgExcursao,
    },
    {
      id: '3',
      tourName: 'Catedral da fé',
      guideName: 'Samuel Dantas',
      status: 'online',
      lastMessage: 'Posso buscá-los no hotel',
      timeOrDate: '14/01',
      imageUrl: imgCatedral,
    },
    {
      id: '4',
      tourName: 'Centro Cultural Banco do Brasil',
      guideName: 'Julia Pires',
      status: 'online',
      lastMessage: 'Seu atendimento foi incrível!',
      timeOrDate: '13/01',
      imageUrl: imgCentroCultural,
    },
    {
      id: '5',
      tourName: 'Tour em Maragogi',
      guideName: 'Alexandre Soares',
      status: 'offline',
      lastMessage: 'Podemos organizar um passeio especializado para vocês',
      timeOrDate: '02/12',
      imageUrl: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=150',
    },
  ]);

  // Histórico de mensagens do chat ativo (Marcelo Oliveira)
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Ola Marcelo, tudo bem?', time: '13:45', sender: 'me' },
    { id: '2', text: 'Ola Fabiana', time: '14:30', sender: 'other' },
    { id: '3', text: 'Tudo certo para o nosso tour amanhã?', time: '14:30', sender: 'other' },
    { id: '4', text: 'Te espero lá !', time: '14:30', sender: 'other' },
    { id: '5', text: 'Tudo Certo! Ansiosa', time: '14:30', sender: 'me' },
  ]);

  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      sender: 'me',
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 font-sans antialiased text-gray-700">

      {/* 1. BARRA DE NAVEGAÇÃO SUPERIOR */}
      <header className="flex items-center justify-between px-8 py-3 bg-white border-b border-gray-200 shadow-sm">
        {/* Logo GoGuia e Ícones de Navegação */}
        <div className="flex items-center gap-2">
          {/* Componente da Logo customizado inserido aqui */}
          <Logo />

          {/* Ícones de Navegação */}
          <nav className="flex items-center gap-5 ml-8 text-gray-500">
            <Home className="w-5 h-5 cursor-pointer hover:text-gray-800" />
            <Bookmark className="w-5 h-5 cursor-pointer hover:text-gray-800" />
            <List className="w-5 h-5 cursor-pointer hover:text-gray-800" />
          </nav>
        </div>

        {/* Barra de Pesquisa Central */}
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full bg-gray-200 text-gray-600 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
          />
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
        </div>

        {/* Botões do Lado Direito */}
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
            <MessageSquare className="w-5 h-5 text-gray-600" />
            Chat
          </button>
          <button className="bg-[#F27420] text-white px-6 py-2.5 rounded-full font-bold text-sm tracking-wide shadow-sm hover:bg-[#d65f15] transition-colors">
            Minha Conta
          </button>
        </div>
      </header>

      {/* 2. CONTEÚDO PRINCIPAL (SPLIT SCREEN) */}
      <div className="flex flex-1 overflow-hidden max-w-[1400px] w-full mx-auto p-4 gap-4">

        {/* COLUNA DA ESQUERDA: LISTA DE CHATS */}
        <aside className="w-[400px] bg-white border border-gray-200 rounded-lg overflow-y-auto flex flex-col divide-y divide-gray-100">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`p-3 flex gap-3 relative cursor-pointer hover:bg-gray-50 transition-colors ${chat.active ? 'bg-orange-50/40' : ''}`}
            >
              {/* Miniatura do Tour */}
              <div className="relative w-24 h-20 rounded overflow-hidden flex-shrink-0">
                <img src={chat.imageUrl} alt={chat.tourName} className="w-full h-full object-cover" />
                <button className="absolute top-1 left-1 bg-white/80 p-0.5 rounded-full shadow-sm">
                  <Heart className="w-3 h-3 text-gray-600" />
                </button>
              </div>

              {/* Informações textuais */}
              <div className="flex flex-col justify-between flex-1 min-w-0 pr-12">
                <div>
                  <h4 className="font-bold text-xs text-gray-900 truncate">{chat.tourName}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[11px] text-gray-600 font-medium">{chat.guideName}</span>
                    <span className={`w-2 h-2 rounded-full ${chat.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-[9px] text-gray-400">{chat.status}</span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 truncate mt-1">{chat.lastMessage}</p>
              </div>

              {/* Data/Hora no Canto Superior Direito */}
              <span className="absolute top-3 right-3 text-[10px] text-gray-400">{chat.timeOrDate}</span>
            </div>
          ))}
        </aside>

        {/* COLUNA DA DIREITA: JANELA DO CHAT */}
        <main className="flex-1 bg-white border border-gray-200 rounded-lg flex flex-col justify-between overflow-hidden">

          {/* Topo do Chat (Info do Guia Ativo) */}
          <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-3 bg-white">
            <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
              MO
            </div>
            <div>
              <h3 className="font-semibold text-xs text-gray-800">Marcelo Oliveira</h3>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-[10px] text-gray-400">online</span>
              </div>
            </div>
          </div>

          {/* Histórico de Mensagens */}
          <div className="flex-1 overflow-y-auto p-6 bg-[#FAFAFA] flex flex-col gap-3">
            <div className="text-center text-[11px] text-gray-400 my-2 font-medium">Hoje</div>

            {messages.map((msg) => {
              const isMe = msg.sender === 'me';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[70%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
                >
                  <div
                    className={`px-4 py-2 rounded-xl text-xs font-medium shadow-sm leading-relaxed
                      ${isMe
                        ? 'bg-[#F27420] text-white rounded-br-none'
                        : 'bg-[#D9D9D9] text-gray-800 rounded-bl-none'
                      }`}
                  >
                    {msg.text}
                  </div>

                  {/* Container da Hora e do Checkmark de lido */}
                  <div className="flex items-center gap-1 mt-1 text-[9px] text-gray-400 px-1">
                    <span>{msg.time}</span>
                    {isMe && <span className="text-green-500 font-bold">✓✓</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Campo de Input / Enviar Mensagem */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Digite a sua mensagem..."
              className="flex-1 bg-transparent text-xs text-gray-700 placeholder-gray-400 focus:outline-none px-2"
            />
            <button
              type="submit"
              className="text-gray-500 hover:text-[#F27420] transition-colors p-1"
            >
              <Send className="w-5 h-5 transform rotate-45" />
            </button>
          </form>

        </main>
      </div>
    </div>
  );
}