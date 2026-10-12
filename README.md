# CS2 Market

Marketplace de conteúdo digital de Counter-Strike 2 (cursos, e-books e pacotes) com entrega por e-mail.

Trabalho da disciplina **Programação para Interface de Usuário** (UNIJUÍ), Unidade 2: Desenvolvimento Web.

| Camada | Tecnologia |
|---|---|
| Front-end | React 19 + Vite + React Router. HTML semântico, CSS próprio e JavaScript puro (`fetch`, validação manual). |
| Back-end | Node.js + Express 5 + TypeScript, em camadas no estilo Spring Boot |
| Banco | Postgres (Neon) via Drizzle ORM. Sem banco configurado, usa repositórios em memória (retorno mockado). |
| Testes | Vitest + Testing Library + Supertest (55 testes) |
| Deploy | Vercel: front estático e API serverless no mesmo domínio |

---

## Como rodar

### Pré-requisitos
- Node.js **20 ou superior** (`node -v`)
- Git

### Passo a passo

```bash
git clone <url-do-repositorio>
cd cs2-market
npm install
npm run dev
```

- Front: http://localhost:5173
- API: http://localhost:3333/api (o Vite repassa `/api` para ela)

Não precisa de banco: sem `DATABASE_URL`, a API sobe com os produtos de exemplo **em memória**. Os cadastros somem quando a API reinicia.

### Usando o banco (opcional em dev, recomendado em produção)

```bash
cp .env.example .env              # coloque a DATABASE_URL do Neon
npm run db:migrate                # cria as tabelas e insere os produtos
npm run dev
```

### Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | API e front juntos, com recarga automática |
| `npm run dev:api` / `npm run dev:web` | Sobe cada parte separadamente |
| `npm test` | Roda todos os testes (back e front) |
| `npm run typecheck` | Checa os tipos do back-end |
| `npm run build` | Gera o front de produção em `dist/` |
| `npm run db:migrate` | Aplica as migrations SQL no Postgres |

### Dados para testar
- **CPF válido:** `529.982.247-25`
- **Cupons:** `CS2MARKET10` (10%) e `HEADSHOT15` (15%)
- **Pix:** 5% de desconto automático

---

## Arquitetura

```
Navegador (React)                                Vercel Function (Express)
pages → hooks → api/httpClient (fetch) ──JSON──▶ routes → validate(DTO) → controller → service → repository ──▶ Postgres | memória
                     ◀── JSON / ErrorResponse ── GlobalExceptionHandler ◀──────────── mapper ◀─┘
```

### Separação de responsabilidades (Aula 3: arquitetura de 3 camadas)

| Camada | Front (`web/src`) | Back (`server/`) |
|---|---|---|
| Apresentação | `pages/`, `components/`, `styles/` | `controller/`, `routes/` |
| Lógica de negócio | `hooks/`, `context/`, `validation/` | `service/` (interface + `impl/`), `mapper/`, `utils/` |
| Acesso a dados | `api/` (`fetch`) | `repository/` (interface + `impl/postgres`, `impl/memory`) |
| Regras compartilhadas | `shared/` (validação de CPF e cálculo de desconto, usados pelos dois lados) | |

### Front-end e o conteúdo das aulas

| Aula | Aplicação no projeto |
|---|---|
| 1. Design e cores | Laranja para ação e energia, azul para confiança e informação, verde para sucesso, vermelho para erro. Tema escuro (seriedade, contexto gamer). Tokens em `styles/global.css`. |
| 2. Usabilidade e acessibilidade | WCAG 2.2 AA: contraste ≥ 4.5:1, foco visível, *skip link*, labels associados, `aria-invalid` e `aria-describedby` nos erros, modal com foco preso e ESC, abas com navegação por setas, alvos de toque ≥ 24px, `prefers-reduced-motion`. Lighthouse de acessibilidade: 100. |
| 3. HTML, CSS e JS | HTML semântico (`header`, `nav`, `main`, `section`, `article`, `fieldset`, `legend`), CSS próprio com Flexbox, Grid e media queries, JavaScript com eventos (`onSubmit`, `preventDefault`), `fetch` e validação manual dos formulários. |

### Back-end: correspondência com Spring Boot

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
| `application.yaml` | `server/config/env.ts` + `.env` |
| Flyway | `server/database/migrations/V*__*.sql` + `npm run db:migrate` |

