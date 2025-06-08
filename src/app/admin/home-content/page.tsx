
"use client";

import type { ChangeEvent, FormEvent } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';
import type { HomeContentFormData } from '@/types'; // HomeContent arayüzünü kaldırdık, sadece FormData kullanıyoruz
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, ArrowLeft, Settings } from 'lucide-react';

const DOCUMENT_ID = "main"; // Sabit doküman ID'si

// Başlangıç form verileri
const initialFormData: HomeContentFormData = {
  heroTitle: 'Welcome to My Portfolio',
  heroSubtitle: 'Discover my work, skills, and journey in the world of technology.',
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
  ctaButtonLink: 'mailto:your-email@example.com',
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
      console.warn("AdminHomeContentPage - Attempted to fetch home content without an authenticated user.");
      setIsLoadingData(false);
      // toast({ title: 'Yetkilendirme Hatası', description: 'İçerik yüklemek için giriş yapmış olmalısınız.', variant: 'destructive' });
      return;
    }
    try {
      const docRef = doc(db, 'homeContent', DOCUMENT_ID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormData(docSnap.data() as HomeContentFormData);
      } else {
        console.log("No home content document found, using initial default data. Will create if saved.");
        setFormData(initialFormData); // Eğer doküman yoksa başlangıç verilerini kullan
      }
    } catch (error) {
      console.error("Error fetching home content: ", error);
      toast({ title: 'Hata', description: 'Ana sayfa içeriği yüklenirken bir sorun oluştu.', variant: 'destructive' });
    } finally {
      setIsLoadingData(false);
    }
  }, [auth, db, toast]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchHomeContent();
      } else {
        setIsLoadingData(false);
        console.warn('AdminHomeContentPage - No user authenticated. Data fetching aborted.');
      }
    });
    return () => unsubscribe();
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
      await setDoc(docRef, { // setDoc ile belgeyi oluşturur veya üzerine yazar
        ...formData,
        updatedAt: serverTimestamp(),
      }, { merge: true }); // merge:true varolan alanları korur, sadece formdakileri günceller/ekler
      toast({ title: 'Başarılı!', description: 'Ana sayfa içeriği başarıyla güncellendi.' });
    } catch (error) {
      console.error("Error saving home content: ", error);
      toast({ title: 'Hata', description: 'İçerik kaydedilirken bir sorun oluştu.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Form bölümlerini ve alanlarını tanımla
  const formSections = [
    {
      title: "Hero Bölümü",
      fields: [
        { name: "heroTitle", label: "Ana Başlık", type: "text" },
        { name: "heroSubtitle", label: "Alt Başlık", type: "textarea", rows: 2 },
        { name: "heroCtaButtonText", label: "Birincil Buton Metni", type: "text" },
        { name: "heroCtaLink", label: "Birincil Buton Bağlantısı (Örn: /projects veya #about)", type: "text" },
        { name: "heroSecondaryButtonText", label: "İkincil Buton Metni", type: "text" },
        { name: "heroSecondaryLink", label: "İkincil Buton Bağlantısı", type: "text" },
      ]
    },
    {
      title: "Keşfet Bölümü",
      fields: [
        { name: "exploreTitle", label: "Keşfet Bölümü Başlığı", type: "text" },
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
        { name: "ctaButtonLink", label: "CTA Buton Bağlantısı (Örn: mailto:email@example.com veya /contact)", type: "text" },
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
        </div>

        <Card className="shadow-xl border rounded-lg">
          <CardHeader className="border-b bg-slate-50/50">
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
                <div key={section.title} className="space-y-6 p-6 border rounded-lg shadow-sm bg-card/60 backdrop-blur-sm">
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
                            className="shadow-sm focus:ring-primary focus:border-primary"
                          />
                        ) : (
                          <Input 
                            id={field.name} 
                            name={field.name} 
                            type={field.type} 
                            value={formData[field.name as keyof HomeContentFormData] || ''} 
                            onChange={handleChange} 
                            className="shadow-sm focus:ring-primary focus:border-primary"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="border-t p-6 flex justify-end bg-slate-50/50">
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
