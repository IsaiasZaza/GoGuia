"use client";

import { useState } from "react";
import { Heart, Send } from "lucide-react";
import AppHeader from "@/components/layout/AppHeader";
import SearchBar from "@/components/layout/SearchBar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const imgVinicola = "/assets/Vinicola.jpg";
const imgExcursao = "/assets/Excursao_Guiada.jpg";
const imgCatedral = "/assets/Catedral_da_fe.webp";
const imgCentroCultural = "/assets/Centro_Cultural_BB.jpg";

interface ChatListItem {
  id: string;
  tourName: string;
  guideName: string;
  status: "online" | "offline";
  lastMessage: string;
  timeOrDate: string;
  imageUrl: string;
}

interface Message {
  id: string;
  text: string;
  time: string;
  sender: "me" | "other";
}

export default function ChatScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChatId, setActiveChatId] = useState("1");

  const [chats] = useState<ChatListItem[]>([
    {
      id: "1",
      tourName: "Passeio Vinícola Brasília",
      guideName: "Marcelo Oliveira",
      status: "online",
      lastMessage: "Tudo certo! Ansiosa",
      timeOrDate: "14:30",
      imageUrl: imgVinicola,
    },
    {
      id: "2",
      tourName: "Excursão Guiada Acrópole e Partenão",
      guideName: "Laura Dias",
      status: "offline",
      lastMessage: "Foi excelente!",
      timeOrDate: "12/02",
      imageUrl: imgExcursao,
    },
    {
      id: "3",
      tourName: "Catedral da Fé",
      guideName: "Samuel Dantas",
      status: "online",
      lastMessage: "Posso buscá-los no hotel",
      timeOrDate: "14/01",
      imageUrl: imgCatedral,
    },
    {
      id: "4",
      tourName: "Centro Cultural Banco do Brasil",
      guideName: "Julia Pires",
      status: "online",
      lastMessage: "Seu atendimento foi incrível!",
      timeOrDate: "13/01",
      imageUrl: imgCentroCultural,
    },
    {
      id: "5",
      tourName: "Tour em Maragogi",
      guideName: "Alexandre Soares",
      status: "offline",
      lastMessage: "Podemos organizar um passeio especializado para vocês",
      timeOrDate: "02/12",
      imageUrl: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=150",
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Olá Marcelo, tudo bem?", time: "13:45", sender: "me" },
    { id: "2", text: "Olá Fabiana", time: "14:30", sender: "other" },
    { id: "3", text: "Tudo certo para o nosso tour amanhã?", time: "14:30", sender: "other" },
    { id: "4", text: "Te espero lá!", time: "14:30", sender: "other" },
    { id: "5", text: "Tudo certo! Ansiosa", time: "14:30", sender: "me" },
  ]);

  const [inputMessage, setInputMessage] = useState("");

  const activeChat = chats.find((c) => c.id === activeChatId) ?? chats[0];

  const filteredChats = chats.filter(
    (c) =>
      c.tourName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.guideName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        text: inputMessage,
        time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        sender: "me",
      },
    ]);
    setInputMessage("");
  };

  return (
    <div className="flex h-screen flex-col bg-[#f4f4f6] font-sans">
      <AppHeader activePage="chat" />

      <div className="mx-auto flex w-full max-w-[1400px] flex-1 gap-4 overflow-hidden p-4">
        {/* Lista de chats */}
        <aside className="flex w-full flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm md:w-[380px]">
          <div className="border-b p-3">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar conversas..."
              className="border-0 p-0 shadow-none"
            />
          </div>
          <div className="flex-1 divide-y divide-border overflow-y-auto">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                type="button"
                onClick={() => setActiveChatId(chat.id)}
                className={cn(
                  "relative flex w-full gap-3 p-3 text-left transition-colors hover:bg-muted/50",
                  activeChatId === chat.id && "bg-[#F27420]/5"
                )}
              >
                <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg">
                  <img src={chat.imageUrl} alt={chat.tourName} className="h-full w-full object-cover" />
                  <span className="absolute left-1 top-1 rounded-full bg-white/80 p-0.5">
                    <Heart className="h-3 w-3 text-muted-foreground" />
                  </span>
                </div>
                <div className="min-w-0 flex-1 pr-10">
                  <h4 className="truncate text-xs font-bold">{chat.tourName}</h4>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className="text-[11px] font-medium text-muted-foreground">{chat.guideName}</span>
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        chat.status === "online" ? "bg-green-500" : "bg-gray-400"
                      )}
                    />
                  </div>
                  <p className="mt-1 truncate text-[11px] text-muted-foreground">{chat.lastMessage}</p>
                </div>
                <span className="absolute right-3 top-3 text-[10px] text-muted-foreground">
                  {chat.timeOrDate}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* Janela do chat */}
        <main className="hidden flex-1 flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm md:flex">
          <div className="flex items-center gap-3 border-b px-6 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
              {activeChat.guideName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div>
              <h3 className="text-sm font-semibold">{activeChat.guideName}</h3>
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    activeChat.status === "online" ? "bg-green-500" : "bg-gray-400"
                  )}
                />
                <span className="text-[10px] text-muted-foreground">{activeChat.status}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-muted/30 p-6">
            <div className="my-2 text-center text-[11px] font-medium text-muted-foreground">Hoje</div>
            {messages.map((msg) => {
              const isMe = msg.sender === "me";
              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex max-w-[70%] flex-col",
                    isMe ? "self-end items-end" : "self-start items-start"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2.5 text-xs font-medium leading-relaxed shadow-sm",
                      isMe
                        ? "rounded-br-sm bg-[#F27420] text-white"
                        : "rounded-bl-sm bg-white text-foreground"
                    )}
                  >
                    {msg.text}
                  </div>
                  <div className="mt-1 flex items-center gap-1 px-1 text-[9px] text-muted-foreground">
                    <span>{msg.time}</span>
                    {isMe && <span className="font-bold text-green-500">✓✓</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-3 border-t bg-white px-6 py-4"
          >
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="border-0 shadow-none focus-visible:ring-0"
            />
            <button
              type="submit"
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-[#F27420]/10 hover:text-[#F27420]"
              aria-label="Enviar mensagem"
            >
              <Send className="h-5 w-5 rotate-45" />
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
