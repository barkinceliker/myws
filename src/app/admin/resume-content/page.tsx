
"use client";

import type { ChangeEvent, FormEvent } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';
import type { ExperienceFormData, ExperienceItem, EducationFormData, EducationItem } from '@/types';
import { PageHeader } from '@/components/page-header';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, PlusCircle, Trash2, Edit, ArrowLeft, ArrowRight, Briefcase, GraduationCap, ClipboardList } from 'lucide-react';

const initialExperienceFormData: ExperienceFormData = {
  role: '',
  company: '',
  dateRange: '',
  responsibilities: [],
};

const initialEducationFormData: EducationFormData = {
  degree: '',
  institution: '',
  dateRange: '',
  details: '',
};

export default function AdminResumeContentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const db = getFirestore(app);
  const auth = getAuth(app);

  // Experience States
  const [experienceFormData, setExperienceFormData] = useState<ExperienceFormData>(initialExperienceFormData);
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [isLoadingExperiences, setIsLoadingExperiences] = useState(true);
  const [isSubmittingExperience, setIsSubmittingExperience] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [experienceAccordionValue, setExperienceAccordionValue] = useState<string | undefined>(undefined);

  // Education States
  const [educationFormData, setEducationFormData] = useState<EducationFormData>(initialEducationFormData);
  const [educationItems, setEducationItems] = useState<EducationItem[]>([]);
  const [isLoadingEducation, setIsLoadingEducation] = useState(true);
  const [isSubmittingEducation, setIsSubmittingEducation] = useState(false);
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null);
  const [educationAccordionValue, setEducationAccordionValue] = useState<string | undefined>(undefined);
  
  // --- Experience Callbacks ---
  const fetchExperiences = useCallback(async () => {
    setIsLoadingExperiences(true);
    if (!auth.currentUser) { console.error("Auth error fetching experiences"); setIsLoadingExperiences(false); return; }
    try {
      const collRef = collection(db, 'experiences');
      const q = query(collRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setExperiences(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ExperienceItem)));
    } catch (error) {
      console.error("Error fetching experiences: ", error);
      toast({ title: 'Hata', description: 'Deneyimler yüklenirken sorun oluştu.', variant: 'destructive' });
    } finally {
      setIsLoadingExperiences(false);
    }
  }, [auth, db, toast]);

  // --- Education Callbacks ---
  const fetchEducationItems = useCallback(async () => {
    setIsLoadingEducation(true);
    if (!auth.currentUser) { console.error("Auth error fetching education"); setIsLoadingEducation(false); return; }
    try {
      const collRef = collection(db, 'educationItems');
      const q = query(collRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setEducationItems(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as EducationItem)));
    } catch (error) {
      console.error("Error fetching education items: ", error);
      toast({ title: 'Hata', description: 'Eğitim bilgileri yüklenirken sorun oluştu.', variant: 'destructive' });
    } finally {
      setIsLoadingEducation(false);
    }
  }, [auth, db, toast]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchExperiences();
        fetchEducationItems();
      } else {
        setIsLoadingExperiences(false);
        setIsLoadingEducation(false);
        console.warn('AdminResumeContentPage - No user authenticated.');
      }
    });
    return () => unsubscribe();
  }, [auth, fetchExperiences, fetchEducationItems]);

  // --- Experience Handlers ---
  const handleExperienceChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'responsibilities') {
      setExperienceFormData(prev => ({ ...prev, responsibilities: value.split('\n') }));
    } else {
      setExperienceFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleExperienceSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!auth.currentUser) { toast({ title: 'Yetkilendirme Hatası', variant: 'destructive' }); return; }
    if (!experienceFormData.role || !experienceFormData.company) {
      toast({ title: 'Eksik Bilgi', description: 'Lütfen Rol ve Şirket alanlarını doldurun.', variant: 'destructive' });
      return;
    }
    setIsSubmittingExperience(true);
    try {
      if (editingExperienceId) {
        await updateDoc(doc(db, 'experiences', editingExperienceId), { ...experienceFormData, updatedAt: serverTimestamp() });
        toast({ title: 'Başarılı!', description: 'Deneyim güncellendi.' });
      } else {
        await addDoc(collection(db, 'experiences'), { ...experienceFormData, createdAt: serverTimestamp() });
        toast({ title: 'Başarılı!', description: 'Yeni deneyim eklendi.' });
      }
      setExperienceFormData(initialExperienceFormData);
      setEditingExperienceId(null);
      fetchExperiences();
      setExperienceAccordionValue(undefined);
    } catch (error) {
      console.error("Error saving experience: ", error);
      toast({ title: 'Hata', description: 'Deneyim kaydedilirken sorun oluştu.', variant: 'destructive' });
    } finally {
      setIsSubmittingExperience(false);
    }
  };
  
  const handleEditExperience = (exp: ExperienceItem) => {
    setExperienceFormData({
      role: exp.role,
      company: exp.company,
      dateRange: exp.dateRange,
      responsibilities: exp.responsibilities || [],
    });
    setEditingExperienceId(exp.id);
    setExperienceAccordionValue("add-experience");
  };

  const handleDeleteExperience = async (id: string) => {
    if (!auth.currentUser) { toast({ title: 'Yetkilendirme Hatası', variant: 'destructive' }); return; }
    setIsSubmittingExperience(true);
    try {
      await deleteDoc(doc(db, 'experiences', id));
      toast({ title: 'Başarılı!', description: 'Deneyim silindi.' });
      fetchExperiences();
    } catch (error) {
      console.error("Error deleting experience: ", error);
      toast({ title: 'Hata', description: 'Deneyim silinirken sorun oluştu.', variant: 'destructive' });
    } finally {
      setIsSubmittingExperience(false);
    }
  };

  // --- Education Handlers ---
  const handleEducationChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEducationFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEducationSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!auth.currentUser) { toast({ title: 'Yetkilendirme Hatası', variant: 'destructive' }); return; }
     if (!educationFormData.degree || !educationFormData.institution) {
      toast({ title: 'Eksik Bilgi', description: 'Lütfen Derece ve Kurum alanlarını doldurun.', variant: 'destructive' });
      return;
    }
    setIsSubmittingEducation(true);
    try {
      if (editingEducationId) {
        await updateDoc(doc(db, 'educationItems', editingEducationId), { ...educationFormData, updatedAt: serverTimestamp() });
        toast({ title: 'Başarılı!', description: 'Eğitim bilgisi güncellendi.' });
      } else {
        await addDoc(collection(db, 'educationItems'), { ...educationFormData, createdAt: serverTimestamp() });
        toast({ title: 'Başarılı!', description: 'Yeni eğitim bilgisi eklendi.' });
      }
      setEducationFormData(initialEducationFormData);
      setEditingEducationId(null);
      fetchEducationItems();
      setEducationAccordionValue(undefined);
    } catch (error) {
      console.error("Error saving education item: ", error);
      toast({ title: 'Hata', description: 'Eğitim kaydedilirken sorun oluştu.', variant: 'destructive' });
    } finally {
      setIsSubmittingEducation(false);
    }
  };

  const handleEditEducation = (edu: EducationItem) => {
    setEducationFormData({
      degree: edu.degree,
      institution: edu.institution,
      dateRange: edu.dateRange,
      details: edu.details,
    });
    setEditingEducationId(edu.id);
    setEducationAccordionValue("add-education");
  };

  const handleDeleteEducation = async (id: string) => {
    if (!auth.currentUser) { toast({ title: 'Yetkilendirme Hatası', variant: 'destructive' }); return; }
    setIsSubmittingEducation(true);
    try {
      await deleteDoc(doc(db, 'educationItems', id));
      toast({ title: 'Başarılı!', description: 'Eğitim bilgisi silindi.' });
      fetchEducationItems();
    } catch (error) {
      console.error("Error deleting education item: ", error);
      toast({ title: 'Hata', description: 'Eğitim silinirken sorun oluştu.', variant: 'destructive' });
    } finally {
      setIsSubmittingEducation(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Özgeçmiş İçerik Yönetimi"
        description="Profesyonel deneyimlerinizi ve eğitim bilgilerinizi buradan yönetin."
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

        {/* Experiences Section */}
        <div className="mb-12">
            <h2 className="font-headline text-3xl font-semibold text-primary flex items-center mb-6 border-b pb-3">
                <Briefcase size={30} className="mr-3 text-accent"/> Profesyonel Deneyimler
            </h2>
            <Accordion type="single" collapsible className="w-full bg-card p-4 sm:p-6 rounded-lg shadow-lg border" value={experienceAccordionValue} onValueChange={setExperienceAccordionValue}>
                <AccordionItem value="add-experience" className="border-b-0">
                    <AccordionTrigger className="text-xl font-headline text-primary hover:no-underline">
                        <div className="flex items-center"><PlusCircle className="mr-3 h-6 w-6 text-accent" />{editingExperienceId ? 'Deneyimi Düzenle' : 'Yeni Deneyim Ekle'}</div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-6">
                        <form onSubmit={handleExperienceSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2"><Label htmlFor="expRole">Rol/Pozisyon</Label><Input id="expRole" name="role" value={experienceFormData.role} onChange={handleExperienceChange} required /></div>
                                <div className="space-y-2"><Label htmlFor="expCompany">Şirket/Kurum</Label><Input id="expCompany" name="company" value={experienceFormData.company} onChange={handleExperienceChange} required /></div>
                            </div>
                            <div className="space-y-2"><Label htmlFor="expDateRange">Tarih Aralığı</Label><Input id="expDateRange" name="dateRange" value={experienceFormData.dateRange} onChange={handleExperienceChange} placeholder="Örn: Ocak 2020 - Halen" /></div>
                            <div className="space-y-2"><Label htmlFor="expResponsibilities">Sorumluluklar (her madde yeni satırda)</Label><Textarea id="expResponsibilities" name="responsibilities" value={experienceFormData.responsibilities.join('\n')} onChange={handleExperienceChange} rows={5} /></div>
                            <div className="flex gap-3 pt-2">
                                <Button type="submit" disabled={isSubmittingExperience}><Loader2 className={isSubmittingExperience ? "animate-spin mr-2" : "hidden"} /> {editingExperienceId ? 'Deneyimi Güncelle' : 'Yeni Deneyim Ekle'}</Button>
                                {editingExperienceId && <Button type="button" variant="outline" onClick={() => { setEditingExperienceId(null); setExperienceFormData(initialExperienceFormData); setExperienceAccordionValue(undefined); }}>İptal</Button>}
                            </div>
                        </form>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            {isLoadingExperiences ? <div className="flex justify-center py-10"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div> : experiences.length === 0 ? <p className="text-center py-6 text-muted-foreground">Henüz deneyim eklenmemiş.</p> : (
                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    {experiences.map(exp => (
                        <Card key={exp.id} className="shadow-lg">
                            <CardHeader><CardTitle className="text-xl text-primary">{exp.role}</CardTitle><CardDescription>{exp.company} ({exp.dateRange})</CardDescription></CardHeader>
                            <CardContent><ul className="list-disc pl-5 text-sm space-y-1">{exp.responsibilities.map((r, i) => <li key={i}>{r}</li>)}</ul></CardContent>
                            <CardFooter className="flex justify-end gap-2 border-t pt-4">
                                <Button variant="outline" size="sm" onClick={() => handleEditExperience(exp)}><Edit size={16} className="mr-1.5" />Düzenle</Button>
                                <AlertDialog><AlertDialogTrigger asChild><Button variant="destructive" size="sm"><Trash2 size={16} className="mr-1.5" />Sil</Button></AlertDialogTrigger>
                                    <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Emin misiniz?</AlertDialogTitle><AlertDialogDescription>Bu işlem geri alınamaz. "{exp.role} @ {exp.company}" deneyimini silmek istediğinizden emin misiniz?</AlertDialogDescription></AlertDialogHeader>
                                    <AlertDialogFooter><AlertDialogCancel>İptal</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteExperience(exp.id)} disabled={isSubmittingExperience}>Evet, Sil</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                                </AlertDialog>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>

        {/* Education Section */}
        <div>
            <h2 className="font-headline text-3xl font-semibold text-primary flex items-center mb-6 border-b pb-3">
                <GraduationCap size={30} className="mr-3 text-accent"/> Eğitim Bilgileri
            </h2>
             <Accordion type="single" collapsible className="w-full bg-card p-4 sm:p-6 rounded-lg shadow-lg border" value={educationAccordionValue} onValueChange={setEducationAccordionValue}>
                <AccordionItem value="add-education" className="border-b-0">
                     <AccordionTrigger className="text-xl font-headline text-primary hover:no-underline">
                        <div className="flex items-center"><PlusCircle className="mr-3 h-6 w-6 text-accent" />{editingEducationId ? 'Eğitimi Düzenle' : 'Yeni Eğitim Ekle'}</div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-6">
                        <form onSubmit={handleEducationSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2"><Label htmlFor="eduDegree">Derece/Alan</Label><Input id="eduDegree" name="degree" value={educationFormData.degree} onChange={handleEducationChange} required /></div>
                                <div className="space-y-2"><Label htmlFor="eduInstitution">Okul/Kurum</Label><Input id="eduInstitution" name="institution" value={educationFormData.institution} onChange={handleEducationChange} required /></div>
                            </div>
                            <div className="space-y-2"><Label htmlFor="eduDateRange">Tarih Aralığı</Label><Input id="eduDateRange" name="dateRange" value={educationFormData.dateRange} onChange={handleEducationChange} placeholder="Örn: 2014 - 2016" /></div>
                            <div className="space-y-2"><Label htmlFor="eduDetails">Detaylar/Notlar</Label><Textarea id="eduDetails" name="details" value={educationFormData.details} onChange={handleEducationChange} rows={3} /></div>
                            <div className="flex gap-3 pt-2">
                                <Button type="submit" disabled={isSubmittingEducation}><Loader2 className={isSubmittingEducation ? "animate-spin mr-2" : "hidden"} /> {editingEducationId ? 'Eğitimi Güncelle' : 'Yeni Eğitim Ekle'}</Button>
                                {editingEducationId && <Button type="button" variant="outline" onClick={() => { setEditingEducationId(null); setEducationFormData(initialEducationFormData); setEducationAccordionValue(undefined);}}>İptal</Button>}
                            </div>
                        </form>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            {isLoadingEducation ? <div className="flex justify-center py-10"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div> : educationItems.length === 0 ? <p className="text-center py-6 text-muted-foreground">Henüz eğitim bilgisi eklenmemiş.</p> : (
                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    {educationItems.map(edu => (
                        <Card key={edu.id} className="shadow-lg">
                            <CardHeader><CardTitle className="text-xl text-primary">{edu.degree}</CardTitle><CardDescription>{edu.institution} ({edu.dateRange})</CardDescription></CardHeader>
                            <CardContent><p className="text-sm">{edu.details}</p></CardContent>
                            <CardFooter className="flex justify-end gap-2 border-t pt-4">
                                <Button variant="outline" size="sm" onClick={() => handleEditEducation(edu)}><Edit size={16} className="mr-1.5" />Düzenle</Button>
                                <AlertDialog><AlertDialogTrigger asChild><Button variant="destructive" size="sm"><Trash2 size={16} className="mr-1.5" />Sil</Button></AlertDialogTrigger>
                                <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Emin misiniz?</AlertDialogTitle><AlertDialogDescription>Bu işlem geri alınamaz. "{edu.degree} - {edu.institution}" eğitimini silmek istediğinizden emin misiniz?</AlertDialogDescription></AlertDialogHeader>
                                <AlertDialogFooter><AlertDialogCancel>İptal</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteEducation(edu.id)} disabled={isSubmittingEducation}>Evet, Sil</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                                </AlertDialog>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
      </div>
    </>
  );
}
