"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { listarLocalizacoes } from "@/services/dominio";

interface LocalizacaoSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  /** Texto da opção sem filtro. */
  placeholder?: string;
}

export default function LocalizacaoSelect({
  value,
  onChange,
  className,
  placeholder = "Todas as localizações",
}: LocalizacaoSelectProps) {
  const [locais, setLocais] = useState<string[]>([]);

  useEffect(() => {
    listarLocalizacoes()
      .then((data) => setLocais(data.items))
      .catch(() => setLocais([]));
  }, []);

  // Mantém o valor vindo da URL visível mesmo que não esteja na lista.
  const opcoes = value && !locais.includes(value) ? [value, ...locais] : locais;

  return (
    <div className={cn("relative", className)}>
      <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F27420]" />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Filtrar por localização"
        className="h-12 w-full appearance-none rounded-full border border-border bg-white pl-9 pr-8 text-sm font-medium text-[#1F3A66] shadow-sm outline-none focus:ring-2 focus:ring-[#F27420]"
      >
        <option value="">{placeholder}</option>
        {opcoes.map((local) => (
          <option key={local} value={local}>
            {local}
          </option>
        ))}
      </select>
    </div>
  );
}
