# Normas e padrões do projeto

Regras para todos os integrantes. Siga este fluxo em toda alteração.

## Fluxo de trabalho

> **Nunca faça commit direto na `main` ou na `develop`.** Toda alteração nasce numa branch criada a partir da `develop` e volta para ela por Pull Request.

### 1. Pegue uma tarefa
- Escolha ou crie uma issue no GitHub.
- Atribua a issue a você e anote o número dela (ex.: `#21`).

### 2. Crie a branch a partir da `develop`
```bash
git checkout develop
git pull origin develop
git checkout -b feature/21-catalog-pagination
```

### 3. Desenvolva a feature
- Faça commits pequenos e frequentes, no padrão descrito abaixo.
- Antes de enviar, rode localmente:
```bash
npm test
npm run typecheck
npm run build
```

### 4. Envie a branch
```bash
git push -u origin feature/21-catalog-pagination
```

### 5. Abra o Pull Request para a `develop`
- No GitHub: **Compare & pull request**, com base `develop` e compare a sua branch.
- Título no padrão do commit: `feat(21): add catalog pagination`.
- Na descrição: o que foi feito, como testar e um print se mudou alguma tela.
- Peça revisão de **pelo menos um** outro integrante.
- Só faça o merge depois da aprovação e com o CI verde.

### 6. Depois do merge
```bash
git checkout develop
git pull origin develop
git branch -d feature/21-catalog-pagination
```

A `main` só recebe merge da `develop` na hora de publicar uma versão. Quem faz esse merge é o responsável pelo deploy.

## Padrão de branches

Formato: `<tipo>/<numero-da-issue>-descricao-curta-em-ingles`

| Tipo | Quando usar | Exemplo |
|---|---|---|
| `feature` | Nova funcionalidade | `feature/21-catalog-pagination` |
| `bugfix` | Correção de bug na `develop` | `bugfix/22-cart-total-rounding` |
| `hotfix` | Correção urgente na `main` | `hotfix/23-broken-checkout` |
| `docs` | Somente documentação | `docs/24-usability-test` |
| `release` | Preparação de versão | `release/1.2.0` |

## Padrão de commits

Formato: `<tipo>(<numero-da-issue>): mensagem em inglês no imperativo`

| Tipo | Uso | Exemplo |
|---|---|---|
| `feat` | Nova funcionalidade | `feat(21): add pagination to catalog` |
| `fix` | Correção de bug | `fix(22): round cart total to two decimals` |
| `docs` | Documentação | `docs(24): add sus questionnaire results` |
| `style` | Formatação e CSS sem mudança de lógica | `style(21): align pagination buttons` |
| `refactor` | Mudança de código sem mudar comportamento | `refactor(25): extract price formatter` |
| `test` | Testes | `test(26): add login page tests` |
| `chore` | Configuração, dependências, build | `chore: update lockfile` |

## Padrões de código

### Geral
- **Nomes descritivos.** Nada de `a`, `x`, `e`, `item2`, inclusive em lambdas: `products.map((product) => product.title)`.
- Código em inglês; textos da interface em português.
- Não deixe `console.log`, código comentado ou arquivos sem uso.

### Front-end (`web/src`)
| Pasta | Responsabilidade |
|---|---|
| `pages/` | Telas (uma por rota) |
| `components/` | Componentes reutilizáveis. **Reaproveite antes de criar:** `FormField`, `Modal`, `ProductCard`, `StateMessage`, `Toast`... |
| `hooks/` | Lógica de estado reutilizável (`useForm`, `useProducts`...) |
| `api/` | Únicas chamadas HTTP (sempre via `httpClient`, nunca `fetch` direto nas telas) |
| `validation/` | Validação de formulários |
| `styles/global.css` | Estilos. **Use os tokens** (`var(--orange)`, `var(--txt-2)`...), nunca cores soltas |

Acessibilidade é obrigatória (WCAG AA):
- todo `input` tem `label` (use o `FormField`);
- botão é `<button>`, link é `<a>`/`<Link>` (nada de `div` clicável);
- ícone sozinho precisa de `aria-label`;
- trate os estados de **carregando, erro e vazio** em toda tela que chama a API.

### Back-end (`server/`)
Mesma organização do Spring Boot: `controller` → `service` (interface + `impl/`) → `repository` → `entity`.
- Controller só recebe a requisição e devolve a resposta; regra de negócio fica no service.
- Entrada validada com Zod em `dto/`; saída convertida em `mapper/`.
- Erros com as exceções de `exception/` (o `GlobalExceptionHandler` monta a resposta).
- Mudança no banco: **crie uma nova migration** `V{n}__descricao.sql` com `IF NOT EXISTS`. Nunca altere uma migration já aplicada.

### Testes
- Funcionalidade nova vem com teste: `*.test.ts` no back, `*.test.jsx` no front.
- `npm test` precisa passar antes de abrir o PR.

## Checklist do Pull Request
- [ ] Branch criada a partir da `develop`
- [ ] Commits no padrão `tipo(issue): mensagem`
- [ ] `npm test`, `npm run typecheck` e `npm run build` passando
- [ ] Testado no navegador em desktop e celular (DevTools → modo dispositivo)
- [ ] Estados de carregando, erro e vazio tratados (se chamar a API)
- [ ] Labels e navegação por teclado funcionando
- [ ] Print anexado, se mudou alguma tela
- [ ] Revisado por outro integrante
