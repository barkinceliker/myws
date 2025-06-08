
"use client";

import type { ChangeEvent, FormEvent } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';
import type { HomeContentFormData, HomeContent } from '@/types';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // If needed for some fields
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, ArrowLeft, ArrowRight, Settings } from 'lucide-react';

const DOCUMENT_ID = "main"; // Fixed ID for the single home content document

const initialFormData: HomeContentFormData = {
  heroTitle: '',
  heroSubtitle: '',
  heroCtaButtonText: 'View My Work',
  heroCtaLink: '#projects',
  heroSecondaryButtonText: 'Learn More About Me',
  heroSecondaryLink: '#about',
  exploreTitle: 'Explore My World',
  exploreAboutTitle: 'About Me',
  exploreAboutDescription: "Dive into my background, passions, and the story behind my work.",
  exploreProjectsTitle: 'Projects',
  exploreProjectsDescription: "Explore a curated selection of projects I've built and contributed to.",
  exploreBlogTitle: 'Blog',
  exploreBlogDescription: "Read my thoughts on technology, design, and creative endeavors.",
  ctaTitle: 'Ready to Collaborate?',
  ctaSubtitle: "I'm always excited to discuss new projects and opportunities. Let's connect!",
  ctaButtonText: 'Get In Touch',
  ctaButtonLink: 'mailto:your-email@example.com', // Placeholder
};

