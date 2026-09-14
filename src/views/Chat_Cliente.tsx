"use client";

import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import AppHeader from "@/components/layout/AppHeader";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  time: string;
  sender: "me" | "other";
}

export default function ChatClienteScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Olá Marcelo, tudo bem?", time: "13:45", sender: "me" },
    { id: "2", text: "Olá Fabiana", time: "14:30", sender: "other" },
    { id: "3", text: "Tudo certo para o nosso tour amanhã?", time: "14:30", sender: "other" },
    { id: "4", text: "Te espero lá!", time: "14:30", sender: "other" },
    { id: "5", text: "Tudo certo! Ansiosa", time: "14:30", sender: "me" },
  ]);

  const [inputMessage, setInputMessage] = useState("");

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

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-hidden p-4">
        <main className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-bold">
                MO
              </div>
              <div>
                <h3 className="text-sm font-bold">Marcelo Oliveira</h3>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-xs text-muted-foreground">online</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex items-center gap-1.5 text-sm font-bold text-[#1F3A66] transition-colors hover:text-[#F27420]"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-4 overflow-y-auto bg-muted/30 p-8">
            <div className="my-2 text-center text-xs font-medium text-muted-foreground">Hoje</div>
            {messages.map((msg) => {
              const isMe = msg.sender === "me";
              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex max-w-[65%] flex-col",
                    isMe ? "self-end items-end" : "self-start items-start"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-5 py-3 text-sm font-medium leading-relaxed shadow-sm",
                      isMe
                        ? "rounded-br-sm bg-[#F27420] text-white"
                        : "rounded-bl-sm bg-white text-foreground"
                    )}
                  >
                    {msg.text}
                  </div>
                  <div className="mt-1 flex items-center gap-1 px-1 text-[10px] text-muted-foreground">
                    <span>{msg.time}</span>
                    {isMe && <span className="font-bold text-green-500">✓✓</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSendMessage} className="flex items-center gap-3 border-t px-6 py-4">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="border-0 shadow-none focus-visible:ring-0"
            />
            <button
              type="submit"
              className="rounded-full p-2 text-muted-foreground transition-colors hover:text-[#F27420]"
              aria-label="Enviar"
            >
              <Send className="h-6 w-6 rotate-45" />
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
