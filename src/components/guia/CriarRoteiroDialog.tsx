"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getApiErrorMessage } from "@/services/auth";
import { criarRoteiroGuia, type CategoriaRoteiro } from "@/services/dominio";

interface CriarRoteiroDialogProps {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  onCriado: () => void;
}

const formVazio = {
  titulo: "",
  descricao: "",
  local: "",
  categoria: "cultural" as CategoriaRoteiro,
  preco: "",
  duracao: "",
  capacidade: "5",
  incluso: "",
};

export default function CriarRoteiroDialog({ aberto, onOpenChange, onCriado }: CriarRoteiroDialogProps) {
  const [form, setForm] = useState(formVazio);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const alterar = <K extends keyof typeof formVazio>(campo: K, valor: (typeof formVazio)[K]) =>
    setForm((atual) => ({ ...atual, [campo]: valor }));

  const fechar = (valor: boolean) => {
    if (!valor) {
      setForm(formVazio);
      setErro(null);
    }
    onOpenChange(valor);
  };

  const enviar = async (event: React.FormEvent) => {
    event.preventDefault();
    setErro(null);

    const preco = Number(form.preco.replace(",", "."));
    const capacidade = Number(form.capacidade);
    if (!Number.isFinite(preco) || preco <= 0) return setErro("Informe um preço maior que zero.");
    if (!Number.isInteger(capacidade) || capacidade < 1) return setErro("A capacidade mínima é 1 pessoa.");

    setSalvando(true);
    try {
      await criarRoteiroGuia({
        titulo: form.titulo.trim(),
        descricao: form.descricao.trim(),
        local: form.local.trim(),
        categoria: form.categoria,
        preco,
        duracao: form.duracao.trim(),
        capacidade,
        incluso: form.incluso
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      });
      fechar(false);
      onCriado();
    } catch (error) {
      setErro(getApiErrorMessage(error, "Não foi possível registrar o roteiro."));
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Dialog open={aberto} onOpenChange={fechar}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-[#1F3A66]">Registrar novo roteiro</DialogTitle>
          <DialogDescription>Os dados aparecem no catálogo assim que você salvar.</DialogDescription>
        </DialogHeader>

        <form onSubmit={enviar} className="space-y-4">
          {erro && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {erro}
            </p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="roteiro-titulo">Título</Label>
            <Input
              id="roteiro-titulo"
              value={form.titulo}
              onChange={(e) => alterar("titulo", e.target.value)}
              placeholder="Ex.: Bike tour pelo Eixo Monumental"
              required
              minLength={2}
              maxLength={160}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="roteiro-descricao">Descrição</Label>
            <Textarea
              id="roteiro-descricao"
              value={form.descricao}
              onChange={(e) => alterar("descricao", e.target.value)}
              rows={3}
              placeholder="Conte o que o turista vai viver no passeio"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="roteiro-local">Localização</Label>
              <Input
                id="roteiro-local"
                value={form.local}
                onChange={(e) => alterar("local", e.target.value)}
                placeholder="Brasília / DF"
                required
                maxLength={120}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="roteiro-categoria">Categoria</Label>
              <select
                id="roteiro-categoria"
                value={form.categoria}
                onChange={(e) => alterar("categoria", e.target.value as CategoriaRoteiro)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="lazer">Lazer</option>
                <option value="cultural">Cultural</option>
                <option value="rural">Rural</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="roteiro-preco">Preço por pessoa (R$)</Label>
              <Input
                id="roteiro-preco"
                inputMode="decimal"
                value={form.preco}
                onChange={(e) => alterar("preco", e.target.value)}
                placeholder="120,00"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="roteiro-duracao">Duração</Label>
              <Input
                id="roteiro-duracao"
                value={form.duracao}
                onChange={(e) => alterar("duracao", e.target.value)}
                placeholder="3 h"
                required
                maxLength={40}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="roteiro-capacidade">Capacidade (pessoas)</Label>
              <Input
                id="roteiro-capacidade"
                type="number"
                min={1}
                value={form.capacidade}
                onChange={(e) => alterar("capacidade", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="roteiro-incluso">O que está incluso (um item por linha, opcional)</Label>
            <Textarea
              id="roteiro-incluso"
              value={form.incluso}
              onChange={(e) => alterar("incluso", e.target.value)}
              rows={3}
              placeholder={"Água\nCapacete\nSeguro"}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => fechar(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={salvando} className="bg-[#F27420] font-bold hover:bg-[#d65f15]">
              {salvando ? "Salvando..." : "Registrar roteiro"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
