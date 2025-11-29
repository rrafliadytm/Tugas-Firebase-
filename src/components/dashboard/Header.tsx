import type { User } from 'firebase/auth';
import { Icons } from '../shared/Icons';
import { UserNav } from './UserNav';

interface HeaderProps {
  user: User;
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-2">
        <Icons.logo className="h-7 w-7 text-primary" />
        <h1 className="font-headline text-xl font-bold tracking-tight text-foreground">VerdantDo</h1>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <UserNav user={user} />
      </div>
    </header>
  );
}
