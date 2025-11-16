export interface Project {
  id: string;
  name: string;
  description: string;
  manager: string;
  members: string[];
  boards: string[];
  pinned: boolean;
  archived: boolean;
  created: number;
  [key: string]: unknown;
}

export interface Board {
  id: string;
  name: string;
  projectId: string;
  createdOn: number;
  teamMembers: string[];
  type: string;
  user: string;
}

export interface Column {
  id: string;
  name: string;
  boardId: string;
  cards: TaskCard[];
  created: number;
}

export interface TaskCard {
  id: string;
  title: string;
  description?: string;
  isArchive: boolean;
  isCompleted: boolean;
  priority: string;
  teamMembers: string[];
  [key: string]: unknown;
}
