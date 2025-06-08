
"use client";

import type { FormEvent } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuth, signInWithEmailAndPassword, type AuthError } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Aperture, LogIn, Loader2, ArrowLeft } from 'lucide-react'; // Added Loader2 and ArrowLeft

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const auth = app ? getAuth(app) : null;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (!auth) {
      toast({
        title: 'Hata',
        description: 'Firebase başlatılamadı. Lütfen daha sonra tekrar deneyin.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    if (!email || !password) {
      toast({
        title: 'Eksik Bilgi',
        description: 'Lütfen e-posta ve şifrenizi girin.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Giriş Başarılı!',
        description: 'Admin paneline yönlendiriliyorsunuz...',
      });
      router.push('/admin/dashboard');
    } catch (error) {
      const authError = error as AuthError;
      console.error("Firebase giriş hatası detayları:", authError); // Keep for detailed debugging

      let errorMessage = 'Giriş sırasında bilinmeyen bir hata oluştu. Lütfen tekrar deneyin.';

      switch (authError.code) {
        case 'auth/invalid-credential':
          errorMessage = 'E-posta adresiniz veya şifreniz hatalı. Lütfen kontrol edin.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Bu kullanıcı hesabı devre dışı bırakılmış.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Girdiğiniz e-posta adresi geçersiz formatta.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Çok fazla başarısız giriş denemesi. Lütfen bir süre sonra tekrar deneyin veya şifrenizi sıfırlamayı deneyin.';
          break;
        default:
          console.error("Diğer Firebase giriş hatası kodu:", authError.code, authError.message);
          errorMessage = 'Giriş sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
      }
      
      toast({
        title: 'Giriş Başarısız',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 pattern-dots pattern-slate-200 pattern-bg-transparent pattern-size-4 dark:pattern-slate-800">
      <Card className="w-full max-w-md shadow-2xl border-border/60 rounded-xl bg-card/95 backdrop-blur-md">
        <CardHeader className="text-center space-y-3 pt-8">
          <Link href="/" className="inline-block mb-2 group">
            <Aperture className="h-14 w-14 text-primary mx-auto transition-transform group-hover:scale-110 duration-300" />
          </Link>
          <CardTitle className="font-headline text-3xl sm:text-4xl text-primary tracking-tight">Admin Paneli Girişi</CardTitle>
          <CardDescription className="text-muted-foreground pt-1 text-sm sm:text-base">
            Lütfen devam etmek için yönetici bilgilerinizi girin.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground/90">E-posta Adresi</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="text-base py-3 px-4 shadow-sm focus:ring-2 focus:ring-primary/80 transition-shadow"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground/90">Şifre</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="text-base py-3 px-4 shadow-sm focus:ring-2 focus:ring-primary/80 transition-shadow"
              />
            </div>
            <Button type="submit" className="w-full text-lg py-6 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Giriş Yapılıyor...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Giriş Yap
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="mt-2 pb-8 flex flex-col items-center">
            <Button variant="link" asChild className="text-sm text-muted-foreground hover:text-primary transition-colors">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Ana Sayfaya Dön
              </Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
