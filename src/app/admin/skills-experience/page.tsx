
"use client";

import type { ChangeEvent, FormEvent } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';
import type { SkillExperience, SkillExperienceFormData } from '@/types';
import { PageHeader } from '@/components/page-header';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, PlusCircle, Trash2, Edit, Award, Briefcase, ArrowLeft, Star, Building } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const initialFormData: SkillExperienceFormData = {
  name: '',
  type: 'skill', // Default type
  category: '',
  level: 'Intermediate', // Default level for skill type
  company: '',
  role: '',
  dateRange: '',
  description: '',
  details: [],
};

export default function AdminSkillsExperiencePage() {
  const router = useRouter();
  const { toast } = useToast();
  const db = getFirestore(app);
  const auth = getAuth(app);

  const [formData, setFormData] = useState<SkillExperienceFormData>(initialFormData);
  const [items, setItems] = useState<SkillExperience[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [accordionValue, setAccordionValue] = useState<string | undefined>(undefined);

  const fetchItems = useCallback(async () => {
    setIsLoadingData(true);
     if (!auth.currentUser) {
        console.warn("AdminSkillsExperiencePage: Attempted to fetch skills/experience without an authenticated user.");
        setIsLoadingData(false);
        return;
    }
    try {
      const itemsCollection = collection(db, 'skillsExperience');
      const q = query(itemsCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const itemsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        details: Array.isArray(doc.data().details) ? doc.data().details : [], // Ensure details is an array
        createdAt: doc.data().createdAt as Timestamp,
      })) as SkillExperience[];
      setItems(itemsData);
    } catch (error) {
      console.error("Error fetching items: ", error);
      toast({ title: 'Hata', description: 'Beceriler/Deneyimler yüklenirken bir sorun oluştu.', variant: 'destructive' });
    } finally {
      setIsLoadingData(false);
    }
  }, [auth, db, toast]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchItems();
      } else {
        setIsLoadingData(false);
        setItems([]);
        console.warn("AdminSkillsExperiencePage: No user authenticated. Data fetching aborted.");
      }
    });
    return () => unsubscribe();
  }, [auth, fetchItems]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handles changes from Select components
  const handleSelectChange = (name: keyof SkillExperienceFormData, value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      [name]: value,
      // Reset fields specific to the other type when type changes
      ...(name === 'type' && value === 'skill' && { company: '', role: '', dateRange: '' }),
      ...(name === 'type' && value === 'experience' && { category: '', level: undefined }),
    }));
  };
  
  const handleDetailsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    // Split textarea value by new lines to create an array of strings
    const detailsArray = e.target.value.split('\n').map(detail => detail.trim()).filter(detail => detail !== '');
    setFormData(prev => ({ ...prev, details: detailsArray }));
  };


  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
     if (!auth.currentUser) {
        console.error("Attempted to submit skill/experience without an authenticated user.");
        toast({ title: 'Yetkilendirme Hatası', description: 'İşlem yapmak için giriş yapmış olmalısınız.', variant: 'destructive' });
        return;
    }
    if (!formData.name || !formData.description) {
      toast({ title: 'Eksik Bilgi', description: 'Lütfen Ad ve Açıklama alanlarını doldurun.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);

    // Prepare data by removing fields not relevant to the selected type
    const dataToSave: Partial<SkillExperienceFormData> = { ...formData };
    if (formData.type === 'skill') {
      delete dataToSave.company;
      delete dataToSave.role;
      delete dataToSave.dateRange;
    } else { // type === 'experience'
      delete dataToSave.category;
      delete dataToSave.level;
    }


    try {
      if (editingItemId) {
        const itemRef = doc(db, 'skillsExperience', editingItemId);
        await updateDoc(itemRef, {
          ...dataToSave,
          updatedAt: serverTimestamp(),
        });
        toast({ title: 'Başarılı!', description: 'Kayıt başarıyla güncellendi.' });
      } else {
        await addDoc(collection(db, 'skillsExperience'), {
          ...dataToSave,
          createdAt: serverTimestamp(),
        });
        toast({ title: 'Başarılı!', description: 'Yeni kayıt başarıyla eklendi.' });
      }
      setFormData(initialFormData);
      setEditingItemId(null);
      fetchItems();
      setAccordionValue(undefined);
    } catch (error) {
      console.error("Error saving item: ", error);
      toast({ title: 'Hata', description: 'Kayıt kaydedilirken bir sorun oluştu.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: SkillExperience) => {
    setFormData({ // Populate form with item data
      name: item.name,
      type: item.type,
      category: item.category || '', // Ensure category is not undefined
      level: item.level || 'Intermediate', // Default if undefined
      company: item.company || '',
      role: item.role || '',
      dateRange: item.dateRange || '',
      description: item.description,
      details: item.details || [], // Ensure details is an array
    });
    setEditingItemId(item.id);
    setAccordionValue("add-item");
  };

  const handleDelete = async (itemId: string) => {
     if (!auth.currentUser) {
        console.error("Attempted to delete skill/experience without an authenticated user.");
        toast({ title: 'Yetkilendirme Hatası', description: 'İşlem yapmak için giriş yapmış olmalısınız.', variant: 'destructive' });
        return;
    }
    setIsSubmitting(true);
    try {
      await deleteDoc(doc(db, 'skillsExperience', itemId));
      toast({ title: 'Başarılı!', description: 'Kayıt başarıyla silindi.' });
      fetchItems();
    } catch (error) {
      console.error("Error deleting item: ", error);
      toast({ title: 'Hata', description: 'Kayıt silinirken bir sorun oluştu.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData(initialFormData);
    setEditingItemId(null);
    setAccordionValue(undefined);
  }

  return (
    <>
      <PageHeader
        title="Beceri & Deneyim Yönetimi"
        description="Becerilerinizi ve profesyonel deneyimlerinizi buradan yönetin."
        className="bg-secondary/80 shadow-md"
      />
      <div className="container py-8">
        <div className="flex justify-start gap-2 mb-8">
          <Button variant="outline" onClick={() => router.back()} aria-label="Geri" className="shadow-sm hover:shadow-md transition-shadow">
            <ArrowLeft className="mr-2 h-4 w-4" /> Geri
          </Button>
        </div>
        <Accordion type="single" collapsible className="w-full mb-10 bg-card p-4 sm:p-6 rounded-lg shadow-xl border" value={accordionValue} onValueChange={setAccordionValue}>
          <AccordionItem value="add-item" className="border-b-0">
            <AccordionTrigger className="text-xl font-headline text-primary hover:no-underline data-[state=open]:pb-4 data-[state=closed]:pb-0">
             <div className="flex items-center">
                <PlusCircle className="mr-3 h-6 w-6 text-accent" />
                {editingItemId ? 'Kaydı Düzenle' : 'Yeni Kayıt Ekle'}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-6 border-t border-border/70">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="type" className="text-sm font-medium text-foreground/90">Tür</Label>
                        <Select name="type" value={formData.type} onValueChange={(value) => handleSelectChange('type', value as 'skill' | 'experience')}>
                            <SelectTrigger className="shadow-sm focus:ring-primary focus:border-primary">
                            <SelectValue placeholder="Tür seçin" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="skill">Beceri</SelectItem>
                            <SelectItem value="experience">Deneyim</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-foreground/90">{formData.type === 'skill' ? 'Beceri Adı' : 'Deneyim/Şirket Adı'}</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="shadow-sm focus:ring-primary focus:border-primary"/>
                    </div>
                </div>

                {formData.type === 'skill' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                        <Label htmlFor="category" className="text-sm font-medium text-foreground/90">Kategori</Label>
                        <Input id="category" name="category" value={formData.category} onChange={handleChange} placeholder="Örn: Frontend" className="shadow-sm focus:ring-primary focus:border-primary"/>
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="level" className="text-sm font-medium text-foreground/90">Seviye</Label>
                        <Select name="level" value={formData.level} onValueChange={(value) => handleSelectChange('level', value as SkillExperienceFormData['level'])}>
                            <SelectTrigger className="shadow-sm focus:ring-primary focus:border-primary">
                            <SelectValue placeholder="Seviye seçin" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="Beginner">Başlangıç</SelectItem>
                            <SelectItem value="Intermediate">Orta</SelectItem>
                            <SelectItem value="Advanced">İleri</SelectItem>
                            <SelectItem value="Expert">Uzman</SelectItem>
                            </SelectContent>
                        </Select>
                        </div>
                    </div>
                  </>
                )}

                {formData.type === 'experience' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                        <Label htmlFor="company" className="text-sm font-medium text-foreground/90">Şirket/Kurum</Label>
                        <Input id="company" name="company" value={formData.company} onChange={handleChange} className="shadow-sm focus:ring-primary focus:border-primary"/>
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="role" className="text-sm font-medium text-foreground/90">Pozisyon/Rol</Label>
                        <Input id="role" name="role" value={formData.role} onChange={handleChange} className="shadow-sm focus:ring-primary focus:border-primary"/>
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="dateRange" className="text-sm font-medium text-foreground/90">Tarih Aralığı</Label>
                        <Input id="dateRange" name="dateRange" value={formData.dateRange} onChange={handleChange} placeholder="Örn: Ocak 2020 - Halen" className="shadow-sm focus:ring-primary focus:border-primary"/>
                        </div>
                    </div>
                  </>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-foreground/90">{formData.type === 'skill' ? 'Beceri Açıklaması' : 'Deneyim Açıklaması'}</Label>
                  <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} required className="shadow-sm focus:ring-primary focus:border-primary"/>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="details" className="text-sm font-medium text-foreground/90">{formData.type === 'skill' ? 'Ek Detaylar (her satır yeni madde)' : 'Sorumluluklar/Notlar (her satır yeni madde)'}</Label>
                  <Textarea id="details" name="details" value={Array.isArray(formData.details) ? formData.details.join('\n') : ''} onChange={handleDetailsChange} rows={5} placeholder="Her bir detayı yeni bir satıra yazın." className="shadow-sm focus:ring-primary focus:border-primary"/>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={isSubmitting} className="shadow-md hover:shadow-lg transition-shadow min-w-[180px]">
                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : (editingItemId ? 'Kaydı Güncelle' : 'Yeni Kayıt Ekle')}
                  </Button>
                  {editingItemId && (
                    <Button type="button" variant="outline" onClick={handleCancelEdit} disabled={isSubmitting} className="shadow-md hover:shadow-lg transition-shadow">
                      İptal Et
                    </Button>
                  )}
                </div>
              </form>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex items-center justify-between mb-8 border-b border-border/70 pb-4">
            <h2 className="font-headline text-3xl font-semibold text-primary flex items-center">
                {formData.type === 'skill' ? <Star size={32} className="mr-3 text-accent"/> : <Building size={32} className="mr-3 text-accent"/>}
                Mevcut Kayıtlar
            </h2>
        </div>
        {isLoadingData ? (
          <div className="flex flex-col justify-center items-center h-60 text-muted-foreground">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg">Kayıtlar yükleniyor, lütfen bekleyin...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 bg-card border rounded-lg shadow-md">
             {formData.type === 'skill' ?  <Star size={64} className="mx-auto text-muted-foreground opacity-50 mb-4" /> :  <Building size={64} className="mx-auto text-muted-foreground opacity-50 mb-4" /> }
            <p className="text-xl text-muted-foreground">Henüz eklenmiş beceri veya deneyim bulunmuyor.</p>
             <p className="text-sm text-muted-foreground mt-2">Yukarıdaki bölümden yeni bir kayıt ekleyebilirsiniz.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
            {items.map((item) => (
              <Card key={item.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 border rounded-lg bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="font-headline text-xl text-primary flex items-center">
                      {item.type === 'skill' ? <Award className="mr-2.5 h-6 w-6 text-accent" /> : <Briefcase className="mr-2.5 h-6 w-6 text-accent" />}
                      {item.name}
                    </CardTitle>
                    <Badge variant={item.type === 'skill' ? 'default' : 'secondary'} className="text-xs py-1 px-2.5 shadow-sm">{item.type === 'skill' ? 'Beceri' : 'Deneyim'}</Badge>
                  </div>
                  <CardDescription className="text-xs text-muted-foreground">
                    {item.type === 'skill' && `Kategori: ${item.category || 'Belirtilmemiş'} | Seviye: ${item.level || 'Belirtilmemiş'}`}
                    {item.type === 'experience' && `${item.role || 'Pozisyon Belirtilmemiş'} @ ${item.company || 'Şirket Belirtilmemiş'} (${item.dateRange || 'Tarih Aralığı Yok'})`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-3 pt-0 pb-4">
                  <div>
                    <p className="text-sm font-medium text-foreground/90 mb-1">Açıklama:</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                  {item.details && item.details.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-foreground/90 mb-1">{item.type === 'skill' ? 'Detaylar:' : 'Sorumluluklar/Notlar:'}</p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-1">
                        {item.details.map((detail, index) => <li key={index}>{detail}</li>)}
                      </ul>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t border-border/70 pt-4 pb-4 px-5 mt-auto">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(item)} disabled={isSubmitting} className="shadow-sm hover:shadow-md transition-all hover:border-primary text-primary hover:text-primary">
                    <Edit className="mr-1.5 h-4 w-4" /> Düzenle
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" disabled={isSubmitting} className="shadow-sm hover:shadow-md transition-all">
                        <Trash2 className="mr-1.5 h-4 w-4" /> Sil
                      </Button>
                    </AlertDialogTrigger>
                     <AlertDialogContent className="border shadow-xl rounded-lg bg-card">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="font-headline text-xl text-destructive">Emin misiniz?</AlertDialogTitle>
                            <AlertDialogDescription className="text-muted-foreground">
                            Bu işlem geri alınamaz. &quot;{item.name}&quot; adlı kaydı kalıcı olarak silmek istediğinizden emin misiniz?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-4">
                            <AlertDialogCancel disabled={isSubmitting} className="shadow-sm hover:shadow-md">İptal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(item.id)} disabled={isSubmitting} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-sm hover:shadow-md">
                            {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : 'Evet, Kalıcı Olarak Sil'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                        </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
