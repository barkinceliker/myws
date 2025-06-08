
"use client";

import type { FormEvent } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProjectFormData } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from 'lucide-react';

export default function AddProjectPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    imageUrl: '',
    imageHint: '',
    tags: '', // Comma-separated
    liveDemoUrl: '',
    repoUrl: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    // Placeholder for actual submission logic
    console.log('Project data submitted:', formData);
    // In a real app, you would send this data to your backend/Firebase

    toast({
      title: "Proje Gönderildi (Simülasyon)",
      description: "Proje verileri konsola yazdırıldı. Veritabanı entegrasyonu sonraki adımda eklenecektir.",
    });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsLoading(false);
    router.push('/admin/projects'); // Redirect to projects list page
  };

  return (
    <>
      <PageHeader title="Yeni Proje Ekle" />
      <div className="container py-8">
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/admin/projects">
              <ArrowLeft className="mr-2 h-4 w-4" /> Proje Listesine Geri Dön
            </Link>
          </Button>
        </div>
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Proje Detayları</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Proje Başlığı</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required disabled={isLoading} rows={4} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Görsel URL'i</Label>
                <Input id="imageUrl" name="imageUrl" type="url" value={formData.imageUrl} onChange={handleChange} required disabled={isLoading} placeholder="https://placehold.co/600x400.png" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageHint">Görsel İpucu (data-ai-hint için)</Label>
                <Input id="imageHint" name="imageHint" value={formData.imageHint} onChange={handleChange} disabled={isLoading} placeholder="örneğin: teknoloji projesi" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Etiketler (virgülle ayırın)</Label>
                <Input id="tags" name="tags" value={formData.tags} onChange={handleChange} required disabled={isLoading} placeholder="Next.js,React,TypeScript" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="liveDemoUrl">Canlı Demo URL'i (isteğe bağlı)</Label>
                <Input id="liveDemoUrl" name="liveDemoUrl" type="url" value={formData.liveDemoUrl} onChange={handleChange} disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="repoUrl">Repository URL'i (isteğe bağlı)</Label>
                <Input id="repoUrl" name="repoUrl" type="url" value={formData.repoUrl} onChange={handleChange} disabled={isLoading} />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Kaydediliyor...' : 'Projeyi Kaydet'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}
