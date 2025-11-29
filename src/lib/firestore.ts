import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';

// Add a new task
export const addTask = async (taskData: {
  title: string;
  description?: string;
  dueDate: Date;
  categoryId: string;
  userId: string;
}) => {
  try {
    await addDoc(collection(db, 'tasks'), {
      ...taskData,
      completed: false,
      createdAt: serverTimestamp(),
    });
    return {};
  } catch (error) {
    console.error('Error adding task: ', error);
    return { error };
  }
};

// Add a new category
export const addCategory = async (categoryData: { name: string; userId: string }) => {
  try {
    const docRef = await addDoc(collection(db, 'categories'), categoryData);
    return { id: docRef.id };
  } catch (error) {
    console.error('Error adding category: ', error);
    return { error };
  }
};

// Update task completion status
export const updateTaskStatus = async (taskId: string, completed: boolean) => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      completed: completed,
    });
    return {};
  } catch (error) {
    console.error('Error updating task status: ', error);
    return { error };
  }
};

// Delete a task
export const deleteTask = async (taskId: string) => {
  try {
    await deleteDoc(doc(db, 'tasks', taskId));
    return {};
  } catch (error) {
    console.error('Error deleting task: ', error);
    return { error };
  }
};
