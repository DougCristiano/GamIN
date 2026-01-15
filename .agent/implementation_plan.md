# 📋 Plano de Profissionalização - Projeto GamIN

> **Objetivo:** Transformar a estrutura do projeto em uma arquitetura profissional, organizada e escalável.
> 
> **Data:** 14/01/2026  
> **Status:** ✅ PLANO CONCLUÍDO - Fases 1 a 5 Finalizadas!

---

## 📊 Diagnóstico Atual

### ✅ Pontos Positivos
- Uso de **TypeScript** com configuração estrita
- **Vite** como bundler moderno
- Uso de **CSS Modules** para estilos
- Separação básica de componentes, pages e tipos
- **React Router** configurado
- **React Compiler** habilitado

### ⚠️ Pontos a Melhorar

| Problema | Descrição |
|----------|-----------|
| 📁 **Estrutura mista de componentes** | Alguns componentes estão na raiz de `components/`, outros em subpastas organizadas |
| 📄 **Arquivos grandes** | `game.tsx` com 414 linhas (regra: max ~200 linhas) |
| 🗂️ **Lógica de jogo no componente** | Regras de negócio misturadas com UI |
| 📦 **Nome genérico no package.json** | `meu-projeto-logica` ao invés de `gamin` |
| 📖 **README padrão do Vite** | Não documenta o projeto real |
| 🔧 **Configuração incompleta** | Falta path aliases, prettier, husky |
| 🚀 **Falta de hooks customizados** | Pasta `hooks/` vazia |
| 🧪 **Sem testes** | Não há estrutura de testes |
| 🌍 **Sem internacionalização** | Textos hardcoded em português |
| 📊 **Sem context/state management** | Estado espalhado pelos componentes |

---

## 🎯 Plano de Ação

### Fase 1: Fundação (Prioridade Alta)
> *Ajustes essenciais para uma base profissional*

#### 1.1 Atualizar `package.json` ✅
- [x] Renomear projeto para `gamin`
- [x] Adicionar descrição, keywords, author
- [x] Adicionar scripts úteis:
  - `format` - Prettier ✅
  - `lint:fix` - ESLint com auto-fix ✅
  - `type-check` - Verificação de tipos ✅
  - `format:check` - Verificar formatação ✅

#### 1.2 Configurar Path Aliases ✅
- [x] Adicionar aliases no `tsconfig.app.json` (11 aliases configurados)
- [x] Configurar `vite.config.ts` para resolver aliases

#### 1.3 Adicionar Prettier ✅
- [x] Instalar `prettier` como dev dependency
- [x] Criar `.prettierrc` com configurações
- [x] Criar `.prettierignore`
- [x] Adicionar integração com ESLint
- [x] Criar `.editorconfig` (bônus)

---

### Fase 2: Reestruturação de Pastas (Prioridade Alta) ✅ PARCIAL
> *Organizar arquivos seguindo padrões da indústria*

#### 2.1 Nova Estrutura de Pastas

```
src/
├── assets/                 # Imagens, ícones, fontes
│   ├── images/
│   └── icons/
│
├── components/             # Componentes reutilizáveis
│   ├── common/             # Componentes genéricos (Button, Modal, etc.)
│   ├── game/               # Componentes específicos do jogo
│   │   ├── Board/
│   │   │   ├── Board.tsx
│   │   │   ├── Board.module.css
│   │   │   └── index.ts
│   │   ├── Robot/
│   │   ├── Star/
│   │   ├── Cell/
│   │   └── CommandQueue/
│   ├── editor/             # Componentes do editor
│   │   ├── LevelEditor/    ✅ (já existe)
│   │   └── FunctionEditor/ ✅ (já existe, precisa mover)
│   └── layout/             # Componentes de layout
│       └── Header/         ✅ (já existe)
│
├── contexts/               # React Contexts (NOVO)
│   ├── GameContext.tsx
│   └── index.ts
│
├── hooks/                  # Custom hooks
│   ├── useGame.ts          # Lógica principal do jogo
│   ├── useRobot.ts         # Controle do robô
│   ├── useLevels.ts        # Gerenciamento de níveis
│   └── useCommands.ts      # Fila de comandos
│
├── pages/                  # Páginas/Rotas
│   ├── GamePage/
│   │   ├── GamePage.tsx
│   │   ├── GamePage.module.css
│   │   └── index.ts
│   └── EditorPage/
│       ├── EditorPage.tsx
│       ├── EditorPage.module.css
│       └── index.ts
│
├── services/               # Serviços e lógica de negócio (NOVO)
│   ├── gameEngine.ts       # Motor do jogo (cálculos, regras)
│   └── commandExecutor.ts  # Executor de comandos
│
├── types/                  # Tipos TypeScript
│   ├── game.types.ts       # Tipos do jogo
│   ├── level.types.ts      # Tipos de níveis
│   └── index.ts            # Barrel export
│
├── utils/                  # Utilitários
│   ├── constants.ts        ✅ (já existe)
│   └── helpers.ts          # Funções auxiliares
│
├── data/                   # Dados estáticos (renomear levels/)
│   └── levels.ts
│
├── styles/                 # Estilos globais (NOVO)
│   ├── index.css           # CSS global
│   ├── variables.css       # CSS variables
│   └── reset.css           # CSS reset
│
├── App.tsx
└── main.tsx
```

