
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
import type { ProjectFormData } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from 'lucide-react';

export default function ManageProjectsPage() {
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
  const [accordionValue, setAccordionValue] = useState<string | undefined>(undefined);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    console.log('Project data submitted:', formData);

    toast({
      title: "Proje Gönderildi (Simülasyon)",
      description: "Proje verileri konsola yazdırıldı. Veritabanı entegrasyonu sonraki adımda eklenecektir.",
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setFormData({ // Formu sıfırla
        title: '',
        description: '',
        imageUrl: '',
        imageHint: '',
        tags: '',
        liveDemoUrl: '',
        repoUrl: '',
    });
    setIsLoading(false);
    setAccordionValue(undefined); // Accordion'ı kapat
    router.refresh(); // Sayfayı yenileyerek listeyi (ileride) güncelle
  };

  return (
    <>
      <PageHeader
        title="Projeleri Yönet"
        description="Mevcut projelerinizi görüntüleyin, düzenleyin veya yenilerini ekleyin."
      />
      <div className="container py-8">
        <Accordion type="single" collapsible value={accordionValue} onValueChange={setAccordionValue} className="mb-8">
          <AccordionItem value="add-project">
            <AccordionTrigger>
              <div className="flex items-center text-lg font-medium">
                <PlusCircle className="mr-2 h-5 w-5" /> Yeni Proje Ekle
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="shadow-lg mt-4">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Yeni Proje Detayları</CardTitle>
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
                  <CardFooter className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setAccordionValue(undefined)} disabled={isLoading}>
                      Vazgeç
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Kaydediliyor...' : 'Projeyi Kaydet'}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="p-8 border rounded-lg shadow-sm bg-card">
          <p className="text-center text-muted-foreground">
            Proje listesi burada görünecektir. Mevcut projeleri düzenleyebilir veya silebilirsiniz.
            Bu özellik yakında eklenecektir.
          </p>
        </div>
      </div>
    </>
  );
}
