# GoGuia — Spec de Backend: Login e Cadastro

Documento para o time de BE implementar a autenticação usada pelo frontend (Next.js).

---

## Contexto do frontend

- SPA Next.js consome API REST via `fetch` com `Authorization: Bearer <token>`.
- Token e usuário ficam no `localStorage` (`token`, `user`).
- Em **401**, o FE limpa a sessão e redireciona para login.
- Base URL: variável de ambiente `NEXT_PUBLIC_API_URL` (ex.: `http://localhost:3001`).

Telas envolvidas:
| Tela | Rota FE | Precisa de API |
|------|---------|----------------|
| Login + Cadastro | `/login` | Sim (prioridade) |
| Esqueci senha | `/esqueci-senha` | Sim (fase 2 OK) |
| Confirmação de e-mail | `/confirmacao-email` | Sim (fase 2 OK) |
| Configurações / perfil | `/configuracoes` | Depois do auth |

---

## 1. Modelo de usuário (mínimo)

```json
{
  "id": "uuid",
  "nomeCompleto": "string",
  "email": "string",
  "fotoUrl": "string | null",
  "tipo": "TURISTA | GUIA",
  "emailConfirmado": true,
  "criadoEm": "ISO-8601",
  "atualizadoEm": "ISO-8601"
}
```

### Regras
- E-mail único (case-insensitive).
- Senha com hash (bcrypt/argon2) — **nunca** retornar senha.
- Foto opcional no cadastro.
- `tipo` pode ser fixo `TURISTA` no MVP se ainda não houver escolha na UI.

---

## 2. Endpoints — prioridade alta (MVP)

### 2.1 Cadastro

`POST /auth/cadastro`

**Content-Type:** `multipart/form-data` (por causa da foto) **ou** JSON + upload separado.

#### Opção A — multipart (preferida, bate com a UI)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `nomeCompleto` | string | sim | Nome completo |
| `email` | string | sim | E-mail válido |
| `senha` | string | sim | Mín. 8 caracteres |
| `foto` | file (image) | não | JPG/PNG/WEBP, máx. 5MB |
| `tipo` | string | não | `TURISTA` (default) ou `GUIA` |

#### Opção B — JSON + upload depois

`POST /auth/cadastro` (JSON) + `POST /usuario/foto` (multipart).

#### Request (JSON, se opção B)

```json
{
  "nomeCompleto": "Maria Silva",
  "email": "maria@email.com",
  "senha": "Senha@123",
  "tipo": "TURISTA"
}
```

#### Response `201 Created`

```json
{
  "token": "jwt...",
  "expiresIn": 86400,
  "user": {
    "id": "uuid",
    "nomeCompleto": "Maria Silva",
    "email": "maria@email.com",
    "fotoUrl": "https://cdn.../foto.jpg",
    "tipo": "TURISTA",
    "emailConfirmado": false
  }
}
```

> Se o produto exigir confirmação de e-mail antes de logar, retornar `201` **sem** `token` e mensagem pedindo verificação. Alinhar com o FE.

#### Erros

| Status | Quando | Body sugerido |
|--------|--------|---------------|
| `400` | Validação (senha fraca, e-mail inválido) | `{ "message": "...", "errors": { "campo": "..." } }` |
| `409` | E-mail já cadastrado | `{ "message": "E-mail já cadastrado" }` |
| `413` | Foto muito grande | `{ "message": "Arquivo excede o limite" }` |
| `415` | Tipo de arquivo inválido | `{ "message": "Formato de imagem não suportado" }` |

---

### 2.2 Login

`POST /auth/login`

**Content-Type:** `application/json`

#### Request

```json
{
  "email": "maria@email.com",
  "senha": "Senha@123"
}
```

#### Response `200 OK`

```json
{
  "token": "jwt...",
  "expiresIn": 86400,
  "user": {
    "id": "uuid",
    "nomeCompleto": "Maria Silva",
    "email": "maria@email.com",
    "fotoUrl": "https://cdn.../foto.jpg",
    "tipo": "TURISTA",
    "emailConfirmado": true
  }
}
```

#### Erros

| Status | Quando | Body sugerido |
|--------|--------|---------------|
| `400` | Campos faltando / inválidos | `{ "message": "Dados inválidos" }` |
| `401` | E-mail ou senha incorretos | `{ "message": "Credenciais inválidas" }` |
| `403` | E-mail não confirmado (se aplicável) | `{ "message": "Confirme seu e-mail antes de entrar" }` |

**Importante:** não diferenciar “e-mail inexistente” vs “senha errada” (segurança).

---

### 2.3 Me / sessão atual

`GET /auth/me`  
**Auth:** `Authorization: Bearer <token>`

