import React from 'react';
import { useNavigate } from 'react-serif';
import { useNavigate as useRouting } from 'react-router-dom';
import { User, MapPin } from 'lucide-react';

export default function EsqueciSenha() {
  const navigate = useRouting();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Envia para a tela de confirmação de e-mail (que faremos logo a seguir)
    navigate('/confirmacao-email'); 
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      {/* Header com a Logo (clicável para voltar ao login se quiser) */}
      <header className="w-full p-6 border-b flex items-center gap-2">
        <div 
          className="relative text-orange-500 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate('/login')}
        >
           <MapPin size={36} className="fill-current" />
           <User size={18} className="absolute top-1.5 left-2 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-orange-500 tracking-tight">GoGuia</h1>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 mt-[-5vh]">
        <div className="w-full max-w-md text-center">
          
          <h2 className="text-2xl font-bold text-orange-500 mb-4">
            Esqueci minha senha
          </h2>
          
          <p className="text-gray-600 text-sm mb-8 leading-relaxed">
            Digite seu e-mail que enviaremos um link para definir uma nova senha
          </p>

          <form onSubmit={handleSubmit} className="text-left w-full max-w-sm mx-auto space-y-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-bold text-gray-900">
                E-mail
              </label>
              <input 
                id="email"
                type="email" 
                placeholder="Seu E-mail" 
                className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                required
              />
            </div>
            
            <div className="flex justify-center pt-2">
              <button 
                type="submit" 
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-16 rounded-full transition-colors shadow-sm"
              >
                Enviar
              </button>
            </div>
          </form>
          
        </div>
      </main>
    </div>
  );
}