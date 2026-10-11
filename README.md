# CS2 Market

Marketplace de conteúdo digital de Counter-Strike 2 (cursos, e-books e pacotes) com entrega por e-mail.
Trabalho da disciplina **Programação para Interface de Usuário (UNIJUÍ)**, Unidade 2: Desenvolvimento Web.

- **Front-end:** React 19 + Vite + React Router + React Hook Form + Zod + Axios
- **Back-end:** Node.js + Express 5 + TypeScript, organizado em camadas no estilo Spring Boot
- **Banco:** Postgres (Neon) via Drizzle ORM. Sem `DATABASE_URL`, usa repositórios em memória (retorno mockado)
- **Deploy:** Vercel (front estático + API serverless no mesmo domínio)

## Como rodar

```bash
npm install
cp .env.example .env   # opcional
npm run dev            # API em :3333 + front em :5173 (proxy /api)
npm test               # testes do back (unitários + integração)
```

## Arquitetura

```
Navegador (React)                         Vercel Function (Express)                     Dados
pages → hooks → api/*.js ──HTTP/JSON──▶  routes → middleware(validate) → controller  ──▶  repository
                                                            ↓                              ├─ Postgres (Neon / Drizzle)
            ◀──── JSON / ErrorResponse ── GlobalExceptionHandler ← service ← mapper        └─ Em memória
```

Separação de responsabilidades (Aula 3 · arquitetura de 3 camadas):

| Camada | Front (`web/src`) | Back (`server/`) |
|---|---|---|
| Apresentação | `pages/`, `components/`, `styles/` | `controller/`, `routes/` |
| Lógica / regras | `hooks/`, `context/`, `validation/` | `service/` (interface + `impl/`), `utils/`, `mapper/` |
| Acesso a dados | `api/` (Axios) | `repository/` (interface + `impl/postgres`, `impl/memory`) |

### Correspondência com Spring Boot

| Spring | Aqui |
|---|---|
| `@RestController` | `server/controller/*Controller.ts` |
| `@Service` + `ServiceImpl` | `server/service/*Service.ts` + `service/impl/*ServiceImpl.ts` |
| `@Repository` | `server/repository/*Repository.ts` + `impl/` |
| `@Entity` | `server/entity/` + `server/database/schema.ts` |
| DTO + `@Valid` | `server/dto/**` (Zod) + `middleware/validate.ts` |
| MapStruct | `server/mapper/` |
| `@ControllerAdvice` | `server/exception/handler/GlobalExceptionHandler.ts` |
| `WebConfig` (CORS) | `server/config/web.config.ts` |
| Injeção por construtor | `server/config/container.ts` |
| `application.yaml` | `server/config/env.ts` |
| Flyway | `server/database/migrations/V*__*.sql` + `npm run db:migrate` |

## API REST

| Método | Rota | Descrição | Sucesso | Erros |
|---|---|---|---|---|
| GET | `/api/products?search&type&map&maxPrice&minRating&sort` | Lista/filtra produtos | 200 | 400 |
| GET | `/api/products/:id` | Detalhe do produto | 200 | 400, 404 |
| POST | `/api/users` | Cadastro | 201 | 400, 409 |
| GET | `/api/users/:id` | Dados do usuário | 200 | 404 |
| PUT | `/api/users/:id` | Atualiza nome/e-mail | 200 | 400, 404, 409 |
| POST | `/api/auth/login` | Login | 200 | 400, 401 |
| GET | `/api/users/:id/orders` | Compras do usuário | 200 | 404 |
| POST | `/api/orders` | Finaliza pedido | 201 | 400, 404 |
| GET | `/api/orders/:id` | Detalhe do pedido | 200 | 404 |
| PATCH | `/api/orders/:id/resend-email` | Reenvia e-mail (mock) | 200 | 404, 422 |
| DELETE | `/api/orders/:id` | Cancela pedido | 204 | 404 |
| GET | `/api/coupons/:code` | Valida cupom (`CS2MARKET10`, `HEADSHOT15`) | 200 | 404 |

Formato padrão de erro:

```json
{ "message": "Dados inválidos", "status": 400, "timestamp": "2026-10-11T12:00:00.000Z",
  "path": "/api/users", "fields": [{ "field": "email", "message": "E-mail inválido" }] }
```

## Requisitos da atividade

| Requisito | Onde |
|---|---|
| 3+ telas responsivas | Início, Catálogo, Produto, Login, Cadastro, Carrinho, Checkout, Confirmação, Minha conta |
| 2+ componentes reutilizáveis | `ProductCard`, `FormField`, `Modal`/`ConfirmModal`, `StateMessage`, `Breadcrumb`, `OrderSummary`, `CheckoutStepper`, `StarRating` |
| 3+ interações | Busca, filtros (tipo, mapa, preço, avaliação), ordenação, chips, modal de confirmação, menu mobile, acordeão, abas, cupom |
| Formulário com 5+ campos e validação | Cadastro: nome, e-mail, CPF, senha, confirmação, termos (cliente + servidor, erros por campo) |
| GET + 2 entre POST/PUT/PATCH/DELETE | GET, POST, PUT, PATCH e DELETE |
| Tratamento de erros da API | `api/errorHandler.js`, estados de loading/erro/vazio, toasts, erros por campo |
| Acessibilidade (Lighthouse > 90) | 100 nas páginas testadas: labels, `aria-*`, foco visível, skip link, contraste AA, modal com foco preso |
| Versionamento | Git Flow: `main`, `develop`, `feature/*`, `docs/*` |
| Publicação | Vercel |

## Deploy na Vercel

1. Suba o repositório no GitHub e importe na Vercel (o framework é detectado pelo `vercel.json`).
2. **Opcional, para persistir dados:** em *Storage → Neon*, crie um banco. A Vercel injeta a `DATABASE_URL`.
3. Rode as migrations uma vez, localmente: `DATABASE_URL=... npm run db:migrate`.
4. Sem banco, a API funciona em memória. Os dados podem zerar quando a função "esfria".

## Fluxo de Git

- `main`: produção · `develop`: integração
- Branch: `<tipo>/<issue>-descricao` (ex.: `feature/3-products-api`)
- Commit: `<tipo>(<issue>): mensagem` (ex.: `feat(3): list products with filters`)