#### Response `200 OK`

```json
{
  "id": "uuid",
  "nomeCompleto": "Maria Silva",
  "email": "maria@email.com",
  "fotoUrl": "https://cdn.../foto.jpg",
  "tipo": "TURISTA",
  "emailConfirmado": true
}
```

#### Erros

| Status | Quando |
|--------|--------|
| `401` | Token ausente, inválido ou expirado |

---

### 2.4 Logout (opcional no MVP)

`POST /auth/logout`  
**Auth:** Bearer

- Se JWT stateless: pode só documentar logout client-side.
- Se houver blacklist/refresh: invalidar no servidor e responder `204`.

---

## 3. Endpoints — fase 2 (já existem telas no FE)

### 3.1 Esqueci senha

`POST /auth/esqueci-senha`

```json
{ "email": "maria@email.com" }
```

#### Response `200 OK` (sempre, mesmo se e-mail não existir)

```json
{
  "message": "Se o e-mail existir, enviaremos instruções para redefinir a senha"
}
```

- Enviar e-mail com link/token (TTL curto, ex.: 1h).
- Link pode apontar para FE: `https://app.../redefinir-senha?token=...` (tela ainda a criar) **ou** página do BE.

---

### 3.2 Redefinir senha

`POST /auth/redefinir-senha`

```json
{
  "token": "token-do-email",
  "novaSenha": "NovaSenha@123"
}
```

| Status | Quando |
|--------|--------|
| `200` | Senha alterada |
| `400` | Token inválido/expirado ou senha fraca |

---

### 3.3 Confirmar e-mail

`GET /auth/confirmar-email?token=...`  
ou  
`POST /auth/confirmar-email` com `{ "token": "..." }`

| Status | Quando |
|--------|--------|
| `200` | E-mail confirmado → FE mostra `/confirmacao-email` |
| `400` | Token inválido/expirado |

---

## 4. Contrato de autenticação

### Header

```http
Authorization: Bearer <jwt>
```

### JWT (sugestão de claims)

```json
{
  "sub": "user-uuid",
  "email": "maria@email.com",
  "tipo": "TURISTA",
  "iat": 0,
  "exp": 0
}
```

- Access token: 24h (ou 1h + refresh, se preferirem).
- CORS liberado para origem do FE (`http://localhost:8080` em dev).
- `credentials: include` é usado no FE; se não usarem cookie, ok — o principal é o Bearer.

### Formato de erro padronizado

```json
{
  "message": "Mensagem legível para o usuário",
  "code": "EMAIL_ALREADY_EXISTS",
  "errors": {
    "email": "E-mail já cadastrado"
  }
}
```

---

## 5. Validações esperadas

| Campo | Regra |
|-------|--------|
| `nomeCompleto` | 2–120 chars, trim |
| `email` | formato válido, único, lowercase no banco |
| `senha` | mín. 8 chars; ideal: 1 letra + 1 número |
| `foto` | image/jpeg, image/png, image/webp; máx. 5MB |

---

## 6. O que o FE vai fazer com a response

Após login/cadastro com sucesso:

1. `localStorage.setItem('token', data.token)`
2. `localStorage.setItem('user', JSON.stringify(data.user))`
3. Redirecionar para `/home`

Todas as demais requests autenticadas enviam o Bearer automaticamente.

---

## 7. Checklist para o BE entregar

- [ ] `POST /auth/cadastro` (com ou sem foto)
- [ ] `POST /auth/login`
- [ ] `GET /auth/me`
- [ ] JWT Bearer funcionando
- [ ] CORS para o FE
- [ ] Erros no formato acordado
- [ ] Seed/usuário de teste (e-mail + senha)
- [ ] URL base de staging/dev documentada
- [ ] (Fase 2) esqueci senha + confirmar e-mail + redefinir senha

---

## 8. Dados de teste pedidos

Entregar ao FE:

| E-mail | Senha | Tipo |
|--------|-------|------|
| `turista@goguia.test` | `Senha@123` | TURISTA |
| `guia@goguia.test` | `Senha@123` | GUIA |

---

## 9. Dúvidas abertas (alinhar antes de codar)

1. Cadastro loga automaticamente ou exige confirmação de e-mail primeiro?
2. Foto no cadastro: multipart no mesmo endpoint ou upload separado?
3. Haverá papel `GUIA` no cadastro já no MVP?
4. Access token só, ou access + refresh?
5. Onde a foto será armazenada (S3, Cloudinary, disco local em dev)?

---

## Contato / entrega

Quando estiver pronto, enviar:
1. Base URL
2. Coleção Postman/Insomnia ou OpenAPI
3. Usuários de teste
4. Qualquer divergência deste contrato
