
"use client";

import type { ChangeEvent, FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy, Timestamp } from 'firebase/firestore';
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
import { Loader2, PlusCircle, Trash2, Edit, ExternalLink, Github, ArrowLeft, ArrowRight } from 'lucide-react';
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

  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [accordionValue, setAccordionValue] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoadingData(true);
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
  };

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
        imageHint: project.imageHint,
        tags: project.tags || [], 
        liveDemoUrl: project.liveDemoUrl,
        repoUrl: project.repoUrl,
    });
    setEditingProjectId(project.id);
    setAccordionValue("add-project"); 
  };

  const handleDelete = async (projectId: string) => {
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
          <AccordionItem value="add-project">
            <AccordionTrigger className="text-xl font-semibold">
              <PlusCircle className="mr-2 h-6 w-6" />
              {editingProjectId ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}
            </AccordionTrigger>
            <AccordionContent>
              <form onSubmit={handleSubmit} className="space-y-6 p-4 border rounded-md shadow-sm">
                <div>
                  <Label htmlFor="title">Proje Başlığı</Label>
                  <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="description">Açıklama</Label>
                  <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} required />
                </div>
                <div>
                  <Label htmlFor="imageUrl">Görsel URL</Label>
                  <Input id="imageUrl" name="imageUrl" type="url" value={formData.imageUrl} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="imageHint">Görsel İpucu (AI için)</Label>
                  <Input id="imageHint" name="imageHint" value={formData.imageHint} onChange={handleChange} placeholder="Örn: teknoloji projesi" />
                </div>
                <div>
                  <Label htmlFor="tags">Etiketler (virgülle ayırın)</Label>
                  <Input id="tags" name="tags" value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''} onChange={handleTagsChange} placeholder="Örn: React, Next.js, Firebase" />
                </div>
                <div>
                  <Label htmlFor="liveDemoUrl">Canlı Demo URL</Label>
                  <Input id="liveDemoUrl" name="liveDemoUrl" type="url" value={formData.liveDemoUrl} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="repoUrl">Repo URL</Label>
                  <Input id="repoUrl" name="repoUrl" type="url" value={formData.repoUrl} onChange={handleChange} />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : (editingProjectId ? 'Güncelle' : 'Proje Ekle')}
                  </Button>
                  {editingProjectId && (
                    <Button type="button" variant="outline" onClick={handleCancelEdit} disabled={isSubmitting}>
                      İptal
                    </Button>
                  )}
                </div>
              </form>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <h2 className="text-2xl font-semibold mb-6 text-primary">Mevcut Projeler</h2>
        {isLoadingData ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Projeler yükleniyor...</p>
          </div>
        ) : projects.length === 0 ? (
          <p className="text-muted-foreground text-center">Henüz eklenmiş proje bulunmuyor.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="flex flex-col">
                <CardHeader>
                  {project.imageUrl && (
                    <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
                      <Image src={project.imageUrl} alt={project.title} fill style={{objectFit: 'cover'}} data-ai-hint={project.imageHint || "project image"}/>
                    </div>
                  )}
                  <CardTitle>{project.title}</CardTitle>
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription>{project.description}</CardDescription>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-2">
                   <div className="flex gap-2 mt-2">
                    {project.liveDemoUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-1 h-4 w-4" /> Canlı Demo
                        </a>
                      </Button>
                    )}
                    {project.repoUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-1 h-4 w-4" /> Repo
                        </a>
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2 mt-auto pt-2 w-full justify-end border-t">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(project)} disabled={isSubmitting}>
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
                            Bu işlem geri alınamaz. &quot;{project.title}&quot; adlı projeyi kalıcı olarak silmek istediğinizden emin misiniz?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>İptal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(project.id)} disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : 'Evet, Sil'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
