# GoGuia — Spec de Backend: domínio (pós-auth)

Contrato para o time de BE implementar o que o frontend Next.js ainda consome como dado fixo.

Auth **não muda**. Continua o contrato de [SPEC_AUTH_BACKEND.md](./SPEC_AUTH_BACKEND.md):

- Base URL: `NEXT_PUBLIC_API_URL` (dev: `http://localhost:3001`)
- `Authorization: Bearer <jwt>`
- CORS para `http://localhost:8080`
- 401 limpa a sessão no FE e redireciona para `/login`
- Erro: `{ "message": "...", "code": "OPCIONAL", "errors": { "campo": "..." } }`
- Usuários de teste: `turista@goguia.test` e `guia@goguia.test` / `Senha@123`

Valores monetários são `number` em reais com 2 casas (`180.00`), nunca centavos. Datas de calendário são `YYYY-MM-DD`. Horários são `HH:mm` (24h, America/Sao_Paulo). Instants são ISO-8601. IDs são UUID.

Rotas públicas: `GET /roteiros` e `GET /roteiros/:id` e `GET /roteiros/:id/avaliacoes`. O restante exige usuário autenticado. Rotas `/guia/*` exigem `tipo = GUIA` (403 caso contrário). Rotas `/turista/*` exigem `tipo = TURISTA`.

---

## Modelo Roteiro

Passeio, tour e roteiro são a mesma entidade.

```json
{
  "id": "uuid",
  "titulo": "Bike Tour do Eixo Monumental - Brasília",
  "descricao": "texto longo",
  "categoria": "cultural",
  "local": "Brasília / DF",
  "distancia": "15 Km",
  "duracao": "3 h",
  "preco": 180.0,
  "capacidade": 10,
  "imageUrl": "https://...",
  "ativo": true,
  "destaque": true,
  "idioma": "português",
  "incluso": ["Guia credenciado"],
  "politicaCancelamento": ["Cancelamentos com até 24h de antecedência: reembolso total"],
  "notaMedia": 4.9,
  "totalAvaliacoes": 427,
  "guia": {
    "id": "uuid",
    "nomeCompleto": "Pedro Marcos França",
    "fotoUrl": null,
    "notaMedia": 5.0
  },
  "paradas": [
    { "nome": "Partida", "lat": -15.7975, "lng": -47.8825 }
  ]
}
```

`categoria`: `lazer` | `cultural` | `rural`.

O mapa no FE chama o OSRM no browser. O BE só devolve `paradas` (lng/lat). Não implementar roteamento.

---

## Fase 1 — catálogo, favoritos e perfil

### GET /roteiros

Público. Query:

| Param | Obrigatório | Descrição |
|-------|-------------|-----------|
| `q` | não | Busca em `titulo` e `local`, case-insensitive |
| `categoria` | não | `lazer`, `cultural` ou `rural`. Ausente = todas |
| `destaque` | não | `true` devolve só os marcados para a home |

Response `200`:

```json
{
  "items": [ { "id": "uuid", "titulo": "...", "descricao": "...", "categoria": "cultural", "local": "Brasília / DF", "distancia": "15 Km", "duracao": "3 h", "preco": 180, "imageUrl": "https://...", "notaMedia": 4.9, "guia": { "id": "uuid", "nomeCompleto": "Pedro Marcos França", "fotoUrl": null, "notaMedia": 5 } } ]
}
```

Só roteiros `ativo = true`. Ordenação: destaque primeiro, depois `notaMedia` desc.

### GET /roteiros/:id

Público. `200` com o objeto Roteiro completo. `404` se não existir ou estiver inativo (dono guia continua vendo o seu via `/guia/roteiros/:id`).

### GET /roteiros/:id/avaliacoes

Público. `200`:

```json
{
  "notaMedia": 5.0,
  "total": 427,
  "distribuicao": [
    { "label": "Excelente", "quantidade": 92 },
    { "label": "Muito bom", "quantidade": 18 },
    { "label": "Razoável", "quantidade": 4 },
    { "label": "Ruim", "quantidade": 10 },
    { "label": "Horrível", "quantidade": 2 }
  ],
  "comentarios": [
    {
      "id": "uuid",
      "autor": "Anthony C",
      "texto": "Excursão fantástica.",
      "nota": 5,
      "criadoEm": "2026-03-01T12:00:00.000Z"
    }
  ]
}
```

`label` é fixo nessa ordem. `quantidade` é contagem absoluta (o FE desenha a barra). Comentários mais recentes primeiro. Sem avaliações: arrays vazios, `notaMedia` 0, `total` 0.

