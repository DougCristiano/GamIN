# 🏗️ Arquitetura do Projeto GamIN

> Este documento serve como guia de referência para entender a arquitetura do projeto e manter a consistência durante o desenvolvimento com assistência de IA.

---

## 📋 Visão Geral do Projeto

**GamIN** é um jogo educacional de lógica de programação desenvolvido pela IN Junior (Empresa Júnior de Computação da UFF).

### 🎯 Objetivo do Jogo
O jogador controla um robô através de comandos (frente, girar esquerda, girar direita) e funções reutilizáveis (F0, F1, F2) para alcançar uma estrela no tabuleiro. O jogo ensina conceitos de programação como:
- Sequências de comandos
- Funções e reutilização
- Recursão
- Resolução de problemas lógicos

### 🛠️ Stack Tecnológica
| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| React | 19.x | Biblioteca de UI |
| TypeScript | 5.x | Tipagem estática |
| Vite | 7.x | Build tool e dev server |
| React Router | 7.x | Navegação/rotas |
| React Icons | 5.x | Ícones |
| ESLint + Prettier | - | Qualidade de código |

---

## 📁 Estrutura de Pastas

```
GamIN/
├── 📄 index.html              # Entry point HTML
├── 📄 package.json            # Dependências e scripts
├── 📄 vite.config.ts          # Configuração do Vite
├── 📄 tsconfig.json           # Configuração TypeScript
├── 📄 eslint.config.js        # Configuração ESLint
├── 📄 .prettierrc             # Configuração Prettier
│
├── 📂 public/                 # Assets estáticos
│
└── 📂 src/                    # Código fonte
    ├── 📄 main.tsx            # Entry point React
    ├── 📄 App.tsx             # Componente raiz com rotas
    │
    ├── 📂 assets/             # Imagens e recursos
    │
    ├── 📂 components/         # Componentes React
    │   ├── 📂 common/         # Componentes genéricos (Button, Modal, etc.)
    │   ├── 📂 editor/         # Componentes do editor de níveis
    │   ├── 📂 game/           # Componentes específicos do jogo
    │   ├── 📂 layout/         # Componentes de layout (Header)
    │   └── 📄 index.ts        # Barrel export
    │
    ├── 📂 data/               # Dados estáticos
    │   ├── 📄 levels.ts       # Configuração dos níveis
    │   └── 📄 index.ts        # Barrel export
    │
    ├── 📂 hooks/              # Custom hooks
    │   ├── 📄 useGame.ts      # Estado e lógica do jogo
    │   ├── 📄 useCommands.ts  # Gerenciamento de comandos
    │   └── 📄 index.ts        # Barrel export
    │
    ├── 📂 pages/              # Páginas/rotas
    │   ├── 📂 GamePage/       # Página principal do jogo
    │   └── 📂 EditorPage/     # Página do editor de níveis
    │
    ├── 📂 services/           # Lógica de negócio
    │   ├── 📄 gameEngine.ts   # Motor do jogo (regras, cálculos)
    │   └── 📄 index.ts        # Barrel export
    │
    ├── 📂 styles/             # Estilos globais
    │   ├── 📄 index.css       # Estilos globais
    │   ├── 📄 variables.css   # CSS variables (design tokens)
    │   └── 📄 reset.css       # CSS reset
    │
    ├── 📂 types/              # Definições de tipos TypeScript
    │   ├── 📄 game.types.ts   # Tipos do jogo (Robot, Command, etc.)
    │   ├── 📄 level.types.ts  # Tipos de níveis (LevelConfig, etc.)
    │   └── 📄 index.ts        # Barrel export
    │
    └── 📂 utils/              # Utilitários
        └── 📄 constants.ts    # Constantes globais
```

---

## 🎨 Padrões de Arquitetura

### 1. Separação de Responsabilidades

O projeto segue uma arquitetura em camadas:

```
┌─────────────────────────────────────────────────────────┐
│                     PAGES (Rotas)                       │
│  Composição de componentes, layout de página            │
├─────────────────────────────────────────────────────────┤
│                    COMPONENTS (UI)                      │
│  Componentes visuais, sem lógica de negócio             │
├─────────────────────────────────────────────────────────┤
│                    HOOKS (Estado)                       │
│  Custom hooks que gerenciam estado e orquestram lógica  │
├─────────────────────────────────────────────────────────┤
│                   SERVICES (Lógica)                     │
│  Lógica de negócio pura, funções sem estado             │
├─────────────────────────────────────────────────────────┤
│                     TYPES (Tipos)                       │
│  Definições TypeScript centralizadas                    │
└─────────────────────────────────────────────────────────┘
```

