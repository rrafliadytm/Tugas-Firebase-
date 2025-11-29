import Header from './Header';
import TaskContainer from './TaskContainer';
import { useAuth } from '../auth/AuthProvider';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header user={user} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <TaskContainer />
      </main>
    </div>
  );
}