Criar avaliação fica fora desta fase (não há formulário no FE).

### GET /turista/favoritos

Auth TURISTA. `200`:

```json
{
  "items": [
    {
      "roteiroId": "uuid",
      "titulo": "Panteão Pátria Liberdade",
      "descricao": "...",
      "imageUrl": "https://..."
    }
  ]
}
```

### POST /turista/favoritos

```json
{ "roteiroId": "uuid" }
```

`201` com o item. `409` se já favoritado. `404` se o roteiro não existe ou está inativo.

### DELETE /turista/favoritos/:roteiroId

`204` mesmo se já não estava na lista.

### GET /usuario/perfil

Auth. Complementa `/auth/me` com endereço. `200`:

```json
{
  "id": "uuid",
  "nomeCompleto": "Maria Silva",
  "email": "maria@email.com",
  "fotoUrl": null,
  "tipo": "TURISTA",
  "telefone": "",
  "endereco": "",
  "cidade": "",
  "estado": "",
  "cep": ""
}
```

### PUT /usuario/perfil

Auth. Não altera senha nem `tipo`.

```json
{
  "nomeCompleto": "Maria Silva",
  "email": "maria@email.com",
  "telefone": "61999999999",
  "endereco": "SQN 100",
  "cidade": "Brasília",
  "estado": "DF",
  "cep": "70000-000"
}
```

`200` devolve o mesmo formato do GET. `409` se o e-mail pertence a outro usuário. E-mail alterado volta `emailConfirmado` para `false` (não bloqueia a sessão).

### PUT /usuario/senha

Auth. Troca de senha logado (a tela Configurações). Recuperação por e-mail continua em `/auth/redefinir-senha`.

```json
{ "senhaAtual": "Senha@123", "novaSenha": "NovaSenha@123" }
```

`204`. `400` senha fraca (mín. 8). `401` senha atual incorreta — **não** derrubar a sessão neste caso; o body traz `message`. O FE só redireciona em 401 quando o token é inválido. Se o BE usar 401 aqui, enviar header `X-Auth-Error: password` não é necessário: preferir `400` com `{ "message": "Senha atual incorreta", "code": "SENHA_ATUAL_INVALIDA" }` para não encerrar a sessão.

### DELETE /usuario/conta

Auth. `204`. Invalida o token. Reservas futuras do turista vão para `CANCELADA`. Roteiros do guia ficam `ativo = false`.

### Seed da fase 1

Seis roteiros ativos, pelo menos dois com `destaque: true`, guias distintos (podem ser usuários seed além de `guia@goguia.test`):

| titulo | local | guia | preco | duracao | distancia | categoria |
|--------|-------|------|-------|---------|-----------|-----------|
| Bike Tour do Eixo Monumental - Brasília | Brasília / DF | Pedro Marcos França | 180 | 3 h | 15 Km | cultural |
| Um Dia no Rio - City Tour Completo | Rio de Janeiro / RJ | Carlos Alberto Lima | 300 | 8 h | 45 Km | lazer |
| Excursão de Dia Inteiro a Angra dos Reis e Ilha Grande | Angra dos Reis / RJ | Mariana Costa Reis | 250 | 10 h | 120 Km | lazer |
| Passeio a Pé pela Avenida Paulista | São Paulo / SP | Fernanda Souza | 90 | 2 h | 4 Km | cultural |
| Centro Hípico Lago Sul - Brasília | Brasília / DF | Ricardo Silveira | 150 | 2 h | 8 Km | rural |
| Fazenda Azul | Planaltina / DF | Antônio Bezerra | 120 | 5 h | 12 Km | rural |

`imageUrl` pública (URL absoluta). Um roteiro com 2 comentários de exemplo para a tela de avaliações.

---

## Fase 2 — reserva do turista e PIX simulado

Não integrar adquirente. Cartão fica de fora (`501`).

### Status da reserva

Um único enum. O FE deixa de usar "Marcado", "Pago" e "Concluido" soltos.

| Status | Significado |
|--------|-------------|
| `AGUARDANDO_PAGAMENTO` | criada, PIX ainda não pago |
| `PENDENTE` | paga, esperando o guia aceitar |
| `CONFIRMADA` | guia aceitou |
| `RECUSADA` | guia recusou |
| `CONCLUIDA` | passeio realizado |
| `CANCELADA` | cancelada pelo turista, pelo guia ou por expiração do PIX |

### POST /reservas

Auth TURISTA.

```json
{
  "roteiroId": "uuid",
  "data": "2026-02-17",
  "horario": "12:30",
  "quantidade": 5
}
```

