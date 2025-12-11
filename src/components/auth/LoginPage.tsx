'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  signInWithPopup, // <--- GANTI INI (dari signInWithRedirect)
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
  // getRedirectResult <-- HAPUS INI (tidak butuh lagi)
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
    // Logika pengecekan jauh lebih simpel.
    // Kita hanya perlu mengecek apakah user SUDAH login sebelumnya (persistent session).
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Jika user ditemukan, langsung lempar ke dashboard
        router.push('/');
      } else {
        // Jika tidak ada user, matikan loading dan tampilkan form login
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);
  

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      // Set persistence agar login tetap awet saat browser ditutup
      await setPersistence(auth, browserLocalPersistence);
      
      // MENGGUNAKAN POPUP (Solusi Anti-Blokir Cookies)
      await signInWithPopup(auth, googleProvider);
      
      // Jika berhasil, onAuthStateChanged di useEffect akan mendeteksi user baru
      // dan otomatis me-redirect ke dashboard.
      // Atau bisa juga manual di sini: router.push('/');
      
    } catch (error: any) {
      console.error("Error starting Google Sign-In:", error);
      
      // Handle error spesifik popup ditutup user
      if (error.code === 'auth/popup-closed-by-user') {
        toast({
            title: 'Login Dibatalkan',
            description: 'Anda menutup jendela login sebelum selesai.',
            variant: 'default',
        });
      } else {
        toast({
            title: 'Gagal Login',
            description: error.message || 'Terjadi kesalahan saat mencoba login.',
            variant: 'destructive',
        });
      }
      
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
                Signing in...
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