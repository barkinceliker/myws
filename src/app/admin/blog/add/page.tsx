
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
import type { BlogPostFormData } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from 'lucide-react';

export default function AddBlogPostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState<BlogPostFormData>({
    slug: '',
    title: '',
    content: '',
    publicationDate: '',
    author: '',
    tags: '', // Comma-separated
    imageUrl: '',
    imageHint: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Basic slugification: lowercase, replace spaces with hyphens, remove special chars
    const slug = value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    setFormData(prev => ({ ...prev, title: value, slug: slug }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    console.log('Blog post data submitted:', formData);

    toast({
      title: "Blog Yazısı Gönderildi (Simülasyon)",
      description: "Yazı verileri konsola yazdırıldı. Veritabanı entegrasyonu sonraki adımda eklenecektir.",
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsLoading(false);
    router.push('/admin/blog');
  };

  return (
    <>
      <PageHeader title="Yeni Blog Yazısı Ekle" />
      <div className="container py-8">
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/admin/blog">
              <ArrowLeft className="mr-2 h-4 w-4" /> Blog Listesine Geri Dön
            </Link>
          </Button>
        </div>
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Blog Yazısı Detayları</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Başlık</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleSlugChange} required disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL için kısa ad)</Label>
                <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required disabled={isLoading} placeholder="otomatik-olusturulur-veya-manuel" />
                 <p className="text-xs text-muted-foreground">URL'de görünecek benzersiz kısa ad. Genellikle başlığın küçük harfli, tireli halidir.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">İçerik (HTML veya Markdown)</Label>
                <Textarea id="content" name="content" value={formData.content} onChange={handleChange} required disabled={isLoading} rows={10} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="publicationDate">Yayınlanma Tarihi</Label>
                  <Input id="publicationDate" name="publicationDate" type="date" value={formData.publicationDate} onChange={handleChange} required disabled={isLoading} />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="author">Yazar</Label>
                  <Input id="author" name="author" value={formData.author} onChange={handleChange} required disabled={isLoading} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Etiketler (virgülle ayırın)</Label>
                <Input id="tags" name="tags" value={formData.tags} onChange={handleChange} required disabled={isLoading} placeholder="React,Tailwind,NextJS" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Görsel URL'i</Label>
                <Input id="imageUrl" name="imageUrl" type="url" value={formData.imageUrl} onChange={handleChange} required disabled={isLoading} placeholder="https://placehold.co/1200x600.png" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="imageHint">Görsel İpucu (data-ai-hint için)</Label>
                <Input id="imageHint" name="imageHint" value={formData.imageHint} onChange={handleChange} disabled={isLoading} placeholder="örneğin: kod ekranı" />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Kaydediliyor...' : 'Blog Yazısını Kaydet'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}