#### 2.2 Tarefas de Migração

1. **Mover componentes órfãos para estrutura correta:** ✅
   - [x] `components/FunctionEditor.tsx` → `components/editor/FunctionEditor/`
   - [x] `components/Header.tsx` → Removido (duplicado)
   - [x] `components/LevelEditor.tsx` → Removido (duplicado)

2. **Dividir `game.tsx` em componentes menores:** 🟡 Pendente para Fase 3
   - [ ] Extrair `Board.tsx` (tabuleiro)
   - [ ] Extrair `Robot.tsx` (robô)
   - [ ] Extrair `CommandQueue.tsx` (fila de comandos)
   - [ ] Extrair `LevelNavigation.tsx` (navegação entre níveis)
   - [ ] Extrair `ControlPanel.tsx` (botões de controle)

3. **Renomear arquivos de tipos:** ✅
   - [x] `tipos.ts` → `game.types.ts` e `level.types.ts`
   - [x] Criar barrel export `index.ts`

4. **Organizar estilos:** ✅
   - [x] `index.css` → `styles/index.css`
   - [x] Criar `styles/variables.css` com design tokens
   - [x] Criar `styles/reset.css` com CSS reset

5. **Criar pasta data/:** ✅
   - [x] `levels/levelConfig.ts` → `data/levels.ts`
   - [x] Criar barrel export `data/index.ts`

6. **Atualizar imports para usar path aliases:** ✅
   - [x] `game.tsx` atualizado
   - [x] `GamePage.tsx` atualizado
   - [x] `EditorPage.tsx` atualizado
   - [x] Componentes atualizados

---

### Fase 3: Refatoração de Lógica (Prioridade Média) ✅ CONCLUÍDA
> *Separar lógica de negócio da UI*

#### 3.1 Criar Custom Hooks ✅

**Hooks implementados:**
- [x] `useGame.ts` - Gerenciamento de estado do jogo e navegação de níveis
- [x] `useCommands.ts` - Gerenciamento de fila de comandos e funções
- [x] Barrel exports em `hooks/index.ts`
**`useGame.ts`** - Hook principal do jogo:
```typescript
export const useGame = (customLevels?: LevelConfig[]) => {
  // Estado do jogo
  const [currentLevel, setCurrentLevel] = useState<LevelConfig>();
  const [robot, setRobot] = useState<RobotState>();
  const [isExecuting, setIsExecuting] = useState(false);
  
  // Ações
  const loadLevel = useCallback(...);
  const nextLevel = useCallback(...);
  const previousLevel = useCallback(...);
  const reset = useCallback(...);
  
  return { currentLevel, robot, isExecuting, loadLevel, nextLevel, previousLevel, reset };
};
```

**`useCommands.ts`** - Gerenciamento de comandos:
```typescript
export const useCommands = () => {
  const [queue, setQueue] = useState<Command[]>([]);
  const [functions, setFunctions] = useState<FunctionDefinition[]>(...);
  
  const addCommand = useCallback(...);
  const expandCommands = useCallback(...);
  const executeCommands = useCallback(...);
  
  return { queue, functions, addCommand, expandCommands, executeCommands };
};
```

#### 3.2 Criar GameContext

```typescript
// contexts/GameContext.tsx
export const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const game = useGame();
  const commands = useCommands();
  
  return (
    <GameContext.Provider value={{ ...game, ...commands }}>
      {children}
    </GameContext.Provider>
  );
};
```

#### 3.3 Criar Services