export default function AdminHomeContentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const db = getFirestore(app);
  const auth = getAuth(app);

  const [formData, setFormData] = useState<HomeContentFormData>(initialFormData);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchHomeContent = useCallback(async () => {
    setIsLoadingData(true);
    if (!auth.currentUser) {
      console.error("Attempted to fetch home content without an authenticated user.");
      // toast({ title: 'Yetkilendirme Hatası', description: 'İçerik yüklemek için giriş yapmış olmalısınız.', variant: 'destructive' });
      setIsLoadingData(false);
      return;
    }
    try {
      const docRef = doc(db, 'homeContent', DOCUMENT_ID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormData(docSnap.data() as HomeContentFormData);
      } else {
        // Optional: Initialize with default if not found, or leave as initialFormData
        console.log("No home content document found, using initial default data.");
      }
    } catch (error) {
      console.error("Error fetching home content: ", error);
      toast({ title: 'Hata', description: 'Ana sayfa içeriği yüklenirken bir sorun oluştu.', variant: 'destructive' });
    } finally {
      setIsLoadingData(false);
    }
  }, [auth, db, toast]);

  useEffect(() => {
    if (auth.currentUser) {
      fetchHomeContent();
    } else {
      // Delay fetching if auth state is not yet ready
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
          fetchHomeContent();
        } else {
          setIsLoadingData(false);
           // Consider redirecting to login or showing a message
          console.warn('AdminHomeContentPage - No user authenticated.');
        }
      });
      return () => unsubscribe();
    }
  }, [auth, fetchHomeContent]);


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!auth.currentUser) {
      toast({ title: 'Yetkilendirme Hatası', description: 'İşlem yapmak için giriş yapmış olmalısınız.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);

    try {
      const docRef = doc(db, 'homeContent', DOCUMENT_ID);
      await setDoc(docRef, {
        ...formData,
        updatedAt: serverTimestamp(),
      }, { merge: true }); // Use merge: true to avoid overwriting fields not in formData if any
      toast({ title: 'Başarılı!', description: 'Ana sayfa içeriği başarıyla güncellendi.' });
      fetchHomeContent(); // Re-fetch to confirm
    } catch (error) {
      console.error("Error saving home content: ", error);
      toast({ title: 'Hata', description: 'İçerik kaydedilirken bir sorun oluştu.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formSections = [
    {
      title: "Hero Bölümü",
      fields: [
        { name: "heroTitle", label: "Ana Başlık", type: "text" },
        { name: "heroSubtitle", label: "Alt Başlık", type: "textarea", rows: 2 },
        { name: "heroCtaButtonText", label: "Birincil Buton Metni", type: "text" },
        { name: "heroCtaLink", label: "Birincil Buton Bağlantısı", type: "text" },
        { name: "heroSecondaryButtonText", label: "İkincil Buton Metni", type: "text" },
        { name: "heroSecondaryLink", label: "İkincil Buton Bağlantısı", type: "text" },
      ]
    },
    {
      title: "Keşfet Bölümü",
      fields: [
        { name: "exploreTitle", label: "Keşfet Başlığı", type: "text" },
        { name: "exploreAboutTitle", label: "Hakkımda Kart Başlığı", type: "text" },
        { name: "exploreAboutDescription", label: "Hakkımda Kart Açıklaması", type: "textarea", rows: 2 },
        { name: "exploreProjectsTitle", label: "Projeler Kart Başlığı", type: "text" },
        { name: "exploreProjectsDescription", label: "Projeler Kart Açıklaması", type: "textarea", rows: 2 },
        { name: "exploreBlogTitle", label: "Blog Kart Başlığı", type: "text" },
        { name: "exploreBlogDescription", label: "Blog Kart Açıklaması", type: "textarea", rows: 2 },
      ]
    },
    {
      title: "Eyleme Çağrı (CTA) Bölümü",
      fields: [
        { name: "ctaTitle", label: "CTA Başlığı", type: "text" },
        { name: "ctaSubtitle", label: "CTA Alt Başlığı", type: "textarea", rows: 2 },
        { name: "ctaButtonText", label: "CTA Buton Metni", type: "text" },
        { name: "ctaButtonLink", label: "CTA Buton Bağlantısı", type: "text" },
      ]
    }
  ];


  if (isLoadingData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-muted-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Ana sayfa içeriği yükleniyor...</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Ana Sayfa İçerik Yönetimi"
        description="Ana sayfanızdaki metinleri ve temel bağlantıları buradan düzenleyebilirsiniz."
        className="bg-secondary/80 shadow-md"
      />
      <div className="container py-8">
        <div className="flex justify-start gap-2 mb-8">
          <Button variant="outline" onClick={() => router.back()} aria-label="Geri" className="shadow-sm hover:shadow-md transition-shadow">
            <ArrowLeft className="mr-2 h-4 w-4" /> Geri
          </Button>
          <Button variant="outline" onClick={() => router.forward()} aria-label="İleri" className="shadow-sm hover:shadow-md transition-shadow">
            İleri <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <Card className="shadow-xl border rounded-lg">
          <CardHeader className="border-b">
            <CardTitle className="font-headline text-2xl text-primary flex items-center">
              <Settings size={28} className="mr-3 text-accent"/>
              Ana Sayfa Ayarları
            </CardTitle>
            <CardDescription>
              Bu formdaki değişiklikler ana sayfanızın çeşitli bölümlerini güncelleyecektir.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="p-6 space-y-8">
              {formSections.map(section => (
                <div key={section.title} className="space-y-6 p-6 border rounded-lg shadow-sm bg-card/50">
                  <h3 className="font-headline text-xl text-primary border-b pb-2 mb-4">{section.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {section.fields.map(field => (
                      <div key={field.name} className={`space-y-2 ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}>
                        <Label htmlFor={field.name} className="text-sm font-medium text-foreground/90">{field.label}</Label>
                        {field.type === 'textarea' ? (
                          <Textarea 
                            id={field.name} 
                            name={field.name} 
                            value={formData[field.name as keyof HomeContentFormData] || ''} 
                            onChange={handleChange} 
                            rows={field.rows || 3}
                            className="shadow-sm"
                          />
                        ) : (
                          <Input 
                            id={field.name} 
                            name={field.name} 
                            type={field.type} 
                            value={formData[field.name as keyof HomeContentFormData] || ''} 
                            onChange={handleChange} 
                            className="shadow-sm"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="border-t p-6 flex justify-end">
              <Button type="submit" disabled={isSubmitting || isLoadingData} className="shadow-md hover:shadow-lg transition-shadow min-w-[150px]">
                {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-5 w-5" />}
                Değişiklikleri Kaydet
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}
