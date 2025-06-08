
"use client";

import type { ChangeEvent, FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy, Timestamp } from 'firebase/firestore';
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
import { Loader2, PlusCircle, Trash2, Edit, Award, Briefcase, ArrowLeft, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const initialFormData: SkillExperienceFormData = {
  name: '',
  type: 'skill', 
  category: '',
  level: 'Intermediate',
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

  const [formData, setFormData] = useState<SkillExperienceFormData>(initialFormData);
  const [items, setItems] = useState<SkillExperience[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [accordionValue, setAccordionValue] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setIsLoadingData(true);
    try {
      const itemsCollection = collection(db, 'skillsExperience');
      const q = query(itemsCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const itemsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        details: Array.isArray(doc.data().details) ? doc.data().details : [],
        createdAt: doc.data().createdAt as Timestamp,
      })) as SkillExperience[];
      setItems(itemsData);
    } catch (error) {
      console.error("Error fetching items: ", error);
      toast({ title: 'Hata', description: 'Beceriler/Deneyimler yüklenirken bir sorun oluştu.', variant: 'destructive' });
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof SkillExperienceFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
     if (name === 'type') { 
        if (value === 'skill') {
            setFormData(prev => ({ ...prev, company: '', role: '', dateRange: '', level: 'Intermediate' }));
        } else { 
            setFormData(prev => ({ ...prev, category: '', level: undefined }));
        }
    }
  };
  
  const handleDetailsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const detailsArray = e.target.value.split('\n').map(detail => detail.trim()).filter(detail => detail !== '');
    setFormData(prev => ({ ...prev, details: detailsArray }));
  };


  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!formData.name || !formData.description) {
      toast({ title: 'Eksik Bilgi', description: 'Lütfen Ad ve Açıklama alanlarını doldurun.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);

    const dataToSave: Partial<SkillExperienceFormData> = { ...formData };
    if (formData.type === 'skill') {
      delete dataToSave.company;
      delete dataToSave.role;
      delete dataToSave.dateRange;
    } else { 
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
        toast({ title: 'Başarılı!', description: 'Beceri/Deneyim başarıyla güncellendi.' });
      } else {
        await addDoc(collection(db, 'skillsExperience'), {
          ...dataToSave,
          createdAt: serverTimestamp(),
        });
        toast({ title: 'Başarılı!', description: 'Yeni beceri/deneyim başarıyla eklendi.' });
      }
      setFormData(initialFormData);
      setEditingItemId(null);
      fetchItems();
      setAccordionValue(undefined);
    } catch (error) {
      console.error("Error saving item: ", error);
      toast({ title: 'Hata', description: 'Beceri/Deneyim kaydedilirken bir sorun oluştu.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: SkillExperience) => {
    setFormData({
      name: item.name,
      type: item.type,
      category: item.category || '',
      level: item.level || 'Intermediate',
      company: item.company || '',
      role: item.role || '',
      dateRange: item.dateRange || '',
      description: item.description,
      details: item.details || [],
    });
    setEditingItemId(item.id);
    setAccordionValue("add-item");
  };

  const handleDelete = async (itemId: string) => {
    setIsSubmitting(true);
    try {
      await deleteDoc(doc(db, 'skillsExperience', itemId));
      toast({ title: 'Başarılı!', description: 'Beceri/Deneyim başarıyla silindi.' });
      fetchItems();
    } catch (error) {
      console.error("Error deleting item: ", error);
      toast({ title: 'Hata', description: 'Beceri/Deneyim silinirken bir sorun oluştu.', variant: 'destructive' });
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
      />
      <div className="container py-8">
        <div className="flex justify-start gap-2 mb-8">
          <Button variant="outline" onClick={() => router.back()} aria-label="Geri">
            <ArrowLeft className="mr-2 h-4 w-4" /> Geri
          </Button>
          <Button variant="outline" onClick={() => router.forward()} aria-label="İleri">
            İleri <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <Accordion type="single" collapsible className="w-full mb-8" value={accordionValue} onValueChange={setAccordionValue}>
          <AccordionItem value="add-item">
            <AccordionTrigger className="text-xl font-semibold">
              <PlusCircle className="mr-2 h-6 w-6" />
              {editingItemId ? 'Kaydı Düzenle' : 'Yeni Beceri/Deneyim Ekle'}
            </AccordionTrigger>
            <AccordionContent>
              <form onSubmit={handleSubmit} className="space-y-6 p-4 border rounded-md shadow-sm">
                <div>
                  <Label htmlFor="type">Tür</Label>
                  <Select name="type" value={formData.type} onValueChange={(value) => handleSelectChange('type', value as 'skill' | 'experience')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tür seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="skill">Beceri</SelectItem>
                      <SelectItem value="experience">Deneyim</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="name">{formData.type === 'skill' ? 'Beceri Adı' : 'Deneyim Başlığı/Rolü'}</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                {formData.type === 'skill' && (
                  <>
                    <div>
                      <Label htmlFor="category">Kategori (Beceri için)</Label>
                      <Input id="category" name="category" value={formData.category} onChange={handleChange} placeholder="Örn: Frontend, Veritabanı" />
                    </div>
                    <div>
                      <Label htmlFor="level">Seviye (Beceri için)</Label>
                      <Select name="level" value={formData.level} onValueChange={(value) => handleSelectChange('level', value as SkillExperienceFormData['level'])}>
                        <SelectTrigger>
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
                  </>
                )}

                {formData.type === 'experience' && (
                  <>
                    <div>
                      <Label htmlFor="company">Şirket/Kurum (Deneyim için)</Label>
                      <Input id="company" name="company" value={formData.company} onChange={handleChange} />
                    </div>
                    <div>
                      <Label htmlFor="role">Rol (Deneyim için)</Label>
                      <Input id="role" name="role" value={formData.role} onChange={handleChange} />
                    </div>
                    <div>
                      <Label htmlFor="dateRange">Tarih Aralığı (Deneyim için)</Label>
                      <Input id="dateRange" name="dateRange" value={formData.dateRange} onChange={handleChange} placeholder="Örn: Ocak 2020 - Halen" />
                    </div>
                  </>
                )}
                
                <div>
                  <Label htmlFor="description">{formData.type === 'skill' ? 'Beceri Açıklaması' : 'Deneyim Açıklaması'}</Label>
                  <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} required />
                </div>

                <div>
                  <Label htmlFor="details">{formData.type === 'skill' ? 'Ek Detaylar (her satır yeni bir madde)' : 'Sorumluluklar (her satır yeni bir madde)'}</Label>
                  <Textarea id="details" name="details" value={Array.isArray(formData.details) ? formData.details.join('\n') : ''} onChange={handleDetailsChange} rows={5} placeholder="Her bir detayı/sorumluluğu yeni bir satıra yazın." />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : (editingItemId ? 'Güncelle' : 'Ekle')}
                  </Button>
                  {editingItemId && (
                    <Button type="button" variant="outline" onClick={handleCancelEdit} disabled={isSubmitting}>
                      İptal
                    </Button>
                  )}
                </div>
              </form>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <h2 className="text-2xl font-semibold mb-6 text-primary">Mevcut Beceriler &amp; Deneyimler</h2>
        {isLoadingData ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Kayıtlar yükleniyor...</p>
          </div>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground text-center">Henüz eklenmiş beceri veya deneyim bulunmuyor.</p>
        ) : (
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      {item.type === 'skill' ? <Award className="mr-2 h-6 w-6 text-accent" /> : <Briefcase className="mr-2 h-6 w-6 text-accent" />}
                      {item.name}
                    </CardTitle>
                    <Badge variant={item.type === 'skill' ? 'default' : 'secondary'}>{item.type === 'skill' ? 'Beceri' : 'Deneyim'}</Badge>
                  </div>
                  <CardDescription>
                    {item.type === 'skill' && `Kategori: ${item.category || 'Belirtilmemiş'} | Seviye: ${item.level || 'Belirtilmemiş'}`}
                    {item.type === 'experience' && `${item.role || ''} @ ${item.company || ''} (${item.dateRange || 'Tarih Belirtilmemiş'})`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                  <p className="text-sm font-medium">Açıklama:</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  {item.details && item.details.length > 0 && (
                    <>
                      <p className="text-sm font-medium mt-2">{item.type === 'skill' ? 'Detaylar:' : 'Sorumluluklar:'}</p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {item.details.map((detail, index) => <li key={index}>{detail}</li>)}
                      </ul>
                    </>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t pt-4 mt-auto">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(item)} disabled={isSubmitting}>
                    <Edit className="mr-1 h-4 w-4" /> Düzenle
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" disabled={isSubmitting}>
                        <Trash2 className="mr-1 h-4 w-4" /> Sil
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bu işlem geri alınamaz. &quot;{item.name}&quot; adlı kaydı kalıcı olarak silmek istediğinizden emin misiniz?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(item.id)} disabled={isSubmitting}>
                          {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : 'Evet, Sil'}
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