---

## API REST

| Método | Rota | Descrição | Sucesso | Erros |
|---|---|---|---|---|
| GET | `/api/products?search&type&map&maxPrice&minRating&sort` | Lista e filtra produtos | 200 | 400 |
| GET | `/api/products/:id` | Detalhe do produto | 200 | 400, 404 |
| POST | `/api/users` | Cadastro | 201 | 400, 409 |
| GET | `/api/users/:id` | Dados do usuário | 200 | 404 |
| PUT | `/api/users/:id` | Atualiza nome e e-mail | 200 | 400, 404, 409 |
| POST | `/api/auth/login` | Login | 200 | 400, 401 |
| GET | `/api/users/:id/orders` | Compras do usuário | 200 | 404 |
| POST | `/api/orders` | Finaliza pedido | 201 | 400, 404 |
| GET | `/api/orders/:id` | Detalhe do pedido | 200 | 404 |
| PATCH | `/api/orders/:id/resend-email` | Reenvia o e-mail de entrega (mock, até 5 envios) | 200 | 404, 422 |
| DELETE | `/api/orders/:id` | Cancela o pedido | 204 | 404 |
| GET | `/api/coupons/:code` | Valida um cupom | 200 | 404 |

Todo erro segue o mesmo formato:

```json
{
  "message": "Dados inválidos",
  "status": 400,
  "timestamp": "2026-10-14T12:00:00.000Z",
  "path": "/api/users",
  "fields": [{ "field": "email", "message": "E-mail inválido" }]
}
```

---

## Requisitos da atividade

| Requisito | Onde está |
|---|---|
| 3 telas responsivas | 9 telas: Início, Catálogo, Produto, Login, Cadastro, Carrinho, Checkout, Confirmação e Minha conta |
| 2 componentes reutilizáveis | `ProductCard`, `FormField`, `Modal`/`ConfirmModal`, `StateMessage`, `Breadcrumb`, `OrderSummary`, `CheckoutStepper`, `StarRating`, `Toast` |
| 3 interações | Busca, filtros (tipo, mapa, preço, avaliação), ordenação, chips, modal de confirmação, menu mobile, acordeão, abas, cupom |
| Formulário com 5 ou mais campos | Cadastro com 6 campos (nome, e-mail, CPF, senha, confirmação, termos), validado no cliente e no servidor, com erro por campo |
| GET + 2 entre POST/PUT/PATCH/DELETE | GET, POST, PUT, PATCH e DELETE |
| Tratamento de respostas e erros | `api/httpClient.js` (timeout, rede, `ErrorResponse`), estados de carregando/erro/vazio, toasts, erros nos campos |
| WCAG AA / Lighthouse acima de 90 | 100 em acessibilidade |
| Versionamento | Git Flow com `main`, `develop`, `feature/*`, `refactor/*`, `test/*` e `docs/*`. CI no GitHub Actions |
| Publicação | Vercel (ver abaixo) |

---

## Deploy na Vercel

1. Suba o repositório no GitHub.
2. Na Vercel, clique em **Add New → Project** e importe o repositório. As configurações vêm do `vercel.json`, não precisa mudar nada.
3. Em **Storage → Create → Neon (Postgres)**, conecte o banco ao projeto. A Vercel cria a `DATABASE_URL` automaticamente.
4. Copie a `DATABASE_URL` para o seu `.env` local e rode `npm run db:migrate` uma vez.
5. Faça um **Redeploy** e teste `https://<seu-projeto>.vercel.app/api/health`.

> Sem o Neon, a API funciona em memória, mas cada instância serverless tem a sua própria memória. Um cadastro pode "sumir" na requisição seguinte. **Use o Neon na apresentação.**

---

## Fluxo de Git

- `main`: produção · `develop`: integração
- Branch: `<tipo>/<issue>-descricao-em-ingles` (ex.: `feature/18-usability-test`)
- Commit: `<tipo>(<issue>): mensagem em inglês` (ex.: `feat(18): add sus questionnaire results`)
- Tipos de branch: `feature`, `bugfix`, `hotfix`, `release`, `docs`
- Tipos de commit: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Toda mudança entra em `develop` por Pull Request revisado por outro integrante.

Normas de contribuição: [CONTRIBUTING.md](CONTRIBUTING.md).
