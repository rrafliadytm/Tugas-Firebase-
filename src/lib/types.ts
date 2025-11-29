import type { Timestamp, FieldValue } from 'firebase/firestore';

export interface Category {
  id: string;
  name: string;
  userId: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: Timestamp;
  createdAt: Timestamp | FieldValue;
  categoryId: string;
  userId: string;
}
