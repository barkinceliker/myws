
"use client";

import type { FormEvent } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuth, signInWithEmailAndPassword, type AuthError } from 'firebase/auth';
import { app } from '@/lib/firebase'; // Firebase app instance'ını içe aktarın
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Aperture, LogIn } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // app'in başlatıldığından emin olduktan sonra auth'ı alın
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
      console.error("Firebase giriş hatası:", authError);
      let errorMessage = 'Giriş sırasında bir hata oluştu. Lütfen bilgilerinizi kontrol edin ve tekrar deneyin.';
      if (authError.code === 'auth/user-not-found' || authError.code === 'auth/wrong-password' || authError.code === 'auth/invalid-credential') {
        errorMessage = 'E-posta veya şifre hatalı.';
      } else if (authError.code === 'auth/invalid-email') {
        errorMessage = 'Geçersiz e-posta formatı.';
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
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mb-6">
            <Aperture className="h-12 w-12 text-primary mx-auto" />
          </Link>
          <CardTitle className="font-headline text-3xl text-primary">Admin Paneli Girişi</CardTitle>
          <CardDescription className="text-muted-foreground pt-1">
            Lütfen devam etmek için giriş yapın.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="text-base"
              />
            </div>
            <Button type="submit" className="w-full text-lg py-3" disabled={isLoading}>
              {isLoading ? 'Giriş Yapılıyor...' : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Giriş Yap
                </>
              )}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Button variant="link" asChild>
              <Link href="/">Ana Sayfaya Dön</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
