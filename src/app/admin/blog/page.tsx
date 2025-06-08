
"use client";

import type { FormEvent } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { BlogPostFormData } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from 'lucide-react';

export default function ManageBlogPage() {
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
  const [accordionValue, setAccordionValue] = useState<string | undefined>(undefined);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
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

    setFormData({ // Formu sıfırla
        slug: '',
        title: '',
        content: '',
        publicationDate: '',
        author: '',
        tags: '',
        imageUrl: '',
        imageHint: '',
    });
    setIsLoading(false);
    setAccordionValue(undefined); // Accordion'ı kapat
    router.refresh(); // Sayfayı yenileyerek listeyi (ileride) güncelle
  };

  return (
    <>
      <PageHeader
        title="Blog Yazılarını Yönet"
        description="Mevcut blog yazılarınızı görüntüleyin, düzenleyin veya yenilerini ekleyin."
      />
      <div className="container py-8">
        <Accordion type="single" collapsible value={accordionValue} onValueChange={setAccordionValue} className="mb-8">
          <AccordionItem value="add-blog-post">
            <AccordionTrigger>
              <div className="flex items-center text-lg font-medium">
                <PlusCircle className="mr-2 h-5 w-5" /> Yeni Blog Yazısı Ekle
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="shadow-lg mt-4">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Yeni Blog Yazısı Detayları</CardTitle>
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
                  <CardFooter className="flex justify-end gap-2">
                     <Button type="button" variant="outline" onClick={() => setAccordionValue(undefined)} disabled={isLoading}>
                      Vazgeç
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Kaydediliyor...' : 'Blog Yazısını Kaydet'}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Blog yazısı listeleme alanı buraya gelecek */}
      </div>
    </>
  );
}
