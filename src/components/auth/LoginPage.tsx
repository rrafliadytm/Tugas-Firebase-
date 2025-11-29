'use client';

import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/shared/Icons';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LoginPage() {
  const { toast } = useToast();
  const loginBg = PlaceHolderImages.find((img) => img.id === 'login-background');

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google: ', error);
      toast({
        title: 'Authentication Error',
        description: 'Failed to sign in with Google. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="relative h-screen w-full">
      {loginBg && (
        <Image
          src={loginBg.imageUrl}
          alt={loginBg.description}
          data-ai-hint={loginBg.imageHint}
          fill
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="flex w-full max-w-sm flex-col items-center space-y-6 rounded-xl border bg-card/80 p-8 shadow-2xl">
          <div className="flex items-center space-x-2">
            <Icons.logo className="h-10 w-10 text-primary" />
            <h1 className="font-headline text-4xl font-bold text-foreground">VerdantDo</h1>
          </div>
          <p className="text-center text-muted-foreground">
            Organize your life, one task at a time.
          </p>
          <Button
            onClick={handleGoogleSignIn}
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
          >
            <Icons.google className="mr-2 h-5 w-5" />
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