Regras:

- `quantidade` entre 1 e `capacidade`
- `data` não pode ser passada
- roteiro `ativo`
- status inicial `AGUARDANDO_PAGAMENTO`
- `extras` começa em `0` nesta fase (a UI mostra a linha; o BE pode devolver 0)

`201`:

```json
{
  "id": "uuid",
  "status": "AGUARDANDO_PAGAMENTO",
  "data": "2026-02-17",
  "horario": "12:30",
  "quantidade": 5,
  "precoUnitario": 180,
  "extras": 0,
  "total": 900,
  "roteiro": { "id": "uuid", "titulo": "...", "descricao": "...", "imageUrl": "https://...", "local": "Brasília / DF" },
  "guia": { "id": "uuid", "nomeCompleto": "Pedro Marcos França" }
}
```

`total = precoUnitario * quantidade + extras`.

`400` quantidade inválida ou data passada. `404` roteiro inexistente. `409` roteiro inativo.

### GET /reservas/:id

Auth. Turista dono ou guia do roteiro. `200` no formato acima, mais `incluso` e `politicaCancelamento` copiados do roteiro. `403` se não for participante. `404` se não existir.

### GET /turista/reservas

Auth TURISTA. Query `status` opcional (um dos enums). `200`:

```json
{
  "items": [
    {
      "id": "uuid",
      "roteiro": "City Tour Brasília",
      "data": "2026-06-20",
      "horario": "09:00",
      "quantidade": 2,
      "status": "CONFIRMADA",
      "total": 360
    }
  ]
}
```

Ordenar por `data` + `horario` crescente.

### POST /reservas/:id/pagamento

Auth TURISTA dono. Body:

```json
{ "metodo": "PIX" }
```

Só enquanto `AGUARDANDO_PAGAMENTO`.

`200` PIX simulado (sem banco):

```json
{
  "metodo": "PIX",
  "status": "PENDENTE",
  "qrCode": "data:image/png;base64,...",
  "copiaECola": "00020126...",
  "expiraEm": "2026-09-28T14:30:00.000Z"
}
```

`qrCode` pode ser data-URI ou URL. `copiaECola` é string opaca. TTL sugerido: 30 minutos.

`metodo: "CARTAO"` responde `501` com `{ "message": "Cartão indisponível no momento", "code": "CARTAO_INDISPONIVEL" }`.

`409` se a reserva não está `AGUARDANDO_PAGAMENTO`.

Simulação de confirmação: um job ou a própria consulta abaixo, após o primeiro `GET` feito **depois** de `expiraEm - 25min` (ou seja, ~5s em dev se `PIX_SIMULADO_PAGO_EM_SEGUNDOS=5`), muda o pagamento para `PAGO` e a reserva para `PENDENTE`. Se passar `expiraEm` sem pagamento, pagamento `EXPIRADO` e reserva `CANCELADA`.

Variável de ambiente sugerida: `PIX_SIMULADO_PAGO_EM_SEGUNDOS` (default `5` em dev, para o botão "Esperando pagamento" observar a mudança).

### GET /reservas/:id/pagamento

Auth TURISTA dono. `200`:

```json
{
  "metodo": "PIX",
  "status": "PENDENTE",
  "qrCode": "data:image/png;base64,...",
  "copiaECola": "00020126...",
  "expiraEm": "2026-09-28T14:30:00.000Z"
}
```

`status` do pagamento: `PENDENTE` | `PAGO` | `EXPIRADO`. `404` se ainda não houve `POST`.

---

## Fase 3 — painel do guia

Todas as rotas: auth e `tipo = GUIA`. O guia só enxerga os próprios roteiros e as reservas desses roteiros.

### GET /guia/roteiros

Query `q` opcional (título). Inclui inativos. `200`:

```json
{
  "items": [
    {
      "id": "uuid",
      "titulo": "Catedral da Fé",
      "descricao": "...",
      "duracao": "1h",
      "capacidade": 5,
      "preco": 300,
      "imageUrl": "https://...",
      "ativo": true,
      "categoria": "cultural",
      "local": "Brasília / DF"
    }
  ]
}
```

### POST /guia/roteiros

`multipart/form-data` (foto opcional) ou JSON sem foto.

