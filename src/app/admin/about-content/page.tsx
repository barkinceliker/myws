
"use client";

import type { ChangeEvent, FormEvent } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';
import type { AboutContentFormData, CoreValueFormData } from '@/types';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, ArrowLeft, ArrowRight, UserCircle, PlusCircle, Trash2, Award, Target, Users } from 'lucide-react'; // Added Award, Target, Users

const DOCUMENT_ID = "main"; // Fixed ID for the single about content document

const initialCoreValues: CoreValueFormData[] = [
  { title: 'Excellence', description: 'Striving for the highest quality in everything I do, paying attention to detail and delivering outstanding results.' },
  { title: 'Innovation', description: 'Constantly seeking new ideas and creative solutions to solve complex problems and drive progress.' },
  { title: 'Collaboration', description: 'Believing in the power of teamwork and fostering an environment of open communication and mutual respect.' },
];

const initialFormData: AboutContentFormData = {
  pageTitle: 'About Me',
  pageDescription: 'A glimpse into my journey, aspirations, and what drives me.',
  portraitImageUrl: 'https://placehold.co/600x600.png',
  portraitImageHint: 'professional portrait',
  greetingName: '[Your Name]',
  profession: '[Your Profession/Title]',
  keySkill1: '[Key Skill 1]',
  keySkill2: '[Key Skill 2]',
  keySkill3: '[Key Skill 3]',
  bioIntro: "My journey into the world of [Your Field] began with a fascination for [Initial Spark/Interest], and since then, I've been dedicated to crafting innovative solutions and pushing creative boundaries.",
  bioCollaboration: "I thrive in collaborative environments and believe that the best work comes from diverse perspectives and shared enthusiasm. My approach is rooted in continuous learning and a commitment to excellence, always striving to deliver impactful and meaningful outcomes.",
  bioPersonal: "Beyond my professional pursuits, I'm an avid [Hobby 1], enjoy [Hobby 2], and am always on the lookout for new challenges and opportunities to grow, both personally and professionally.",
  coreValuesTitle: 'My Core Values',
  coreValues: initialCoreValues,
};

