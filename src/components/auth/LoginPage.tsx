'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  signInWithRedirect, 
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  getRedirectResult
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/shared/Icons';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const loginBg = PlaceHolderImages.find((img) => img.id === 'login-background');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/');
      } else {
        // If no user, check for redirect result
        getRedirectResult(auth)
          .then((result) => {
            if (result && result.user) {
              // This will be handled by the onAuthStateChanged listener above
            } else {
              // No redirect result, so we can show the login page
              setIsLoading(false);
            }
          })
          .catch((error) => {
            console.error("Error during getRedirectResult:", error);
            toast({
              title: 'Login Error',
              description: error.message || 'An error occurred during login.',
              variant: 'destructive',
            });
            setIsLoading(false);
          });
      }
    });

    return () => unsubscribe();
  }, [router, toast]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithRedirect(auth, googleProvider);
    } catch (error: any) {
      console.error("Error starting Google Sign-In:", error);
      toast({
        title: 'Gagal Membuka Google',
        description: error.message || 'Terjadi kesalahan saat mencoba login.',
        variant: 'destructive',
      });
      setIsSigningIn(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Memeriksa status login...</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full">
      {loginBg && (
        <Image
          src={loginBg.imageUrl}
          alt={loginBg.description}
          data-ai-hint={loginBg.imageHint}
          fill
          className="object-cover"
          priority 
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
            disabled={isSigningIn}
          >
            {isSigningIn ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Redirecting...
              </>
            ) : (
              <>
                <Icons.google className="mr-2 h-5 w-5" />
                Sign in with Google
              </>
            )}
          </Button>

        </div>
      </div>
    </div>
  );
}
