# Relatório de validação dos requisitos

Validação feita em 12/10/2026, com o projeto rodando localmente (`npm run dev`) e testado no Google Chrome (desktop), com a API em memória.

## Resumo

| Requisito do professor | Resultado | Como foi validado |
|---|---|---|
| 3 telas, desktop e mobile | ✅ 9 telas | Navegação manual. Larguras 390px e 1280px sem scroll horizontal em Início, Catálogo, Produto, Cadastro, Carrinho e Minha conta |
| 2 componentes reutilizáveis | ✅ 9 | `ProductCard`, `FormField`, `Modal`, `StateMessage`, `Breadcrumb`, `OrderSummary`, `CheckoutStepper`, `StarRating`, `Toast` |
| 3 interações | ✅ | Ver "Interações" abaixo |
| Formulário com 5+ campos, obrigatórios e mensagens de erro | ✅ | Ver "Formulário de cadastro" abaixo |
| API com GET + 2 entre POST/PUT/PATCH/DELETE | ✅ 5 métodos | Ver "API REST" abaixo |
| Tratamento de respostas e erros da API | ✅ | 400, 401, 404, 409 e 422 exibidos na interface. Falha de rede e timeout cobertos por testes automatizados |
| WCAG AA / Lighthouse acima de 90 | ✅ | axe-core (WCAG 2.0/2.1/2.2 A e AA): 0 violações em 8 páginas. Lighthouse de acessibilidade: 100 |
| Versionamento | ✅ | Git Flow com branches `feature/*`, `refactor/*`, `test/*`, `docs/*` e tags `v1.0.0` e `v1.1.0` |
| Publicação | ⏳ | Pendente |

## API REST (chamadas reais pelo navegador)

| Cenário | Método | Status |
|---|---|---|
| Filtrar produtos (tipo + mapa + ordenação) | GET | 200 |
| Detalhe do produto | GET | 200 |
| Produto inexistente | GET | 404 |
| Id inválido (`/products/abc`) | GET | 400 |
| Cadastro com dados inválidos | POST | 400 (erros em name, email, cpf, password e acceptedTerms) |
| Cadastro válido | POST | 201 |
| E-mail duplicado / CPF duplicado | POST | 409 |
| Senhas diferentes | POST | 400 (confirmPassword) |
| Editar nome e e-mail | PUT | 200 |
| Login correto / senha errada | POST | 200 / 401 |
| Pedido com Pix + cupom CS2MARKET10 | POST | 201 (R$ 118,00 → R$ 100,30) |
| Pedido com produto inexistente | POST | 404 |
| Reenviar e-mail | PATCH | 200 (envios: 1 → 2) |
| Listar pedidos do usuário | GET | 200 |
| Cancelar pedido / cancelar de novo | DELETE | 204 / 404 |
| Cupom inválido | GET | 404 |
| Rota inexistente | GET | 404 (formato `ErrorResponse`) |

## Formulário de cadastro (6 campos)

- Enviar vazio mostra 6 mensagens de erro, uma por campo, e o foco vai para o primeiro campo inválido (Nome).
- O CPF recebe máscara automática (`39053344705` → `390.533.447-05`).
- Senhas diferentes mostram "As senhas não coincidem" no próprio campo.
- O preenchimento completo foi feito **só com o teclado** (Tab, Espaço, Enter): a conta foi criada e houve redirecionamento para Minha conta com notificação.
- O conflito da API (409) aparece no campo e-mail ou CPF com `aria-invalid="true"`.

## Interações

| Interação | Resultado |
|---|---|
| Filtro por tipo (E-books) | 13 → 4 produtos |
| Filtro por mapa (Inferno) | 4 → 2 produtos |
| Ordenação por menor preço | R$ 29 → R$ 39 |
| Filtros salvos na URL | Sim (dá para compartilhar o link) |
| Limpar filtros | Volta aos 13 produtos |
| Adicionar ao carrinho | Badge atualiza, botão passa a "No carrinho" |
| Cupom inválido / válido | Mensagem de erro / desconto de 10% aplicado |
| Troca da forma de pagamento | Pix R$ 117,30 · Cartão R$ 124,20 |
| Modal de remoção | Abre com foco dentro e fecha com ESC |
| Checkout → confirmação → minhas compras | Fluxo completo OK |
| Reenviar e-mail e cancelar pedido (com modal) | OK, com notificações |
| Menu mobile, acordeão de módulos, abas da conta | OK |

## Acessibilidade (axe-core 4.10, WCAG 2.2 AA)

| Página | Violações |
|---|---|
| Início | 0 |
| Catálogo | 0 |
| Produto | 0 |
| Cadastro | 0 |
| Login | 0 |
| Carrinho | 0 |
| Minha conta (dados) | 0 |
| 404 | 0 |

## Testes automatizados

`npm test`: **55 testes** passando (32 do back e 23 do front).
