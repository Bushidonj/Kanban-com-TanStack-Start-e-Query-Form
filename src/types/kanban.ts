export type Priority = 'Baixa' | 'Média' | 'Urgente';

export type CardStatus = 
  | 'Backlog'
  | 'To do'
  | 'Doing'
  | 'Awaiting Response'
  | 'Awaiting Review'
  | 'HML Testing'
  | 'Blocked'
  | 'Bugs'
  | 'Complete'
  | 'Closed';

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  responsible: string;
  status: CardStatus;
  deadline: string;
  priority: Priority;
  tags: Tag[];
  comments: Comment[];
  attachments?: string[];
}

export interface Column {
  id: CardStatus;
  title: string;
}
