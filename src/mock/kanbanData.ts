import type { Column, Card, CardStatus } from '../types/kanban';

export const INITIAL_COLUMNS: Column[] = [
  { id: 'Backlog', title: 'Backlog' },
  { id: 'To Do', title: 'To Do' },
  { id: 'Doing', title: 'Doing' },
  { id: 'Waiting Response', title: 'Waiting Response' },
  { id: 'Waiting Review', title: 'Waiting Review' },
  { id: 'Waiting Test', title: 'Waiting Test' },
  { id: 'Blocked', title: 'Blocked' },
  { id: 'Bug', title: 'Bug' },
  { id: 'Complete', title: 'Complete' },
  { id: 'Closed', title: 'Closed' },
];

export const STATUS_COLORS: Record<string, { column: string, card: string }> = {
  'Backlog': { column: '#202020', card: '#202020' },
  'To Do': { column: '#202020', card: '#2c2c2b' },
  'Doing': { column: '#1d232a', card: '#232a31' },
  'Waiting Response': { column: '#262620', card: '#2b2b24' },
  'Waiting Review': { column: '#262125', card: '#2c252b' },
  'Waiting Test': { column: '#202525', card: '#252c2c' },
  'Blocked': { column: '#262020', card: '#2c2424' },
  'Bug': { column: '#262020', card: '#2c2424' },
  'Complete': { column: '#1f2620', card: '#242c25' },
  'Closed': { column: '#231e1b', card: '#2c2522' },
};

export const STATUS_TITLE_COLORS: Record<string, string> = {
  'Backlog': '#373737',
  'To Do': '#373737',
  'Doing': '#1e3a5f',
  'Waiting Response': '#5f541e',
  'Waiting Review': '#5f1e54',
  'Waiting Test': '#1e5f5f',
  'Blocked': '#5f1e1e',
  'Bug': '#5f1e1e',
  'Complete': '#1e5f2e',
  'Closed': '#373737',
};

export const STATUS_CATEGORIES = [
  {
    name: 'To-do',
    statuses: ['Backlog', 'To Do', 'Doing'] as CardStatus[]
  },
  {
    name: 'In Progress',
    statuses: ['Waiting Response', 'Waiting Review', 'Waiting Test', 'Blocked'] as CardStatus[]
  },
  {
    name: 'Complete',
    statuses: ['Bug', 'Complete', 'Closed'] as CardStatus[]
  }
];

export const MOCK_USERS = [
  'Allan Azevedo',
  'Carlos Silva',
  'Bruno Carvalho',
];

export const DESCRIPTION_TEMPLATES = {
  frontend: `📋Template para Nova Tarefa de Front-end📋

[Padrões de Código e Boas Práticas](https://www.notion.so/Padr-es-de-C-digo-e-Boas-Pr-ticas-271dee3d7b1e47859014206cd0842f20?pvs=21) 

[Grupos do Kanban e suas Funções](https://www.notion.so/Grupos-do-Kanban-e-suas-Fun-es-8c1b65f1c57c4aa6aa20b3edf5124129?pvs=21)

Link da Atividade no GitHub
Link:

🎨Link do Figma ou print das imagens que serão alteradas🎨
Link ou imagens:

📝Descrição da Atividade a Ser Desenvolvida📝
Descrição:

💎Critérios de Aceitação💎
Descrição:

🔗Links Externos para Desenvolver Atividades🔗
Descrição:

📦Dependências📦
Descrição:

🔗Link da PR🔗
Link:

🔍Prova de teste em HML🔍
Ferramenta de Teste:
- Utilize uma ferramenta de gravação de tela de sua preferência (ex: OBS Studio, Camtasia, etc.)
Critérios de Aceitação:
- Todas as interações e comportamentos visuais devem ser claramente visíveis no vídeo.
- O vídeo deve demonstrar a navegação pelo aplicativo, a execução de ações específicas e a observação dos resultados.
- O vídeo deve ser claro e de fácil entendimento, com uma explicação verbal ou textual dos passos.
- Mostrar responsividade entre telas`,
  backend: `📋Template para Nova Tarefa de Back-end📋

[Padrões de Código e Boas Práticas](https://www.notion.so/Padr-es-de-C-digo-e-Boas-Pr-ticas-271dee3d7b1e47859014206cd0842f20?pvs=21) 

[Grupos do Kanban e suas Funções](https://www.notion.so/Grupos-do-Kanban-e-suas-Fun-es-8c1b65f1c57c4aa6aa20b3edf5124129?pvs=21)

Link da Atividade no GitHub
Link:

📝Descrição da Atividade a Ser Desenvolvida📝
Descrição:

💎Critérios de Aceitação💎
Descrição:

🔗Links Externos para Desenvolver Atividades🔗
Descrição:

📦Dependências📦
Descrição:

🔗Link da PR🔗
Link:

🔍Prova de teste em HML🔍
Ferramenta de Teste:
- Utilize uma ferramenta de gravação de tela de sua preferência (ex: OBS Studio, Camtasia, etc.)
Critérios de Aceitação:
- Todas as interações e comportamentos visuais devem ser claramente visíveis no vídeo.
- O vídeo deve demonstrar a navegação pelo aplicativo, a execução de ações específicas e a observação dos resultados.
- O vídeo deve ser claro e de fácil entendimento, com uma explicação verbal ou textual dos passos.
- Mostrar Logs no terminal durante a execução da atividade`,
};

export const INITIAL_CARDS: Card[] = [
  {
    id: '1',
    title: 'Integração com API de Pagamento',
    responsible: ['Allan Azevedo'],
    status: 'To Do',
    deadline: '2024-03-25',
    priority: 'Urgente',
    tags: [
      { id: 't1', name: 'Frontend', color: '#3b82f6' },
      { id: 't2', name: 'UI/UX', color: '#10b981' }
    ],
    comments: [
      {
        id: 'c1',
        author: 'Admin',
        content: 'Precisamos usar @dnd-kit para isso.',
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    id: '2',
    title: 'Configurar Layout Notion',
    responsible: ['Carlos Silva', 'Bruno Carvalho'],
    status: 'Doing',
    deadline: '2024-03-22',
    priority: 'Média',
    tags: [{ id: 't3', name: 'Design', color: '#f59e0b' }],
    comments: [],
    attachments: ['cv-pt.pdf']
  }
];
