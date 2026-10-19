import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function rotuloNota(nota: number) {
  if (nota >= 4.5) return "Excelente";
  if (nota >= 3.5) return "Muito bom";
  if (nota >= 2.5) return "Razoável";
  if (nota >= 1.5) return "Ruim";
  if (nota > 0) return "Horrível";
  return "Sem avaliações";
}

/** "4,8 (12)" ou "Novo" quando ainda não há avaliações. */
export function textoNota(nota: number, total: number) {
  if (total <= 0) return "Novo";
  return `${nota.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} (${total})`;
}

interface EstrelasProps {
  nota: number;
  className?: string;
  tamanho?: string;
}

/** Cinco estrelas, com preenchimento proporcional à nota (ex.: 4,5 = quatro e meia). */
export function Estrelas({ nota, className, tamanho = "h-4 w-4" }: EstrelasProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={`Nota ${nota} de 5`}
    >
      {[1, 2, 3, 4, 5].map((posicao) => {
        const preenchimento = Math.max(0, Math.min(1, nota - (posicao - 1)));
        return (
          <span key={posicao} className={cn("relative inline-block", tamanho)}>
            <Star className={cn("absolute inset-0 text-gray-300", tamanho)} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${preenchimento * 100}%` }}>
              <Star className={cn("fill-[#F27420] text-[#F27420]", tamanho)} />
            </span>
          </span>
        );
      })}
    </span>
  );
}
