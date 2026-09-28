# GoGuia — Rotas novas (agenda, cupom, perfil do guia, avisos, admin)

Contrato para o backend criar. Auth **não muda**. Base `http://localhost:3001`, header `Authorization: Bearer <jwt>`, CORS `http://localhost:8080`.

Erro: `{ "message": "...", "code": "OPCIONAL", "errors": { "campo": "..." } }`.

401 continua limpando a sessão no frontend. 403 é papel errado e **não** encerra a sessão.

Dinheiro em reais (`number`). Data `YYYY-MM-DD`. Horário `HH:mm`. Instant ISO-8601.

Papéis: `TURISTA`, `GUIA`, `ADMIN`. Rotas `/admin/*` exigem `ADMIN`. Rotas `/guia/*` exigem `GUIA`. Rotas `/turista/*` exigem `TURISTA`.

Usuários de teste (senha `Senha@123`):

- `turista@goguia.test` — TURISTA
- `guia@goguia.test` — GUIA já `APROVADO` (Pedro Marcos França, dono do Bike Tour)
- `admin@goguia.test` — ADMIN

Guia que se cadastra agora nasce com `statusAprovacao = PENDENTE`. O seed `guia@` permanece aprovado para não quebrar a coleção atual.

---

## 1. Agenda e vagas

O guia define em quais dias e horários o roteiro acontece. O turista só reserva um horário com vaga. `capacidade` do roteiro é o teto de pessoas **naquele horário**.

`diasSemana`: `0` domingo … `6` sábado.

### GET /guia/roteiros/:id/agenda

Auth GUIA, dono do roteiro. `404` se o roteiro não for dele.

`200`:

```json
{
  "diasSemana": [1, 2, 3, 4, 5],
  "horarios": ["09:00", "14:00"],
  "datasBloqueadas": ["2026-12-25"]
}
```

Roteiro sem agenda salva devolve o padrão: dias `1` a `5`, horário `["09:00"]`, `datasBloqueadas` vazio. Assim a reserva atual continua possível.

### PUT /guia/roteiros/:id/agenda

Auth GUIA dono. Body no mesmo formato. `200` devolve a agenda salva.

`400` se `horarios` não estiver em `HH:mm`, se `diasSemana` tiver número fora de 0–6, ou se a lista de horários vier vazia.

### GET /roteiros/:id/disponibilidade?data=YYYY-MM-DD

Público. `200`:

```json
{
  "data": "2026-12-17",
  "horarios": [
    { "horario": "09:00", "vagas": 8 }
  ]
}
```

Regras:

- Dia da semana fora de `diasSemana`, ou data em `datasBloqueadas`, ou data passada: `horarios: []`.
- `vagas` = `capacidade` menos a soma de `quantidade` das reservas daquele roteiro, data e horário com status `PENDENTE` ou `CONFIRMADA`.
- Horário com `vagas` 0 sai da lista.
- `404` se o roteiro não existe ou está inativo.

### POST /reservas

O body que o frontend já envia passa a ser validado de verdade: `data`, `horario`, `quantidade`.

`409` com `code`:

| code | Quando |
|------|--------|
| `DATA_INDISPONIVEL` | dia bloqueado, fora da semana ou data passada |
| `HORARIO_ESGOTADO` | horário inexistente na agenda ou `quantidade` maior que as vagas |
| `ROTEIRO_INATIVO` | já existia: roteiro inativo |

`quantidade` continua entre 1 e a capacidade. O frontend mostra a mensagem do `message`.

---

## 2. Cupom e cashback

A carteira do turista já devolve `cashback`, `creditosPromocionais` e `vouchers`. Cupom e cashback passam a alterar o total na hora do pagamento.

Cashback: quando uma reserva do turista vai para `CONCLUIDA`, somar `5%` do `total` pago (já com desconto) em `cashback`. Não soma de novo se a reserva já estava concluída.

`creditosPromocionais` e `vouchers` continuam `0` até existir outra regra. O frontend só gasta `cashback`.

### POST /admin/cupons

Auth ADMIN. `201`:

```json
{
  "id": "uuid",
  "codigo": "BEMVINDO10",
  "tipo": "PERCENTUAL",
  "valor": 10,
  "ativo": true,
  "expiraEm": null
}
```

Body: `codigo` (único, sem espaço, o backend grava em maiúsculas), `tipo` `PERCENTUAL` ou `VALOR`, `valor` > 0. Percentual máximo 100. `expiraEm` opcional (`YYYY-MM-DD`). `409` se o código já existe.

Seed: cupom `BEMVINDO10`, percentual `10`, ativo, sem expiração.

### GET /admin/cupons

Auth ADMIN. `200` `{ "items": [ ... ] }`, mais recente primeiro.