| Campo | Obrigatório |
|-------|-------------|
| `titulo` | sim, 2–160 |
| `descricao` | sim |
| `duracao` | sim, ex. `1h` ou `1 h 30` |
| `capacidade` | sim, inteiro >= 1 |
| `preco` | sim, number > 0 |
| `categoria` | sim, `lazer` \| `cultural` \| `rural` |
| `local` | sim |
| `distancia` | não |
| `foto` | não, jpg/png/webp, máx. 5MB |
| `incluso` | não, string JSON array ou campos repetidos |
| `politicaCancelamento` | não, idem |
| `paradas` | não, JSON `[{ nome, lat, lng }]` |

`201` devolve o Roteiro. `guia` é o usuário autenticado. `ativo` default `true`.

### PUT /guia/roteiros/:id

Mesmos campos, todos opcionais (patch semântico no PUT: omitido = mantém). `200` objeto atualizado. `404` se não for do guia.

### PATCH /guia/roteiros/:id/ativo

```json
{ "ativo": false }
```

`200` `{ "id": "uuid", "ativo": false }`.

### GET /guia/reservas

Query `quando`:

- `proximas` (default): status `PENDENTE` ou `CONFIRMADA` e data >= hoje
- `historico`: `CONCLUIDA`, `CANCELADA`, `RECUSADA` ou data passada

`200`:

```json
{
  "items": [
    {
      "id": "uuid",
      "quando": "2026-05-27T16:30:00-03:00",
      "data": "2026-05-27",
      "horario": "16:30",
      "roteiro": "Catedral da Fé",
      "roteiroId": "uuid",
      "cliente": { "id": "uuid", "nomeCompleto": "João Silva", "fotoUrl": null },
      "quantidade": 3,
      "extras": 0,
      "total": 300,
      "status": "PENDENTE"
    }
  ]
}
```

O histórico do FE usa esse mesmo recurso. Não criar `/guia/historico`.

### GET /guia/reservas/:id

`200` com o item acima mais:

```json
{
  "local": "Praia Ipiranga",
  "endereco": "Rua das Flores, Avenida Paulista",
  "duracao": "1h 30",
  "capacidade": 10,
  "idioma": "português",
  "descricao": "...",
  "incluso": ["Guia credenciado", "Material informativo digital"],
  "politicaCancelamento": [
    "Cancelamentos com até 24h de antecedência: reembolso total",
    "Cancelamentos com menos de 24h: não há reembolso"
  ]
}
```

### POST /guia/reservas/:id/aceitar

Só de `PENDENTE` (já paga). `200` `{ "id": "uuid", "status": "CONFIRMADA" }`. `409` se o status não permitir.

### POST /guia/reservas/:id/recusar

De `PENDENTE` para `RECUSADA`. `200` `{ "id": "uuid", "status": "RECUSADA" }`. No MVP simulado, marcar o pagamento como estornado em memória (`estornado: true`) sem chamar banco.

### GET /guia/resumo-semana

Semana corrente (segunda a domingo, America/Sao_Paulo). Conta reservas `PENDENTE` + `CONFIRMADA`.

`200`:

```json
{
  "totalReservas": 3,
  "faturamentoPrevisto": 630
}
```

`faturamentoPrevisto` é a soma de `total` dessas reservas.

---

## Fase 4 — chat

REST. Sem websocket. Presença pode ser sempre `false`. O FE faz polling de mensagens (intervalo a cargo do FE, ex. 5s).

Conversa existe por reserva. Turista e guia da reserva são os dois participantes.

### POST /conversas

Auth participante da reserva.

```json
{ "reservaId": "uuid" }
```

`201` se criou, `200` se já existia (idempotente). Body:

```json
{
  "id": "uuid",
  "reservaId": "uuid",
  "roteiro": { "id": "uuid", "titulo": "Passeio Vinícola Brasília", "imageUrl": "https://..." },
  "outroUsuario": { "id": "uuid", "nomeCompleto": "Marcelo Oliveira", "fotoUrl": null, "online": false },
  "ultimaMensagem": null,
  "atualizadoEm": "2026-09-28T14:30:00.000Z"
}
```

`403` se o usuário não está na reserva. `404` reserva inexistente.

### GET /conversas

Auth. Lista das conversas do usuário, mais recente primeiro.

```json
{
  "items": [
    {
      "id": "uuid",
      "reservaId": "uuid",
      "roteiro": { "id": "uuid", "titulo": "...", "imageUrl": "https://..." },
      "outroUsuario": { "id": "uuid", "nomeCompleto": "Marcelo Oliveira", "fotoUrl": null, "online": false },
      "ultimaMensagem": { "texto": "Tudo certo!", "criadoEm": "2026-09-28T14:30:00.000Z", "minha": true },
      "atualizadoEm": "2026-09-28T14:30:00.000Z"
    }
  ]
}
```

