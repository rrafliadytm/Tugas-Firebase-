'use client';

import { useEffect, useState, useCallback } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '../auth/AuthProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '../shared/Icons';
import type { Task, Category } from '@/lib/types';
import TaskItem from './TaskItem';
import AddTaskDialog from './AddTaskDialog';

export default function TaskContainer() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const refetchData = useCallback(() => {
    if (!user) return;

    const tasksQuery = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const tasksUnsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const fetchedTasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Task));
      setTasks(fetchedTasks);
      setLoading(false);
    });

    const categoriesQuery = query(collection(db, 'categories'), where('userId', '==', user.uid));
    const categoriesUnsubscribe = onSnapshot(categoriesQuery, (snapshot) => {
      const fetchedCategories = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Category)
      );
      setCategories(fetchedCategories);
    });

    return () => {
      tasksUnsubscribe();
      categoriesUnsubscribe();
    };
  }, [user]);

  useEffect(() => {
    const unsubscribe = refetchData();
    return () => unsubscribe && unsubscribe();
  }, [refetchData]);

  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);
  
  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name ?? 'Uncategorized';
  };

  const TaskList = ({ taskItems }: { taskItems: Task[] }) => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {taskItems.map((task) => (
        <TaskItem key={task.id} task={task} categoryName={getCategoryName(task.categoryId)} />
      ))}
    </div>
  );
  
  const EmptyState = ({ title, description }: { title: string; description: string }) => (
    <Card className="flex flex-col items-center justify-center p-10 text-center">
      <CardHeader>
        <div className="mx-auto mb-4 rounded-full border-8 border-secondary bg-secondary p-4">
          <Icons.checkCircle className="h-12 w-12 text-muted-foreground" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
         <AddTaskDialog categories={categories} onTaskAdded={refetchData} />
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Tabs defaultValue="active" className="space-y-4">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <AddTaskDialog categories={categories} onTaskAdded={refetchData} />
      </div>
      <TabsContent value="active">
        {activeTasks.length > 0 ? <TaskList taskItems={activeTasks} /> : <EmptyState title="All caught up!" description="You have no active tasks. Add one to get started." />}
      </TabsContent>
      <TabsContent value="completed">
         {completedTasks.length > 0 ? <TaskList taskItems={completedTasks} /> : <EmptyState title="No completed tasks" description="Complete a task to see it here." />}
      </TabsContent>
    </Tabs>
  );
}
