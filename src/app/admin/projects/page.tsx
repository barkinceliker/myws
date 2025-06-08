
"use client";

import type { ChangeEvent, FormEvent } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';
import type { Project, ProjectFormData } from '@/types';
import { PageHeader } from '@/components/page-header';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, PlusCircle, Trash2, Edit, ExternalLink, Github, ArrowLeft, FolderKanban } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const initialFormData: ProjectFormData = {
  title: '',
  description: '',
  imageUrl: 'https://placehold.co/600x400.png',
  imageHint: 'project image',
  tags: [],
  liveDemoUrl: '',
  repoUrl: '',
};

export default function AdminProjectsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const db = getFirestore(app);
  const auth = getAuth(app);

  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [accordionValue, setAccordionValue] = useState<string | undefined>(undefined);

  const fetchProjects = useCallback(async () => {
    setIsLoadingData(true);
    if (!auth.currentUser) {
        console.warn("AdminProjectsPage: Attempted to fetch projects without an authenticated user.");
        setIsLoadingData(false);
        return;
    }
    try {
      const projectsCollection = collection(db, 'projects');
      const q = query(projectsCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        tags: Array.isArray(doc.data().tags) ? doc.data().tags : [],
        createdAt: doc.data().createdAt as Timestamp, 
      })) as Project[];
      setProjects(projectsData);
    } catch (error) {
      console.error("Error fetching projects: ", error);
      toast({ title: 'Hata', description: 'Projeler yüklenirken bir sorun oluştu.', variant: 'destructive' });
    } finally {
      setIsLoadingData(false);
    }
  }, [auth, db, toast]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchProjects();
      } else {
        setIsLoadingData(false); 
        setProjects([]); 
        console.warn("AdminProjectsPage: No user authenticated. Data fetching aborted.");
      }
    });
    return () => unsubscribe(); 
  }, [auth, fetchProjects]);


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const tagsArray = value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    setFormData(prev => ({ ...prev, tags: tagsArray }));
  };


  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!auth.currentUser) {
        console.error("Attempted to submit project without an authenticated user.");
        toast({ title: 'Yetkilendirme Hatası', description: 'İşlem yapmak için giriş yapmış olmalısınız.', variant: 'destructive' });
        return;
    }
    if (!formData.title || !formData.description) {
      toast({ title: 'Eksik Bilgi', description: 'Lütfen başlık ve açıklama alanlarını doldurun.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);

    try {
      if (editingProjectId) {
        const projectRef = doc(db, 'projects', editingProjectId);
        await updateDoc(projectRef, {
          ...formData,
          updatedAt: serverTimestamp(), 
        });
        toast({ title: 'Başarılı!', description: 'Proje başarıyla güncellendi.' });
      } else {
        await addDoc(collection(db, 'projects'), {
          ...formData,
          createdAt: serverTimestamp(), 
        });
        toast({ title: 'Başarılı!', description: 'Yeni proje başarıyla eklendi.' });
      }
      setFormData(initialFormData); 
      setEditingProjectId(null); 
      fetchProjects(); 
      setAccordionValue(undefined); 
    } catch (error) {
      console.error("Error saving project: ", error);
      toast({ title: 'Hata', description: 'Proje kaydedilirken bir sorun oluştu.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (project: Project) => {
    setFormData({ 
        title: project.title,
        description: project.description,
        imageUrl: project.imageUrl,
        imageHint: project.imageHint || 'project image',
        tags: project.tags || [], 
        liveDemoUrl: project.liveDemoUrl || '',
        repoUrl: project.repoUrl || '',
    });
    setEditingProjectId(project.id); 
    setAccordionValue("add-project"); 
  };

  const handleDelete = async (projectId: string) => {
    if (!auth.currentUser) {
        console.error("Attempted to delete project without an authenticated user.");
        toast({ title: 'Yetkilendirme Hatası', description: 'İşlem yapmak için giriş yapmış olmalısınız.', variant: 'destructive' });
        return;
    }
    setIsSubmitting(true); 
    try {
      await deleteDoc(doc(db, 'projects', projectId));
      toast({ title: 'Başarılı!', description: 'Proje başarıyla silindi.' });
      fetchProjects(); 
    } catch (error) {
      console.error("Error deleting project: ", error);
      toast({ title: 'Hata', description: 'Proje silinirken bir sorun oluştu.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData(initialFormData);
    setEditingProjectId(null);
    setAccordionValue(undefined); 
  }

  return (
    <>
      <PageHeader
        title="Proje Yönetimi"
        description="Projelerinizi buradan ekleyebilir, düzenleyebilir ve silebilirsiniz."
        className="bg-secondary/80 shadow-md border-b"
      />
      <div className="container py-8">
        <div className="flex justify-start gap-2 mb-8">
          <Button variant="outline" onClick={() => router.back()} aria-label="Geri" className="shadow-sm hover:shadow-md transition-shadow">
            <ArrowLeft className="mr-2 h-4 w-4" /> Geri
          </Button>
        </div>
        
        <Accordion type="single" collapsible className="w-full mb-10 bg-card p-4 sm:p-6 rounded-lg shadow-xl border" value={accordionValue} onValueChange={setAccordionValue}>
          <AccordionItem value="add-project" className="border-b-0">
            <AccordionTrigger className="text-xl font-headline text-primary hover:no-underline data-[state=open]:pb-4 data-[state=closed]:pb-0">
              <div className="flex items-center">
                <PlusCircle className="mr-3 h-6 w-6 text-accent" />
                {editingProjectId ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-6 border-t border-border/70">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium text-foreground/90">Proje Başlığı</Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleChange} required className="shadow-sm focus:ring-primary focus:border-primary"/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-sm font-medium text-foreground/90">Etiketler (virgülle ayırın)</Label>
                    <Input id="tags" name="tags" value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''} onChange={handleTagsChange} placeholder="Örn: React, Next.js" className="shadow-sm focus:ring-primary focus:border-primary"/>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-foreground/90">Açıklama</Label>
                  <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} required className="shadow-sm focus:ring-primary focus:border-primary"/>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl" className="text-sm font-medium text-foreground/90">Görsel URL</Label>
                    <Input id="imageUrl" name="imageUrl" type="url" value={formData.imageUrl} onChange={handleChange} className="shadow-sm focus:ring-primary focus:border-primary"/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageHint" className="text-sm font-medium text-foreground/90">Görsel İpucu (AI için)</Label>
                    <Input id="imageHint" name="imageHint" value={formData.imageHint} onChange={handleChange} placeholder="Örn: teknoloji projesi" className="shadow-sm focus:ring-primary focus:border-primary"/>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="liveDemoUrl" className="text-sm font-medium text-foreground/90">Canlı Demo URL</Label>
                    <Input id="liveDemoUrl" name="liveDemoUrl" type="url" value={formData.liveDemoUrl} onChange={handleChange} className="shadow-sm focus:ring-primary focus:border-primary"/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="repoUrl" className="text-sm font-medium text-foreground/90">Repo URL</Label>
                    <Input id="repoUrl" name="repoUrl" type="url" value={formData.repoUrl} onChange={handleChange} className="shadow-sm focus:ring-primary focus:border-primary"/>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={isSubmitting} className="shadow-md hover:shadow-lg transition-shadow min-w-[180px]">
                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : (editingProjectId ? 'Proje Bilgilerini Güncelle' : 'Yeni Proje Oluştur')}
                  </Button>
                  {editingProjectId && (
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
                <FolderKanban size={32} className="mr-3 text-accent"/>
                Mevcut Projeler
            </h2>
        </div>

        {isLoadingData ? (
          <div className="flex flex-col justify-center items-center h-60 text-muted-foreground">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg">Projeler yükleniyor, lütfen bekleyin...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 bg-card border rounded-lg shadow-md">
            <FolderKanban size={64} className="mx-auto text-muted-foreground opacity-50 mb-4" />
            <p className="text-xl text-muted-foreground">Henüz eklenmiş proje bulunmuyor.</p>
            <p className="text-sm text-muted-foreground mt-2">Yukarıdaki bölümden yeni bir proje ekleyebilirsiniz.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Card key={project.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 border rounded-lg overflow-hidden bg-card/80 backdrop-blur-sm">
                <CardHeader className="p-0">
                  {project.imageUrl && (
                    <div className="relative w-full h-56 group">
                      <Image src={project.imageUrl} alt={project.title} fill style={{objectFit: 'cover'}} data-ai-hint={project.imageHint || "project image"} className="transition-transform duration-300 group-hover:scale-105"/>
                       <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>
                  )}
                </CardHeader>
                <div className="p-5 flex flex-col flex-grow">
                  <CardTitle className="font-headline text-2xl text-primary mb-2 line-clamp-2">{project.title}</CardTitle>
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs py-1 px-2.5 shadow-sm">{tag}</Badge>)}
                    </div>
                  )}
                  <CardDescription className="text-sm text-foreground/80 mb-4 flex-grow line-clamp-4 leading-relaxed">{project.description}</CardDescription>
                  <CardFooter className="flex flex-col items-stretch gap-3 p-0 mt-auto border-t border-border/70 pt-4">
                    <div className="flex gap-2 w-full">
                      {project.liveDemoUrl && (
                        <Button variant="outline" size="sm" asChild className="flex-1 shadow-sm hover:shadow-md transition-all hover:bg-accent/10">
                          <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4 text-accent" /> Canlı Demo
                          </a>
                        </Button>
                      )}
                      {project.repoUrl && (
                        <Button variant="outline" size="sm" asChild className="flex-1 shadow-sm hover:shadow-md transition-all hover:bg-accent/10">
                          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="mr-2 h-4 w-4 text-foreground/70" /> Kodlar
                          </a>
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-2 w-full justify-end pt-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(project)} disabled={isSubmitting} className="shadow-sm hover:shadow-md transition-all hover:border-primary text-primary hover:text-primary">
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
                              Bu işlem geri alınamaz. &quot;{project.title}&quot; adlı projeyi kalıcı olarak silmek istediğinizden emin misiniz?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="mt-4">
                            <AlertDialogCancel disabled={isSubmitting} className="shadow-sm hover:shadow-md">İptal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(project.id)} disabled={isSubmitting} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-sm hover:shadow-md">
                              {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : 'Evet, Kalıcı Olarak Sil'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
