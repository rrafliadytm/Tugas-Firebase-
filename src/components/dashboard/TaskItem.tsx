'use client';

import { useTransition } from 'react';
import { format } from 'date-fns';
import { deleteTask, updateTaskStatus } from '@/lib/firestore';
import type { Task } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calendar, Tag, Trash2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface TaskItemProps {
  task: Task;
  categoryName: string;
}

export default function TaskItem({ task, categoryName }: TaskItemProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const isOverdue = !task.completed && task.dueDate.toDate() < new Date();

  const handleStatusChange = (completed: boolean) => {
    startTransition(async () => {
      const { error } = await updateTaskStatus(task.id, completed);
      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to update task. Please try again.',
          variant: 'destructive',
        });
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const { error } = await deleteTask(task.id);
      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete task. Please try again.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Task Deleted',
          description: `"${task.title}" has been removed.`,
        });
      }
    });
  };

  return (
    <Card
      className={cn(
        'flex h-full flex-col transition-all duration-300',
        isPending && 'animate-pulse opacity-60',
        task.completed ? 'bg-secondary' : 'bg-card'
      )}
    >
      <CardHeader className="flex-row items-start gap-4 space-y-0 pb-4">
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={handleStatusChange}
          aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
          className="mt-1 h-5 w-5"
        />
        <div className="flex-1 grid gap-1">
          <CardTitle
            className={cn(
              'text-lg transition-all',
              task.completed && 'text-muted-foreground line-through'
            )}
          >
            {task.title}
          </CardTitle>
          <CardDescription
            className={cn('transition-all', task.completed && 'text-muted-foreground/80')}
          >
            {task.description}
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          className="h-7 w-7 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          aria-label={`Delete task "${task.title}"`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-grow">
        {isOverdue && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Overdue</AlertTitle>
            <AlertDescription>This task is past its due date.</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Badge variant={isOverdue ? "destructive" : task.completed ? "secondary" : "outline"} className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          <span>{format(task.dueDate.toDate(), 'MMM d, yyyy')}</span>
        </Badge>
        <Badge variant="secondary" className="flex items-center gap-1.5">
          <Tag className="h-3.5 w-3.5" />
          <span>{categoryName}</span>
        </Badge>
      </CardFooter>
    </Card>
  );
}