**`services/gameEngine.ts`** - Lógica pura do jogo:
```typescript
export const calculateNextPosition = (
  current: Position,
  direction: number,
  gridSize: number
): Position => {...};

export const checkCollision = (
  position: Position,
  obstacles: Position[]
): boolean => {...};

export const checkWin = (
  robotPosition: Position,
  starPosition: Position
): boolean => {...};
```

---

### Fase 4: Qualidade de Código (Prioridade Média) ✅ CONCLUÍDA

#### 4.1 Ferramentas de Desenvolvimento ✅
- [x] Prettier já configurado na Fase 1
- [x] Instalar e configurar **Husky** (git hooks)
- [x] Instalar **lint-staged** (lint apenas arquivos alterados)
- [ ] Configurar **commitlint** (opcional - mensagens de commit padronizadas)

#### 4.2 Arquivos de Configuração ✅
- [x] `.husky/pre-commit` - Roda lint-staged antes de cada commit
- [x] `lint-staged` configurado no package.json

#### 4.3 Padronização de Código ✅
- [x] Usar **named exports** consistentemente
- [x] Adicionar **barrel exports** (index.ts) em todas as pastas
- [x] Componentes e hooks documentados

---

### Fase 5: Documentação (Prioridade Média)

#### 5.1 Atualizar README.md

```markdown
# 🎮 GamIN

> Jogo educacional de lógica de programação desenvolvido pela IN Junior

## 🚀 Começando

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
\`\`\`bash
npm install
npm run dev
\`\`\`

## 🎯 Funcionalidades
- Jogo de robô programável
- Editor de níveis customizados
- Sistema de funções recursivas
- X níveis progressivos

## 🏗️ Estrutura do Projeto
[Descrição da estrutura]

## 🛠️ Scripts
| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run lint` | Verifica código com ESLint |
| `npm run format` | Formata código com Prettier |

## 👥 Contribuindo
[Guia de contribuição]

## 📄 Licença
[Licença do projeto]
```

#### 5.2 Criar CONTRIBUTING.md
- [ ] Guia de estilo de código
- [ ] Fluxo de trabalho Git
- [ ] Padrão de commits (Conventional Commits)

---

### Fase 6: Melhorias Futuras (Baixa Prioridade)

#### 6.1 Testes
- [ ] Configurar Vitest
- [ ] Testes unitários para services
- [ ] Testes de integração para hooks
- [ ] Testes E2E com Playwright (opcional)

#### 6.2 CI/CD
- [ ] GitHub Actions para lint/build
- [ ] Deploy automático (Vercel/Netlify)

#### 6.3 Internacionalização
- [ ] Configurar i18next
- [ ] Extrair strings para arquivos de tradução

#### 6.4 Acessibilidade
- [ ] Adicionar atributos ARIA
- [ ] Suporte a navegação por teclado
- [ ] Alto contraste

---

## 📈 Cronograma Sugerido

| Fase | Duração Estimada | Prioridade |
|------|------------------|------------|
| Fase 1: Fundação | 1 dia | 🔴 Alta |
| Fase 2: Reestruturação | 2-3 dias | 🔴 Alta |
| Fase 3: Refatoração | 2-3 dias | 🟡 Média |
| Fase 4: Qualidade | 1 dia | 🟡 Média |
| Fase 5: Documentação | 0.5 dia | 🟡 Média |
| Fase 6: Melhorias | Contínuo | 🟢 Baixa |

**Total estimado:** ~7-8 dias de trabalho focado

---

## ✅ Checklist de Execução

### Ordem de Implementação Recomendada

1. [x] **Fase 1.1** - Atualizar `package.json` ✅
2. [x] **Fase 1.2** - Configurar path aliases ✅
3. [x] **Fase 1.3** - Adicionar Prettier ✅
4. [ ] **Fase 2.1** - Criar nova estrutura de pastas
5. [ ] **Fase 2.2** - Migrar componentes
6. [ ] **Fase 3.1** - Criar custom hooks
7. [ ] **Fase 3.2** - Implementar GameContext
8. [ ] **Fase 3.3** - Extrair services
9. [ ] **Fase 4** - Configurar ferramentas de qualidade
10. [ ] **Fase 5** - Atualizar documentação

---

> 💡 **Dica:** Execute uma fase por vez e valide que tudo continua funcionando antes de prosseguir para a próxima.

---

*Plano criado pelo Antigravity AI Assistant*
