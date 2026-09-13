import React, { useState } from 'react';
import { Send } from 'lucide-react';

// 1. IMPORTAÇÃO DA LOGO CUSTOMIZADA (No mesmo nível de diretório)
import Logo from '../components/Logo';

// Interfaces de Tipo para os Dados
interface Message {
  id: string;
  text: string;
  time: string;
  sender: 'me' | 'other';
}

export default function ChatClienteScreen() {
  // Histórico de mensagens do chat (Visualização da perspectiva da cliente Fabiana)
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

      {/* 1. BARRA DE NAVEGAÇÃO SUPERIOR DO CLIENTE */}
      <header className="flex items-center justify-between px-8 py-3 bg-white border-b border-gray-200 shadow-sm">
        {/* Logo GoGuia renderizada de forma dinâmica */}
        <Logo />

        {/* Botão do Lado Direito */}
        <div>
          <button className="bg-[#F27420] text-white px-6 py-2.5 rounded-full font-bold text-sm tracking-wide shadow-sm hover:bg-[#d65f15] transition-colors flex items-center gap-2">
            {/* Ícone sutil simulando o avatar do botão do protótipo */}
            <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center text-[10px]">👤</div>
            Minha Conta
          </button>
        </div>
      </header>

      {/* 2. CONTEÚDO PRINCIPAL (TELA DE CHAT EXPANDIDA) */}
      <div className="flex-1 overflow-hidden w-full mx-auto p-4 flex flex-col">

        <main className="flex-1 bg-white border border-gray-200 rounded-lg flex flex-col justify-between overflow-hidden shadow-sm">

          {/* Topo do Chat (Info do Guia + Botão Voltar) */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              {/* Avatar do Guia */}
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 text-sm">
                MO
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-800">Marcelo Oliveira</h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-gray-400">online</span>
                </div>
              </div>
            </div>

            {/* Botão Voltar conforme o Protótipo */}
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-1.5 text-[#1F3A66] font-bold text-sm hover:text-orange-600 transition-colors"
            >
              ← Voltar
            </button>
          </div>

          {/* Histórico de Mensagens Centralizado */}
          <div className="flex-1 overflow-y-auto p-8 bg-[#FAFAFA] flex flex-col gap-4">
            <div className="text-center text-xs text-gray-400 my-2 font-medium">Hoje</div>

            {messages.map((msg) => {
              const isMe = msg.sender === 'me';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[65%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
                >
                  <div
                    className={`px-5 py-3 rounded-2xl text-sm font-medium shadow-sm leading-relaxed
                      ${isMe
                        ? 'bg-[#F27420] text-white rounded-br-none'
                        : 'bg-[#D9D9D9] text-gray-800 rounded-bl-none'
                      }`}
                  >
                    {msg.text}
                  </div>

                  {/* Container da Hora e do Checkmark de lido */}
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400 px-1">
                    <span>{msg.time}</span>
                    {isMe && <span className="text-green-500 font-bold">✓✓</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Campo de Input / Enviar Mensagem */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex items-center gap-3 px-6">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Digite a sua mensagem..."
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none py-2"
            />
            <button
              type="submit"
              className="text-gray-400 hover:text-[#F27420] transition-colors p-2"
            >
              <Send className="w-6 h-6 transform rotate-45" />
            </button>
          </form>

        </main>
      </div>
    </div>
  );
}