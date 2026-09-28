"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, MessageCircle, Send } from "lucide-react";
import { useSearchParams } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { enviarMensagem, listarConversas, listarMensagens } from "@/services/dominio";

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
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChatId, setActiveChatId] = useState(searchParams.get("id") || "");
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [carregandoLista, setCarregandoLista] = useState(true);
  const [mostrarLista, setMostrarLista] = useState(!searchParams.get("id"));
  const fimDasMensagens = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listarConversas()
      .then((data) => {
        const items = data.items.map((item) => ({
          id: item.id,
          tourName: item.roteiro.titulo,
          guideName: item.outroUsuario.nomeCompleto,
          status: item.outroUsuario.online ? ("online" as const) : ("offline" as const),
          lastMessage: item.ultimaMensagem?.texto || "Nenhuma mensagem ainda",
          timeOrDate: new Date(item.atualizadoEm).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          imageUrl: item.roteiro.imageUrl || "",
        }));
        setChats(items);
        setActiveChatId((atual) => atual || items[0]?.id || "");
      })
      .catch(() => setChats([]))
      .finally(() => setCarregandoLista(false));
  }, []);

  useEffect(() => {
    if (!activeChatId) return;
    const carregar = () =>
      listarMensagens(activeChatId)
        .then((data) =>
          setMessages(
            data.items.map((item) => ({
              id: item.id,
              text: item.texto,
              time: new Date(item.criadoEm).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              sender: item.minha ? ("me" as const) : ("other" as const),
            }))
          )
        )
        .catch(() => undefined);
    carregar();
    const timer = window.setInterval(carregar, 5000);
    return () => window.clearInterval(timer);
  }, [activeChatId]);

  useEffect(() => {
    fimDasMensagens.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const activeChat = chats.find((c) => c.id === activeChatId);

  const filteredChats = chats.filter(
    (c) =>
      c.tourName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.guideName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeChatId) return;
    const texto = inputMessage;
    setInputMessage("");
    enviarMensagem(activeChatId, texto)
      .then((item) => {
        const hora = new Date(item.criadoEm).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
        setMessages((prev) => [
          ...prev,
          {
            id: item.id,
            text: item.texto,
            time: hora,
            sender: "me",
          },
        ]);
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === activeChatId ? { ...chat, lastMessage: item.texto, timeOrDate: hora } : chat
          )
        );
      })
      .catch(() => setInputMessage(texto));
  };

  const abrirConversa = (id: string) => {
    setActiveChatId(id);
    setMostrarLista(false);
  };

  const iniciais = (nome: string) =>
    nome
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="flex h-screen flex-col bg-[#f4f4f6] font-sans">
      <AppHeader activePage="chat" />

      <div className="mx-auto flex w-full max-w-[1200px] flex-1 gap-4 overflow-hidden p-4">
        <aside
          className={cn(
            "flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm md:w-[360px]",
            !mostrarLista && "hidden md:flex"
          )}
        >
          <div className="border-b px-4 py-4">
            <h1 className="text-lg font-bold text-[#1F3A66]">Mensagens</h1>
            <p className="text-xs text-muted-foreground">Combine detalhes do passeio com o guia</p>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar conversas..."
              className="mt-3 h-10 w-full rounded-full border border-border bg-[#f4f4f6] px-4 text-sm outline-none focus:ring-2 focus:ring-[#F27420]"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {carregandoLista &&
              [0, 1, 2].map((item) => (
                <div key={item} className="mx-3 my-2 h-20 animate-pulse rounded-xl bg-muted" />
              ))}

            {!carregandoLista &&
              filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => abrirConversa(chat.id)}
                  className={cn(
                    "flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-[#F27420]/5",
                    activeChatId === chat.id && "bg-[#F27420]/10"
                  )}
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                    {chat.imageUrl ? (
                      <img src={chat.imageUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center bg-[#1F3A66]/10 text-xs font-bold text-[#1F3A66]">
                        {iniciais(chat.guideName)}
                      </span>
                    )}
                    <span
                      className={cn(
                        "absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full border-2 border-white",
                        chat.status === "online" ? "bg-green-500" : "bg-gray-300"
                      )}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="truncate text-sm font-bold text-[#1F3A66]">{chat.guideName}</h4>
                      <span className="shrink-0 text-[10px] text-muted-foreground">{chat.timeOrDate}</span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{chat.tourName}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{chat.lastMessage}</p>
                  </div>
                </button>
              ))}

            {!carregandoLista && filteredChats.length === 0 && (
              <div className="px-6 py-16 text-center">
                <MessageCircle className="mx-auto mb-3 h-8 w-8 text-[#F27420]" />
                <p className="font-bold text-[#1F3A66]">
                  {searchQuery ? "Nenhuma conversa encontrada" : "Nenhuma conversa ainda"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchQuery
                    ? "Tente outro nome de guia ou roteiro."
                    : "Quando você reservar um passeio, o chat com o guia aparece aqui."}
                </p>
              </div>
            )}
          </div>
        </aside>

        <main
          className={cn(
            "flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm",
            mostrarLista ? "hidden md:flex" : "flex"
          )}
        >
          {activeChat ? (
            <>
              <div className="flex items-center gap-3 border-b px-4 py-3 md:px-6">
                <button
                  type="button"
                  onClick={() => setMostrarLista(true)}
                  className="rounded-full p-1.5 text-[#1F3A66] hover:bg-muted md:hidden"
                  aria-label="Voltar para as conversas"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[#1F3A66]/10 text-sm font-bold text-[#1F3A66]">
                  {iniciais(activeChat.guideName)}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-bold text-[#1F3A66]">{activeChat.guideName}</h3>
                  <p className="truncate text-xs text-muted-foreground">
                    {activeChat.tourName} · {activeChat.status === "online" ? "online agora" : "offline"}
                  </p>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-[#f4f4f6] p-4 md:p-6">
                {messages.length === 0 && (
                  <div className="m-auto max-w-xs rounded-2xl bg-white px-5 py-8 text-center shadow-sm">
                    <p className="font-bold text-[#1F3A66]">Comece a conversa</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Combine horário, ponto de encontro e dúvidas do passeio.
                    </p>
                  </div>
                )}
                {messages.map((msg) => {
                  const isMe = msg.sender === "me";
                  return (
                    <div
                      key={msg.id}
                      className={cn("flex max-w-[75%] flex-col", isMe ? "self-end items-end" : "self-start items-start")}
                    >
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                          isMe
                            ? "rounded-br-md bg-[#F27420] text-white"
                            : "rounded-bl-md bg-white text-[#1F3A66]"
                        )}
                      >
                        {msg.text}
                      </div>
                      <span className="mt-1 px-1 text-[10px] text-muted-foreground">{msg.time}</span>
                    </div>
                  );
                })}
                <div ref={fimDasMensagens} />
              </div>

              <form onSubmit={handleSendMessage} className="flex items-center gap-3 border-t bg-white px-4 py-3 md:px-6">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Escreva uma mensagem..."
                  className="h-11 rounded-full border-border bg-[#f4f4f6]"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F27420] text-white transition-colors hover:bg-[#d65f15] disabled:opacity-40"
                  aria-label="Enviar mensagem"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F27420]/10 text-[#F27420]">
                <MessageCircle className="h-7 w-7" />
              </div>
              <p className="font-bold text-[#1F3A66]">Selecione uma conversa</p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Suas mensagens com guias e turistas aparecem ao lado.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
