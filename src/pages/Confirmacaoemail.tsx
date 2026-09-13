import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, CheckCircle2 } from 'lucide-react';

export default function ConfirmacaoEmail() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      {/* Header com a Logo */}
      <header className="w-full p-6 border-b flex items-center gap-2">
        <div className="relative text-orange-500">
           <MapPin size={36} className="fill-current" />
           <User size={18} className="absolute top-1.5 left-2 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-orange-500 tracking-tight">GoGuia</h1>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 mt-[-10vh]">
        <div className="flex flex-col items-center text-center">
          
          <CheckCircle2 size={64} className="text-green-500 mb-6" />
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Tudo certo!
          </h2>
          
          <p className="text-gray-700 mb-12">
            Email confirmado com sucesso
          </p>

          <button 
            onClick={() => navigate('/login')}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-16 rounded-sm transition-colors"
          >
            OK
          </button>
          
        </div>
      </main>
    </div>
  );
}