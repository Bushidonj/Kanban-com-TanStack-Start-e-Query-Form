import type { Card, Column } from '../types/kanban';

export const INITIAL_COLUMNS: Column[] = [
  { id: 'Backlog', title: 'Backlog' },
  { id: 'To do', title: 'To do' },
  { id: 'Doing', title: 'Doing' },
  { id: 'Awaiting Response', title: 'Awaiting Response' },
  { id: 'Awaiting Review', title: 'Awaiting Review' },
  { id: 'HML Testing', title: 'HML Testing' },
  { id: 'Blocked', title: 'Blocked' },
  { id: 'Bugs', title: 'Bugs' },
  { id: 'Complete', title: 'Complete' },
  { id: 'Closed', title: 'Closed' },
];

export const STATUS_COLORS: Record<string, { column: string, card: string }> = {
  'Backlog': { column: '#202020', card: '#202020' },
  'To do': { column: '#202020', card: '#2c2c2b' },
  'Doing': { column: '#23221a', card: '#373325' },
  'Awaiting Response': { column: '#1a2027', card: '#213041' },
  'Awaiting Review': { column: '#221d25', card: '#36293f' },
  'HML Testing': { column: '#25201d', card: '#382d26' },
  'Blocked': { column: '#241d1d', card: '#492c29' },
  'Bugs': { column: '#241d1d', card: '#492c29' },
  'Complete': { column: '#1b211d', card: '#24342b' },
  'Closed': { column: '#231e1b', card: '#3d2a1d' },
};

export const STATUS_TITLE_COLORS: Record<string, string> = {
  'Backlog': '#373737',
  'To do': '#373737',
  'Doing': '#413c2c',
  'Awaiting Response': '#2a3b4d',
  'Awaiting Review': '#42334d',
  'HML Testing': '#453831',
  'Blocked': '#5c3b3b',
  'Bugs': '#5c3b3b',
  'Complete': '#2d3d31',
  'Closed': '#4d3a2e',
};

export const INITIAL_CARDS: Card[] = [
  {
    id: '1',
    title: 'Implementar Drag and Drop',
    responsible: 'User',
    status: 'Backlog',
    deadline: '2026-03-01',
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
    responsible: 'User',
    status: 'To do',
    deadline: '2026-02-20',
    priority: 'Média',
    tags: [{ id: 't3', name: 'Design', color: '#f59e0b' }],
    comments: [],
    attachments: ['cv-pt.pdf']
  }
];