### 2. Fluxo de Dados

```
┌──────────────────────────────────────────────────────────┐
│                        GamePage                          │
│                           │                              │
│              ┌────────────┼────────────┐                 │
│              ▼            ▼            ▼                 │
│          useGame()   useCommands()   [outros hooks]      │
│              │            │                              │
│              └────────────┼────────────┘                 │
│                           ▼                              │
│                    gameEngine.ts                         │
│              (cálculos, validações, regras)              │
└──────────────────────────────────────────────────────────┘
```

---

## 📐 Diretrizes de Código

### ✅ O que FAZER

#### Componentes

```typescript
// ✅ CORRETO: Componente focado em UI
export const CommandButton: React.FC<CommandButtonProps> = ({ 
  command, 
  onClick 
}) => {
  return (
    <button className={styles.button} onClick={onClick}>
      {command.label}
    </button>
  );
};
```

#### Hooks

```typescript
// ✅ CORRETO: Hook gerencia estado e orquestra lógica
export const useGame = () => {
  const [robot, setRobot] = useState<RobotState>(initialState);
  
  const moveRobot = useCallback((command: Command) => {
    // Usa service para cálculos
    const nextPosition = gameEngine.calculateNextPosition(robot, command);
    setRobot(prev => ({ ...prev, position: nextPosition }));
  }, [robot]);
  
  return { robot, moveRobot };
};
```

#### Services

```typescript
// ✅ CORRETO: Função pura sem estado
export const calculateNextPosition = (
  current: Position,
  direction: Direction,
  gridSize: number
): Position => {
  // Lógica pura, sem efeitos colaterais
  return { x: newX, y: newY };
};
```

### ❌ O que EVITAR

```typescript
// ❌ ERRADO: Lógica de negócio dentro do componente
export const Game = () => {
  const handleMove = () => {
    // NÃO faça cálculos complexos aqui
    const newX = robot.x + (direction === 0 ? 1 : 0);
    // ... muitas linhas de lógica
  };
};

// ❌ ERRADO: Componente muito grande (>200 linhas)
// Divida em componentes menores!

// ❌ ERRADO: Imports relativos profundos
import { Robot } from '../../../components/game/Robot';
// ✅ Use path aliases:
import { Robot } from '@components/game/Robot';
```

---

## 🗂️ Convenções de Nomenclatura

### Arquivos e Pastas

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Componentes | PascalCase | `CommandButton.tsx` |
| Hooks | camelCase com "use" | `useGame.ts` |
| Services | camelCase | `gameEngine.ts` |
| Types | camelCase.types | `game.types.ts` |
| Estilos CSS Module | PascalCase.module | `Game.module.css` |
| Constantes | camelCase | `constants.ts` |

### Código

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Componentes | PascalCase | `CommandButton` |
| Funções | camelCase | `calculatePosition` |
| Constantes | UPPER_SNAKE_CASE | `MAX_COMMANDS` |
| Tipos/Interfaces | PascalCase | `RobotState` |
| Enums | PascalCase | `Direction` |

---

## 🔗 Path Aliases

Use sempre path aliases ao importar:

| Alias | Caminho Real |
|-------|--------------|
| `@components` | `src/components` |
| `@pages` | `src/pages` |
| `@hooks` | `src/hooks` |
| `@services` | `src/services` |
| `@types` | `src/types` |
| `@utils` | `src/utils` |
| `@data` | `src/data` |
| `@styles` | `src/styles` |
| `@assets` | `src/assets` |

```typescript
// ✅ CORRETO
import { useGame } from '@hooks';
import { RobotState } from '@types';
import { gameEngine } from '@services';

// ❌ EVITAR
import { useGame } from '../../../hooks/useGame';
```

---

## 📦 Estrutura de Componentes

Cada componente deve seguir esta estrutura de pasta:

```
ComponentName/
├── ComponentName.tsx         # Componente principal
├── ComponentName.module.css  # Estilos do componente
└── index.ts                  # Barrel export
```

### Barrel Export (index.ts)

```typescript
// Sempre use named exports
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName';
```

---

## 🧪 Tipos Importantes

### Tipos do Jogo (`game.types.ts`)

```typescript
// Estado do robô
interface RobotState {
  position: Position;
  direction: Direction;
}

// Posição no grid
interface Position {
  x: number;
  y: number;
}

// Comandos disponíveis
type Command = 'forward' | 'left' | 'right' | 'F0' | 'F1' | 'F2';

// Direção (0=cima, 1=direita, 2=baixo, 3=esquerda)
type Direction = 0 | 1 | 2 | 3;
```

### Tipos de Níveis (`level.types.ts`)

```typescript
interface LevelConfig {
  id: number;
  name: string;
  gridSize: number;
  robotStart: Position;
  robotDirection: Direction;
  starPosition: Position;
  obstacles: Position[];
  maxCommands?: number;
}
```

---

## 🔄 Fluxo de Desenvolvimento

### Ao Criar um Novo Componente

1. Crie a pasta em `src/components/[categoria]/ComponentName/`
2. Crie `ComponentName.tsx`, `ComponentName.module.css`, e `index.ts`
3. Exporte no barrel export da categoria (`components/[categoria]/index.ts`)
4. Exporte no barrel export principal (`components/index.ts`)

### Ao Adicionar Lógica de Negócio

1. **Lógica pura** → Adicione em `services/`
2. **Estado React** → Crie/atualize um hook em `hooks/`
3. **Nunca** coloque lógica complexa diretamente em componentes

### Ao Adicionar Novos Tipos

1. Identifique se é tipo de jogo ou de nível
2. Adicione ao arquivo apropriado em `types/`
3. Exporte no `types/index.ts`

---

## 🤖 Diretrizes para IA

> **Ao usar IA para desenvolvimento, forneça este contexto:**

### Antes de Solicitar Código

1. Mencione que o projeto usa **React 19 + TypeScript + Vite**
2. Indique que deve seguir a **estrutura de pastas existente**
3. Peça para usar **path aliases** (@components, @hooks, etc.)
4. Solicite **CSS Modules** para estilos

### Ao Pedir Novos Recursos

1. Especifique onde o código deve ser colocado
2. Peça para seguir as **convenções de nomenclatura**
3. Solicite **barrel exports** para novos arquivos
4. Peça **tipagem completa** com TypeScript

### Exemplo de Prompt para IA

```
Crie um novo componente Timer para o jogo GamIN:
- Colocar em: src/components/game/Timer/
- Usar CSS Modules para estilos
- Usar path aliases para imports
- Seguir o padrão de estrutura: Timer.tsx, Timer.module.css, index.ts
- Adicionar ao barrel export de components/game/index.ts
- Tipar todas as props com interface TimerProps
```

---

## 📝 Checklist de Qualidade

Antes de fazer commit, verifique:

- [ ] Código formatado com Prettier (`npm run format`)
- [ ] Sem erros de ESLint (`npm run lint`)
- [ ] Tipos TypeScript corretos (`npm run type-check`)
- [ ] Componentes em pastas com estrutura correta
- [ ] Barrel exports atualizados
- [ ] Path aliases usados (não imports relativos profundos)
- [ ] Lógica de negócio em services/hooks (não em componentes)
- [ ] Arquivos ≤ 200 linhas (divida se maior)

---

## 🚀 Scripts Úteis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Qualidade
npm run lint         # Verifica erros de lint
npm run lint:fix     # Corrige erros automaticamente
npm run format       # Formata código
npm run type-check   # Verifica tipos TypeScript

# Build
npm run build        # Build de produção
npm run preview      # Preview do build
```

---

## 📚 Recursos Adicionais

- [README.md](./README.md) - Visão geral do projeto
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Guia de contribuição
- [implementation_plan.md](./.agent/implementation_plan.md) - Plano de profissionalização

---

> 💡 **Mantenha este documento atualizado!** Sempre que a arquitetura mudar, atualize esta documentação para refletir o estado atual do projeto.

---

*Última atualização: Janeiro 2026*
*Mantido pela IN Junior*