`minha` é `true` quando o remetente é o usuário autenticado.

### GET /conversas/:id/mensagens

Auth participante. Query `depois` opcional (ISO) para polling incremental.

`200`:

```json
{
  "items": [
    {
      "id": "uuid",
      "texto": "Olá, tudo bem?",
      "criadoEm": "2026-09-28T13:45:00.000Z",
      "remetenteId": "uuid",
      "minha": true
    }
  ]
}
```

Ordem cronológica crescente. `404` conversa de outro usuário.

### POST /conversas/:id/mensagens

```json
{ "texto": "Te espero lá" }
```

`texto` 1–2000 caracteres, trim. `201` devolve a mensagem no formato acima. Atualiza `ultimaMensagem` e `atualizadoEm` da conversa.

---

## Fase 5 — carteiras

Depende da fase 2. Números podem ser calculados das reservas, sem ledger completo no MVP.

Taxa da plataforma sugerida: 10% do `total` da reserva, aplicada quando o status vira `CONCLUIDA`.

- Turista `pagamentosRealizados`: soma de `total` das reservas do turista com pagamento `PAGO` (status da reserva diferente de `AGUARDANDO_PAGAMENTO` e `CANCELADA` por PIX expirado).
- Guia `saldoPendente`: soma do líquido (`total - taxa`) das reservas `CONFIRMADA` ainda não concluídas.
- Guia `saldoDisponivel`: líquido de `CONCLUIDA` menos saques `PENDENTE` + `PROCESSANDO` + `CONCLUIDO`.
- `ganhosMes`: soma de `total` (bruto) das `CONCLUIDA` no mês corrente.
- `acumulado`: soma bruta histórica de `CONCLUIDA`.
- `taxasPlataforma` e `liquido`: do mês corrente.
- `proximoPagamento`: data ISO da próxima segunda-feira, ou `null`.

`creditosPromocionais`, `cashback` e `vouchers` existem na UI e podem voltar `0` / `[]` até haver regra de cupom. Não bloquear a fase por isso.

### GET /turista/carteira

Auth TURISTA. `200`:

```json
{
  "pagamentosRealizados": 1540,
  "creditosPromocionais": 0,
  "cashback": 0,
  "vouchers": 0
}
```

Próximas reservas continuam em `GET /turista/reservas`.

### GET /guia/carteira

Auth GUIA. `200`:

```json
{
  "saldoDisponivel": 1250,
  "saldoPendente": 450,
  "ganhosMes": 3200,
  "acumulado": 15400,
  "taxasPlataforma": 320,
  "liquido": 2880,
  "proximoPagamento": "2026-06-18"
}
```

### POST /guia/saques

```json
{ "valor": 500, "metodo": "PIX" }
```

`metodo`: `PIX` | `CONTA_BANCARIA`.

`201`:

```json
{
  "id": "uuid",
  "valor": 500,
  "metodo": "PIX",
  "status": "PENDENTE",
  "criadoEm": "2026-06-12T12:00:00.000Z"
}
```

`400` se `valor` <= 0 ou maior que `saldoDisponivel` (`code`: `SALDO_INSUFICIENTE`). Não exige chave PIX cadastrada no MVP: o saque fica `PENDENTE` e um processo manual (ou job dev) pode passar a `PROCESSANDO` e `CONCLUIDO`.

### GET /guia/saques

`200`, mais recente primeiro:

```json
{
  "items": [
    {
      "id": "uuid",
      "criadoEm": "2026-06-10T12:00:00.000Z",
      "valor": 850,
      "metodo": "PIX",
      "status": "CONCLUIDO"
    }
  ]
}
```

`status`: `PENDENTE` | `PROCESSANDO` | `CONCLUIDO`.

---

## Checklist de entrega

- [ ] Fase 1: listagem, detalhe, avaliações, favoritos, perfil, senha logada, encerrar conta, seed dos 6 roteiros
- [ ] Fase 2: criar reserva, detalhe, listagem do turista, PIX simulado com consulta de status, cartão 501
- [ ] Fase 3: CRUD e ativar/desativar roteiro, reservas do guia, aceitar/recusar, resumo da semana
- [ ] Fase 4: abrir conversa por reserva, listar, mensagens, envio
- [ ] Fase 5: carteiras e saque com saldo
- [ ] Coleção Postman atualizada e usuários de teste capazes de exercitar guia e turista
- [ ] Auth existente intacto

Fora de escopo: gateway de cartão, websocket, cupons, rota OSRM no servidor, criar avaliação pelo turista.
