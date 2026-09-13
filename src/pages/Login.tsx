import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, MapPin } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // No futuro, ligamos aqui a API do backend. 
    // Por enquanto, fingimos que o login funcionou e vamos para a Home:
    navigate('/home'); 
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      {/* Barra Superior (Header) com a Logo */}
      <header className="w-full p-6 border-b flex items-center gap-2">
        <div className="relative text-orange-500">
           <MapPin size={36} className="fill-current" />
           <User size={18} className="absolute top-1.5 left-2 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-orange-500 tracking-tight">GoGuia</h1>
      </header>

      {/* Área Central da Tela */}
      <main className="flex-1 flex flex-col md:flex-row max-w-6xl w-full mx-auto p-4 gap-8 md:gap-16 items-center justify-center">
        
        {/* LADO ESQUERDO: Formulário de Login */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Bem Vindo(a) de Volta !</h2>
          
          <form onSubmit={handleLogin} className="w-full max-w-sm space-y-5">
            <input 
              type="email" 
              placeholder="E-mail" 
              className="w-full p-3 bg-gray-200 text-gray-700 rounded-sm outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <input 
              type="password" 
              placeholder="Senha" 
              className="w-full p-3 bg-gray-200 text-gray-700 rounded-sm outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <div className="pt-2">
              <button 
                type="submit" 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full transition-colors"
              >
                Entrar
              </button>
            </div>
          </form>
          
          {/* Link para Esqueci a Senha */}
          <div className="mt-8 text-center text-sm font-bold text-gray-800">
            <p>Esqueceu sua senha?</p>
            <button 
              onClick={() => navigate('/esqueci-senha')} 
              className="hover:underline cursor-pointer text-orange-500"
            >
              Clique aqui
            </button>
          </div>
        </div>

        {/* LADO DIREITO: Bloco de Cadastro (Laranja) */}
        <div className="w-full md:w-1/2 bg-orange-500 text-white p-10 rounded-xl flex flex-col items-center justify-center shadow-lg">
          <h2 className="text-3xl font-bold mb-8">Cadastre-se</h2>
          
          {/* Upload de Foto */}
          <div className="flex items-center gap-4 mb-8 w-full max-w-sm">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center shrink-0">
              <User size={32} className="text-gray-300" />
            </div>
            <span className="text-sm font-bold">Faça o upload da sua foto</span>
          </div>

          {/* Campos do Cadastro */}
          <form className="w-full max-w-sm space-y-4">
            <div className="relative text-orange-500">
              <User className="absolute left-3 top-3.5" size={20} />
              <input 
                type="text" 
                placeholder="Nome Completo" 
                className="w-full p-3 pl-10 bg-white text-gray-800 rounded-sm outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
            <div className="relative text-orange-500">
              <Mail className="absolute left-3 top-3.5" size={20} />
              <input 
                type="email" 
                placeholder="e-mail" 
                className="w-full p-3 pl-10 bg-white text-gray-800 rounded-sm outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
            <div className="relative text-orange-500">
              <Lock className="absolute left-3 top-3.5" size={20} />
              <input 
                type="password" 
                placeholder="Senha" 
                className="w-full p-3 pl-10 bg-white text-gray-800 rounded-sm outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
            <div className="pt-6 flex justify-center">
              <button 
                type="button" 
                className="border-2 border-white text-white font-bold py-2 px-12 rounded-full hover:bg-white hover:text-orange-500 transition-colors"
              >
                Cadastrar
              </button>
            </div>
          </form>
        </div>

      </main>
    </div>
  );
}