### POST /reservas/:id/cupom

Auth TURISTA dono da reserva. Só com a reserva em `AGUARDANDO_PAGAMENTO`.

```json
{ "codigo": "BEMVINDO10" }
```

`200`:

```json
{
  "codigo": "BEMVINDO10",
  "tipo": "PERCENTUAL",
  "valor": 10,
  "desconto": 36,
  "total": 324
}
```

`desconto` é o valor em reais tirado do `total` atual da reserva. `total` é o que resta. Percentual arredonda para 2 casas. Valor fixo não deixa o total negativo (desconto máximo = total).

`400` `CUPOM_INVALIDO` se o código não existe, está inativo ou expirou. `409` se a reserva não está aguardando pagamento.

### POST /reservas/:id/pagamento

O body ganha campos opcionais. O resto do PIX simulado e o `501` do cartão continuam iguais.

```json
{
  "metodo": "PIX",
  "codigoCupom": "BEMVINDO10",
  "usarCashback": true
}
```

Ordem do desconto: primeiro o cupom, depois o cashback, limitado ao que ainda resta. O cashback usado sai da carteira na hora. Se o pagamento expirar ou a reserva for recusada/cancelada com estorno, o cashback volta.

`200` acrescenta, além do PIX atual:

```json
{
  "desconto": 36,
  "cashbackAplicado": 20,
  "total": 304
}
```

`codigoCupom` inválido responde `400` `CUPOM_INVALIDO` e não cria o pagamento.

---

## 3. Perfil público do guia

### GET /guias/:id

Público. `404` se não for guia, não existir, ou `statusAprovacao` diferente de `APROVADO`.

`200`:

```json
{
  "id": "uuid",
  "nomeCompleto": "Pedro Marcos França",
  "fotoUrl": null,
  "bio": "Guia de Brasília.",
  "idiomas": ["português"],
  "cidade": "Brasília",
  "estado": "DF",
  "notaMedia": 5,
  "totalAvaliacoes": 2,
  "aprovado": true,
  "roteiros": []
}
```

`roteiros` usa o mesmo item de `GET /roteiros` e só inclui `ativo = true`. `notaMedia` e `totalAvaliacoes` agregam as avaliações dos roteiros desse guia. Sem avaliação: nota `0`, total `0`.

O frontend abre essa página em `/guias/:id` a partir do nome do guia no detalhe do roteiro.

### GET /guia/perfil

Auth GUIA. O mesmo objeto, mais `email`. Inclui o guia ainda pendente (`aprovado: false`) para ele editar o perfil antes da aprovação. `roteiros` inclui os dele, ativos e inativos.

### PUT /guia/perfil

Auth GUIA. Não altera nome, e-mail, tipo nem senha.

```json
{
  "bio": "Guia de Brasília.",
  "idiomas": ["português", "inglês"],
  "cidade": "Brasília",
  "estado": "DF"
}
```

`200` no formato do GET. `bio` até 500 caracteres. `idiomas` é `string[]`.

### POST /guia/perfil/foto

Auth GUIA. `multipart/form-data`, campo `foto` (jpg, png ou webp, até 5MB). `200` devolve o perfil com `fotoUrl` preenchida.

### POST /guia/roteiros

Se `statusAprovacao` não for `APROVADO`, responde `403` com `code` `GUIA_NAO_APROVADO`. O frontend esconde o botão de criar roteiro nesse caso.

---

## 4. Avisos

Sem websocket. O frontend consulta a cada 15 segundos. Só cria aviso para o usuário que precisa saber.

### GET /notificacoes

Auth de qualquer papel. `200`, mais recente primeiro:

```json
{
  "items": [
    {
      "id": "uuid",
      "tipo": "RESERVA_CONFIRMADA",
      "titulo": "Reserva confirmada",
      "texto": "Bike Tour do Eixo Monumental foi confirmado.",
      "lida": false,
      "criadoEm": "2026-09-28T14:30:00.000Z",
      "href": "/carteira"
    }
  ]
}
```

`tipo`: `PAGAMENTO_PAGO` | `RESERVA_CONFIRMADA` | `RESERVA_RECUSADA` | `RESERVA_CANCELADA` | `MENSAGEM`.

`href` é um caminho do frontend, ou `null`.

| Evento | Quem recebe | href |
|--------|-------------|------|
| Pagamento fica `PAGO` | turista da reserva | `/carteira` |
| Guia aceita | turista | `/carteira` |
| Guia recusa | turista | `/carteira` |
| Reserva vai para `PENDENTE` (pago) | guia do roteiro | `/gestao-agendamentos` |
| Reserva cancelada | o outro participante | `/carteira` ou `/gestao-agendamentos` |
| Mensagem nova | o outro participante da conversa | `/chat?id=<conversaId>` |

