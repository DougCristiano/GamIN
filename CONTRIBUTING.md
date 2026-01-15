# Guia de Contribuição

Obrigado por considerar contribuir com o GamIN! 🎉

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Padrões de Código](#padrões-de-código)
- [Fluxo de Trabalho Git](#fluxo-de-trabalho-git)
- [Estrutura do Projeto](#estrutura-do-projeto)

---

## 📜 Código de Conduta

Este projeto segue um código de conduta. Ao participar, você concorda em manter um ambiente respeitoso e inclusivo para todos.

---

## 🤝 Como Contribuir

### Reportando Bugs

1. Verifique se o bug já não foi reportado nas [Issues](https://github.com/IN-Junior/gamin/issues)
2. Se não encontrar, abra uma nova issue com:
   - Descrição clara do problema
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots (se aplicável)
   - Ambiente (navegador, sistema operacional)

### Sugerindo Melhorias

1. Abra uma issue com a tag `enhancement`
2. Descreva sua sugestão detalhadamente
3. Explique o problema que ela resolve

### Contribuindo com Código

1. Fork o repositório
2. Clone seu fork localmente
3. Crie uma branch para sua feature
4. Faça suas alterações
5. Teste localmente
6. Commit seguindo os padrões
7. Push e abra um Pull Request

---

## ⚙️ Configuração do Ambiente

```bash
# Clone seu fork
git clone https://github.com/SEU_USUARIO/gamin.git
cd gamin

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

# Execute os testes de qualidade
npm run lint
npm run type-check
```

---

## 📝 Padrões de Código

### TypeScript

- Use tipos explícitos sempre que possível
- Evite `any`
- Use `interface` para objetos, `type` para unions/aliases
- Documente funções complexas com JSDoc

```typescript
// ✅ Bom
interface UserProps {
  name: string;
  age: number;
}

// ❌ Evite
const user: any = { name: 'John' };
```

### React

- Use componentes funcionais com hooks
- Extraia lógica para custom hooks quando reutilizável
- Use named exports para componentes
- Mantenha componentes pequenos (< 200 linhas)

```tsx
// ✅ Bom
export const MyComponent: React.FC<Props> = ({ title }) => {
  return <h1>{title}</h1>;
};

// ❌ Evite
export default function MyComponent(props) {
  // 500 linhas de código...
}
```

### CSS

- Use CSS Modules para estilos de componentes
- Use CSS Variables para valores reutilizáveis
- Siga a convenção de nomenclatura camelCase

```css
/* ✅ Bom */
.buttonPrimary {
  background: var(--color-primary);
}

/* ❌ Evite */
.button-primary {
  background: #646cff;
}
```

### Imports

Use path aliases para imports mais limpos:

```typescript
// ✅ Bom
import { Header } from '@/components';
import type { LevelConfig } from '@/types';

// ❌ Evite
import { Header } from '../../../components/layout/Header';
```

---

## 🔀 Fluxo de Trabalho Git

### Branches

- `main` - Branch de produção, sempre estável
- `develop` - Branch de desenvolvimento
- `feature/*` - Novas funcionalidades
- `fix/*` - Correções de bugs
- `docs/*` - Documentação

### Conventional Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/) para mensagens padronizadas:

```
<tipo>[escopo opcional]: <descrição>

[corpo opcional]

[rodapé opcional]
```

#### Tipos

| Tipo | Descrição |
|------|-----------|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Apenas documentação |
| `style` | Formatação, ponto e vírgula, etc |
| `refactor` | Refatoração sem mudança funcional |
| `perf` | Melhoria de performance |
| `test` | Adição ou correção de testes |
| `build` | Mudanças no build/dependências |
| `ci` | Mudanças em CI/CD |
| `chore` | Tarefas de manutenção |
| `revert` | Reversão de commit |

#### Exemplos

```bash
# Boa mensagem
git commit -m "feat(game): add obstacle collision detection"
git commit -m "fix(editor): resolve level save issue"
git commit -m "docs: update README with installation steps"

# Mensagem ruim
git commit -m "fixed stuff"
git commit -m "wip"
```

### Pull Requests

1. Crie a PR contra a branch `develop`
2. Preencha o template de PR
3. Aguarde a review de pelo menos 1 membro
4. Corrija os comentários
5. Após aprovação, faça o merge

---

## 📁 Estrutura do Projeto

```
src/
├── assets/         # Imagens e recursos estáticos
├── components/     # Componentes React
│   ├── common/     # Componentes genéricos (Button, Modal, etc)
│   ├── editor/     # Componentes do editor de níveis
│   ├── game/       # Componentes do jogo
│   └── layout/     # Header, Footer, etc
├── data/           # Dados estáticos (níveis)
├── hooks/          # Custom hooks
├── pages/          # Páginas/rotas
├── services/       # Lógica de negócio pura
├── styles/         # CSS global e variables
├── types/          # Tipos TypeScript
└── utils/          # Utilitários e constantes
```

### Convenções de Arquivos

- **Componentes**: PascalCase (`MyComponent.tsx`)
- **Hooks**: camelCase com prefixo "use" (`useGame.ts`)
- **Services**: camelCase (`gameEngine.ts`)
- **Tipos**: camelCase com sufixo ".types" (`game.types.ts`)
- **Estilos**: camelCase com sufixo ".module" (`Component.module.css`)

### Barrel Exports

Cada pasta deve ter um `index.ts` para facilitar imports:

```typescript
// components/index.ts
export { Header } from './layout';
export { Game } from './game';
```

---

## ❓ Dúvidas?

Se tiver dúvidas, abra uma issue com a tag `question` ou entre em contato com a equipe da IN Junior.

---

Feito com 💙 pela **IN Junior**
