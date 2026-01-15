# 🎮 GamIN

> Jogo educacional de lógica de programação desenvolvido pela IN Junior.

Controle um robô através de comandos e funções para alcançar a estrela! Aprenda conceitos de programação como sequências, loops e recursão de forma divertida e interativa.

![GamIN Screenshot](./public/screenshot.png)

---

## ✨ Funcionalidades

- 🤖 **Robô Programável** - Controle um robô através de comandos simples
- 📋 **Fila de Comandos** - Visualize e execute sequências de comandos
- 🔄 **Funções Recursivas** - Crie e reutilize funções (F0, F1, F2)
- 🎯 **Níveis Progressivos** - 3 níveis com dificuldade crescente
- 🛠️ **Editor de Níveis** - Crie seus próprios níveis personalizados
- 💾 **Persistência** - Níveis salvos automaticamente no navegador

---

## 🚀 Começando

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18.0 ou superior
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/IN-Junior/gamin.git

# Entre no diretório
cd gamin

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O jogo estará disponível em `http://localhost:5173`

---

## 🛠️ Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a build de produção |
| `npm run preview` | Visualiza a build de produção |
| `npm run lint` | Executa o ESLint |
| `npm run lint:fix` | Executa o ESLint com auto-correção |
| `npm run format` | Formata o código com Prettier |
| `npm run format:check` | Verifica formatação sem alterar |
| `npm run type-check` | Verifica tipos TypeScript |

---

## 🏗️ Estrutura do Projeto

```
src/
├── assets/              # Imagens e recursos
├── components/          # Componentes React
│   ├── common/          # Componentes genéricos reutilizáveis
│   ├── editor/          # Editor de níveis e funções
│   ├── game/            # Componentes do jogo
│   └── layout/          # Header e layout
├── data/                # Configuração de níveis
├── hooks/               # Custom hooks
├── pages/               # Páginas/rotas
├── services/            # Lógica de negócio
├── styles/              # Estilos globais e CSS variables
├── types/               # Definições de tipos TypeScript
└── utils/               # Constantes e utilitários
```

---

## 🎮 Como Jogar

1. **Adicione comandos à fila** usando os botões:
   - ⬆️ **Frente** - Move o robô para frente
   - ⬅️ **Girar Esq** - Gira 90° para a esquerda
   - ➡️ **Girar Dir** - Gira 90° para a direita
   - **F0/F1/F2** - Chama uma função definida

2. **Defina funções** no editor para criar sequências reutilizáveis

3. **Clique em PLAY** para executar os comandos

4. **Alcance a estrela ⭐** para completar o nível!

---

## 🧩 Tecnologias

- [React 19](https://react.dev/) - Biblioteca de UI
- [TypeScript](https://www.typescriptlang.org/) - Tipagem estática
- [Vite](https://vite.dev/) - Build tool
- [React Router](https://reactrouter.com/) - Navegação
- [React Icons](https://react-icons.github.io/react-icons/) - Ícones
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) - Qualidade de código
- [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/okonet/lint-staged) - Git hooks

---

## 📁 Arquitetura

O projeto segue uma arquitetura modular com separação clara de responsabilidades:

- **Components** - UI pura, sem lógica de negócio
- **Hooks** - Estado e lógica reutilizável (`useGame`, `useCommands`)
- **Services** - Lógica de negócio pura (`gameEngine`)
- **Types** - Tipos centralizados para todo o projeto
- **Data** - Configurações e dados estáticos

---

## 👥 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Padrão de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação/estilo
- `refactor:` - Refatoração
- `test:` - Testes
- `chore:` - Tarefas de manutenção

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🏢 Sobre a IN Junior

A **IN Junior** é a empresa júnior de Computação da Universidade Federal Fluminense (UFF). Desenvolvemos soluções tecnológicas inovadoras enquanto formamos os profissionais do futuro.

---

<p align="center">
  Feito com 💙 pela <strong>IN Junior</strong>
</p>