Não avisar o autor da própria ação.

### PATCH /notificacoes/:id/lida

Auth dono do aviso. `204`. `404` se o aviso for de outra pessoa.

---

## 5. Administração

### GET /admin/guias?status=PENDENTE

Auth ADMIN. `status` opcional: `PENDENTE`, `APROVADO` ou `RECUSADO`. Sem query, devolve todos.

`200`:

```json
{
  "items": [
    {
      "id": "uuid",
      "nomeCompleto": "Novo Guia",
      "email": "novo@goguia.test",
      "fotoUrl": null,
      "cidade": "",
      "criadoEm": "2026-09-28T14:30:00.000Z",
      "statusAprovacao": "PENDENTE"
    }
  ]
}
```

O painel chama com `status=PENDENTE`.

### POST /admin/guias/:id/aprovar

`200` `{ "id": "uuid", "statusAprovacao": "APROVADO" }`. `404` se não for guia.

### POST /admin/guias/:id/recusar

`200` `{ "id": "uuid", "statusAprovacao": "RECUSADO" }`. Roteiros desse guia ficam `ativo = false`.

### GET /admin/roteiros

`200`:

```json
{
  "items": [
    {
      "id": "uuid",
      "titulo": "Bike Tour do Eixo Monumental - Brasília",
      "ativo": true,
      "destaque": true,
      "denuncias": 0,
      "guia": { "id": "uuid", "nomeCompleto": "Pedro Marcos França" }
    }
  ]
}
```

Inclui inativos. `denuncias` é a contagem.

### PATCH /admin/roteiros/:id/destaque

`{ "destaque": true }` → `200` `{ "id", "destaque" }`. É o mesmo `destaque` de `GET /roteiros?destaque=true`.

### PATCH /admin/roteiros/:id/ativo

`{ "ativo": false }` → `200` `{ "id", "ativo" }`. Inativo some do catálogo público.

### POST /roteiros/:id/denuncias

Auth TURISTA ou GUIA.

```json
{ "motivo": "Descrição não corresponde ao passeio" }
```

`201` `{ "id": "uuid" }`. `motivo` de 5 a 500 caracteres, com trim. `404` roteiro inexistente.

### GET /admin/denuncias

`200`, mais recente primeiro:

```json
{
  "items": [
    {
      "id": "uuid",
      "roteiroId": "uuid",
      "roteiro": "Bike Tour do Eixo Monumental - Brasília",
      "motivo": "...",
      "autor": "Turista Teste",
      "criadoEm": "2026-09-28T14:30:00.000Z"
    }
  ]
}
```

### GET /admin/saques

`200` `{ "items": [ ... ] }`, mais recente primeiro. Cada item é o saque do guia mais o guia:

```json
{
  "id": "uuid",
  "valor": 100,
  "metodo": "PIX",
  "status": "PENDENTE",
  "criadoEm": "2026-09-28T14:30:00.000Z",
  "guia": { "id": "uuid", "nomeCompleto": "Pedro Marcos França" }
}
```

### PATCH /admin/saques/:id

`{ "status": "PROCESSANDO" }` ou `{ "status": "CONCLUIDO" }`. `200` devolve o saque.

Só avança: `PENDENTE` → `PROCESSANDO` → `CONCLUIDO`. `409` `STATUS_INVALIDO` se o status pedido for um retrocesso ou um pulo. `400` se o status não for um desses três. `CONCLUIDO` não desconta de novo: o saque já sai de `saldoDisponivel` quando o guia solicita, nos status `PENDENTE`, `PROCESSANDO` e `CONCLUIDO`.

---

## O que o frontend já chama

| Tela | Rotas |
|------|--------|
| Reserva do turista | `GET /roteiros/:id/disponibilidade`, `POST /reservas` com horário e quantidade |
| Agenda em Meus roteiros | `GET` e `PUT /guia/roteiros/:id/agenda` |
| Pagamento | `POST /reservas/:id/cupom`, `POST /reservas/:id/pagamento` com `codigoCupom` e `usarCashback` |
| Nome do guia no detalhe | `GET /guias/:id` |
| Configurações do guia | `GET` e `PUT /guia/perfil`, `POST /guia/perfil/foto` |
| Sino do header | `GET /notificacoes`, `PATCH /notificacoes/:id/lida` |
| Denunciar no detalhe | `POST /roteiros/:id/denuncias` |
| `/admin` | guias, roteiros, saques, denúncias e cupons |

Enquanto `GET /roteiros/:id/disponibilidade` responder `404`, a tela de reserva deixa o turista informar horário e quantidade à mão. Com a rota no ar, ela lista só os horários com vaga.