export default function AdminAboutContentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const db = getFirestore(app);
  const auth = getAuth(app);

  const [formData, setFormData] = useState<AboutContentFormData>(initialFormData);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAboutContent = useCallback(async () => {
    setIsLoadingData(true);
    if (!auth.currentUser) {
      console.error("Attempted to fetch about content without an authenticated user.");
      setIsLoadingData(false);
      return;
    }
    try {
      const docRef = doc(db, 'aboutContent', DOCUMENT_ID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as AboutContentFormData;
        // Ensure coreValues is an array, otherwise use initial default
        setFormData({ ...initialFormData, ...data, coreValues: Array.isArray(data.coreValues) && data.coreValues.length > 0 ? data.coreValues : initialCoreValues });
      } else {
        console.log("No about content document found, using initial default data.");
        setFormData(initialFormData); // Ensure coreValues are set
      }
    } catch (error) {
      console.error("Error fetching about content: ", error);
      toast({ title: 'Hata', description: 'Hakkımda sayfası içeriği yüklenirken bir sorun oluştu.', variant: 'destructive' });
    } finally {
      setIsLoadingData(false);
    }
  }, [auth, db, toast]);

  useEffect(() => {
     if (auth.currentUser) {
      fetchAboutContent();
    } else {
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
          fetchAboutContent();
        } else {
          setIsLoadingData(false);
          console.warn('AdminAboutContentPage - No user authenticated.');
        }
      });
      return () => unsubscribe();
    }
  }, [auth, fetchAboutContent]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCoreValueChange = (index: number, field: keyof CoreValueFormData, value: string) => {
    const updatedCoreValues = formData.coreValues.map((cv, i) => 
      i === index ? { ...cv, [field]: value } : cv
    );
    setFormData(prev => ({ ...prev, coreValues: updatedCoreValues }));
  };

  const addCoreValue = () => {
    setFormData(prev => ({
      ...prev,
      coreValues: [...prev.coreValues, { title: '', description: '' }]
    }));
  };

  const removeCoreValue = (index: number) => {
    setFormData(prev => ({
      ...prev,
      coreValues: prev.coreValues.filter((_, i) => i !== index)
    }));
  };


  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!auth.currentUser) {
      toast({ title: 'Yetkilendirme Hatası', description: 'İşlem yapmak için giriş yapmış olmalısınız.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);

    try {
      const docRef = doc(db, 'aboutContent', DOCUMENT_ID);
      await setDoc(docRef, {
        ...formData,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      toast({ title: 'Başarılı!', description: 'Hakkımda sayfası içeriği başarıyla güncellendi.' });
    } catch (error) {
      console.error("Error saving about content: ", error);
      toast({ title: 'Hata', description: 'İçerik kaydedilirken bir sorun oluştu.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-muted-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Hakkımda içeriği yükleniyor...</p>
      </div>
    );
  }
  
  const coreValueIcons = [Award, Target, Users]; // For matching with existing display

  return (
    <>
      <PageHeader
        title="Hakkımda Sayfası İçerik Yönetimi"
        description="Kişisel bilgilerinizi, biyografinizi ve temel değerlerinizi buradan düzenleyebilirsiniz."
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
              <UserCircle size={28} className="mr-3 text-accent"/>
              Hakkımda Sayfası Ayarları
            </CardTitle>
             <CardDescription>
              Bu formdaki değişiklikler hakkımda sayfanızın içeriğini güncelleyecektir.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="p-6 space-y-8">
              {/* General Info Section */}
              <div className="space-y-6 p-6 border rounded-lg shadow-sm bg-card/50">
                <h3 className="font-headline text-xl text-primary border-b pb-2 mb-4">Genel Bilgiler & Portre</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><Label htmlFor="pageTitle">Sayfa Başlığı</Label><Input id="pageTitle" name="pageTitle" value={formData.pageTitle} onChange={handleChange} /></div>
                  <div className="md:col-span-2"><Label htmlFor="pageDescription">Sayfa Açıklaması</Label><Textarea id="pageDescription" name="pageDescription" value={formData.pageDescription} onChange={handleChange} rows={2}/></div>
                  <div><Label htmlFor="portraitImageUrl">Portre Resim URL</Label><Input id="portraitImageUrl" name="portraitImageUrl" type="url" value={formData.portraitImageUrl} onChange={handleChange} /></div>
                  <div><Label htmlFor="portraitImageHint">Portre Resim İpucu (AI için)</Label><Input id="portraitImageHint" name="portraitImageHint" value={formData.portraitImageHint} onChange={handleChange} /></div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="space-y-6 p-6 border rounded-lg shadow-sm bg-card/50">
                <h3 className="font-headline text-xl text-primary border-b pb-2 mb-4">Biyografi Metinleri</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><Label htmlFor="greetingName">Selamlama Adı (Örn: John Doe)</Label><Input id="greetingName" name="greetingName" value={formData.greetingName} onChange={handleChange}/></div>
                    <div><Label htmlFor="profession">Meslek/Ünvan</Label><Input id="profession" name="profession" value={formData.profession} onChange={handleChange}/></div>
                    <div><Label htmlFor="keySkill1">Anahtar Beceri 1</Label><Input id="keySkill1" name="keySkill1" value={formData.keySkill1} onChange={handleChange}/></div>
                    <div><Label htmlFor="keySkill2">Anahtar Beceri 2</Label><Input id="keySkill2" name="keySkill2" value={formData.keySkill2} onChange={handleChange}/></div>
                    <div><Label htmlFor="keySkill3">Anahtar Beceri 3</Label><Input id="keySkill3" name="keySkill3" value={formData.keySkill3} onChange={handleChange}/></div>
                 </div>
                <div><Label htmlFor="bioIntro">Giriş Paragrafı</Label><Textarea id="bioIntro" name="bioIntro" value={formData.bioIntro} onChange={handleChange} rows={4}/></div>
                <div><Label htmlFor="bioCollaboration">İşbirliği & Yaklaşım Paragrafı</Label><Textarea id="bioCollaboration" name="bioCollaboration" value={formData.bioCollaboration} onChange={handleChange} rows={4}/></div>
                <div><Label htmlFor="bioPersonal">Kişisel İlgi Alanları Paragrafı</Label><Textarea id="bioPersonal" name="bioPersonal" value={formData.bioPersonal} onChange={handleChange} rows={3}/></div>
              </div>

              {/* Core Values Section */}
              <div className="space-y-6 p-6 border rounded-lg shadow-sm bg-card/50">
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h3 className="font-headline text-xl text-primary">{formData.coreValuesTitle || "Temel Değerler"}</h3>
                    <Input id="coreValuesTitle" name="coreValuesTitle" value={formData.coreValuesTitle} onChange={handleChange} placeholder="Bölüm Başlığı" className="w-1/2 text-sm"/>
                </div>
                {formData.coreValues.map((value, index) => {
                  const IconComponent = coreValueIcons[index % coreValueIcons.length]; // Cycle through icons
                  return (
                    <div key={index} className="space-y-3 p-4 border rounded-md relative bg-background/70 shadow-inner">
                        <div className="flex items-center mb-2">
                            <IconComponent className="h-6 w-6 text-accent mr-3" />
                            <Label htmlFor={`coreValueTitle-${index}`} className="text-base font-semibold">Değer #{index + 1}</Label>
                        </div>
                        <Input 
                            id={`coreValueTitle-${index}`} 
                            placeholder="Değer Başlığı (Örn: Mükemmellik)" 
                            value={value.title} 
                            onChange={(e) => handleCoreValueChange(index, 'title', e.target.value)}
                            className="text-sm"
                        />
                        <Textarea 
                            id={`coreValueDescription-${index}`} 
                            placeholder="Değer Açıklaması" 
                            value={value.description} 
                            onChange={(e) => handleCoreValueChange(index, 'description', e.target.value)} 
                            rows={3}
                            className="text-sm"
                        />
                         <Button type="button" variant="ghost" size="sm" onClick={() => removeCoreValue(index)} className="absolute top-2 right-2 text-destructive hover:text-destructive/80">
                            <Trash2 size={16}/>
                        </Button>
                    </div>
                  );
                })}
                 <Button type="button" variant="outline" onClick={addCoreValue} className="shadow-sm hover:shadow-md">
                    <PlusCircle size={18} className="mr-2"/> Yeni Değer Ekle
                </Button>
              </div>

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
