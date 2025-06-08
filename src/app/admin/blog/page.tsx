
"use client";

import type { ChangeEvent, FormEvent } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';
import type { BlogPost, BlogPostFormData } from '@/types';
import { PageHeader } from '@/components/page-header';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, PlusCircle, Trash2, Edit, ArrowLeft, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { format } from 'date-fns';

const initialFormData: BlogPostFormData = {
  slug: '',
  title: '',
  content: '',
  publicationDate: format(new Date(), 'yyyy-MM-dd'),
  author: '',
  tags: [],
  imageUrl: 'https://placehold.co/1200x600.png',
  imageHint: 'blog header',
};

export default function AdminBlogPage() {
  const router = useRouter();
  const { toast } = useToast();
  const db = getFirestore(app);
  const auth = getAuth(app);

  const [formData, setFormData] = useState<BlogPostFormData>(initialFormData);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [accordionValue, setAccordionValue] = useState<string | undefined>(undefined);

  const fetchBlogPosts = useCallback(async () => {
    setIsLoadingData(true);
    if (!auth.currentUser) {
        console.warn("AdminBlogPage: Attempted to fetch blog posts without an authenticated user.");
        setIsLoadingData(false);
        return;
    }
    try {
      const postsCollection = collection(db, 'blogPosts');
      const q = query(postsCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        tags: Array.isArray(doc.data().tags) ? doc.data().tags : [],
        createdAt: doc.data().createdAt as Timestamp,
      })) as BlogPost[];
      setBlogPosts(postsData);
    } catch (error) {
      console.error("Error fetching blog posts: ", error);
      toast({ title: 'Hata', description: 'Blog yazıları yüklenirken bir sorun oluştu.', variant: 'destructive' });
    } finally {
      setIsLoadingData(false);
    }
  }, [auth, db, toast]);

  useEffect(() => {
    console.log('AdminBlogPage - Current user UID:', auth.currentUser?.uid);
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchBlogPosts();
      } else {
        setIsLoadingData(false);
        setBlogPosts([]);
        console.warn('AdminBlogPage - No user authenticated. Data fetching aborted.');
      }
    });
    return () => unsubscribe();
  }, [auth, fetchBlogPosts]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'title' && !editingPostId) {
      const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      setFormData(prev => ({ ...prev, [name]: value, slug }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTagsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const tagsArray = value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    setFormData(prev => ({ ...prev, tags: tagsArray }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!auth.currentUser) {
        console.error("Attempted to submit blog post without an authenticated user.");
        toast({ title: 'Yetkilendirme Hatası', description: 'İşlem yapmak için giriş yapmış olmalısınız.', variant: 'destructive' });
        return;
    }
    if (!formData.title || !formData.content || !formData.slug) {
      toast({ title: 'Eksik Bilgi', description: 'Lütfen başlık, içerik ve slug alanlarını doldurun.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);

    try {
      if (editingPostId) {
        const postRef = doc(db, 'blogPosts', editingPostId);
        await updateDoc(postRef, {
          ...formData,
          updatedAt: serverTimestamp(),
        });
        toast({ title: 'Başarılı!', description: 'Blog yazısı başarıyla güncellendi.' });
      } else {
        await addDoc(collection(db, 'blogPosts'), {
          ...formData,
          createdAt: serverTimestamp(),
        });
        toast({ title: 'Başarılı!', description: 'Yeni blog yazısı başarıyla eklendi.' });
      }
      setFormData(initialFormData);
      setEditingPostId(null);
      fetchBlogPosts();
      setAccordionValue(undefined);
    } catch (error) {
      console.error("Error saving blog post: ", error);
      toast({ title: 'Hata', description: 'Blog yazısı kaydedilirken bir sorun oluştu.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setFormData({
      slug: post.slug,
      title: post.title,
      content: post.content,
      publicationDate: post.publicationDate, 
      author: post.author,
      tags: post.tags || [],
      imageUrl: post.imageUrl,
      imageHint: post.imageHint || 'blog header',
    });
    setEditingPostId(post.id);
    setAccordionValue("add-blog-post");
  };

  const handleDelete = async (postId: string) => {
    if (!auth.currentUser) {
        console.error("Attempted to delete blog post without an authenticated user.");
        toast({ title: 'Yetkilendirme Hatası', description: 'İşlem yapmak için giriş yapmış olmalısınız.', variant: 'destructive' });
        return;
    }
    setIsSubmitting(true);
    try {
      await deleteDoc(doc(db, 'blogPosts', postId));
      toast({ title: 'Başarılı!', description: 'Blog yazısı başarıyla silindi.' });
      fetchBlogPosts();
    } catch (error) {
      console.error("Error deleting blog post: ", error);
      toast({ title: 'Hata', description: 'Blog yazısı silinirken bir sorun oluştu.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData(initialFormData);
    setEditingPostId(null);
    setAccordionValue(undefined);
  }

  return (
    <>
      <PageHeader
        title="Blog Yönetimi"
        description="Blog yazılarınızı buradan ekleyebilir, düzenleyebilir ve silebilirsiniz."
        className="bg-secondary/80 shadow-md border-b"
      />
      <div className="container py-8">
        <div className="flex justify-start gap-2 mb-8">
          <Button variant="outline" onClick={() => router.back()} aria-label="Geri" className="shadow-sm hover:shadow-md transition-shadow">
            <ArrowLeft className="mr-2 h-4 w-4" /> Geri
          </Button>
        </div>
        
        <Accordion type="single" collapsible className="w-full mb-10 bg-card p-4 sm:p-6 rounded-lg shadow-xl border" value={accordionValue} onValueChange={setAccordionValue}>
          <AccordionItem value="add-blog-post" className="border-b-0">
            <AccordionTrigger className="text-xl font-headline text-primary hover:no-underline data-[state=open]:pb-4 data-[state=closed]:pb-0">
              <div className="flex items-center">
                <PlusCircle className="mr-3 h-6 w-6 text-accent" />
                {editingPostId ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı Ekle'}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-6 border-t border-border/70">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium text-foreground/90">Başlık</Label>
                        <Input id="title" name="title" value={formData.title} onChange={handleChange} required className="shadow-sm focus:ring-primary focus:border-primary"/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="slug" className="text-sm font-medium text-foreground/90">Slug (URL)</Label>
                        <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required disabled={!!editingPostId} className="shadow-sm focus:ring-primary focus:border-primary"/>
                        {!editingPostId && <p className="text-xs text-muted-foreground mt-1">Başlık yazarken otomatik oluşturulur.</p>}
                    </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-sm font-medium text-foreground/90">İçerik (Markdown veya HTML destekler)</Label>
                  <Textarea id="content" name="content" value={formData.content} onChange={handleChange} rows={10} required className="shadow-sm focus:ring-primary focus:border-primary"/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="publicationDate" className="text-sm font-medium text-foreground/90">Yayın Tarihi</Label>
                        <Input id="publicationDate" name="publicationDate" type="date" value={formData.publicationDate} onChange={handleChange} required className="shadow-sm focus:ring-primary focus:border-primary"/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="author" className="text-sm font-medium text-foreground/90">Yazar</Label>
                        <Input id="author" name="author" value={formData.author} onChange={handleChange} required className="shadow-sm focus:ring-primary focus:border-primary"/>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="tags" className="text-sm font-medium text-foreground/90">Etiketler (virgülle ayırın)</Label>
                        <Input id="tags" name="tags" value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''} onChange={handleTagsChange} className="shadow-sm focus:ring-primary focus:border-primary"/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="imageUrl" className="text-sm font-medium text-foreground/90">Görsel URL</Label>
                        <Input id="imageUrl" name="imageUrl" type="url" value={formData.imageUrl} onChange={handleChange} className="shadow-sm focus:ring-primary focus:border-primary"/>
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="imageHint" className="text-sm font-medium text-foreground/90">Görsel İpucu (AI için)</Label>
                    <Input id="imageHint" name="imageHint" value={formData.imageHint} onChange={handleChange} className="shadow-sm focus:ring-primary focus:border-primary"/>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={isSubmitting} className="shadow-md hover:shadow-lg transition-shadow min-w-[180px]">
                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : (editingPostId ? 'Yazıyı Güncelle' : 'Yeni Yazı Oluştur')}
                  </Button>
                   {editingPostId && (
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
                <FileText size={32} className="mr-3 text-accent"/>
                Mevcut Blog Yazıları
            </h2>
        </div>

        {isLoadingData ? (
          <div className="flex flex-col justify-center items-center h-60 text-muted-foreground">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg">Blog yazıları yükleniyor, lütfen bekleyin...</p>
          </div>
        ) : blogPosts.length === 0 ? (
           <div className="text-center py-12 bg-card border rounded-lg shadow-md">
            <FileText size={64} className="mx-auto text-muted-foreground opacity-50 mb-4" />
            <p className="text-xl text-muted-foreground">Henüz eklenmiş blog yazısı bulunmuyor.</p>
            <p className="text-sm text-muted-foreground mt-2">Yukarıdaki bölümden yeni bir yazı ekleyebilirsiniz.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 border rounded-lg overflow-hidden bg-card/80 backdrop-blur-sm">
                <CardHeader className="p-0">
                  {post.imageUrl && (
                     <div className="relative w-full h-56 group">
                      <Image src={post.imageUrl} alt={post.title} fill style={{objectFit: 'cover'}} data-ai-hint={post.imageHint || "blog header"} className="transition-transform duration-300 group-hover:scale-105"/>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>
                  )}
                </CardHeader>
                <div className="p-5 flex flex-col flex-grow">
                  <CardTitle className="font-headline text-2xl text-primary mb-2 line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mb-1">
                    Yazar: {post.author || "N/A"} | Tarih: {post.publicationDate} | Slug: {post.slug}
                  </CardDescription>
                   {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 mb-3">
                      {post.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs py-1 px-2 shadow-sm">{tag}</Badge>)}
                    </div>
                  )}
                  <div className="text-sm text-foreground/80 mb-4 flex-grow line-clamp-3 prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content.substring(0, 250) + (post.content.length > 250 ? '...' : '') }} />

                  <CardFooter className="flex justify-end gap-2 p-0 mt-auto border-t border-border/70 pt-4">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(post)} disabled={isSubmitting} className="shadow-sm hover:shadow-md transition-all hover:border-primary text-primary hover:text-primary">
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
                            Bu işlem geri alınamaz. &quot;{post.title}&quot; adlı blog yazısını kalıcı olarak silmek istediğinizden emin misiniz?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-4">
                          <AlertDialogCancel disabled={isSubmitting} className="shadow-sm hover:shadow-md">İptal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(post.id)} disabled={isSubmitting} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-sm hover:shadow-md">
                             {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : 'Evet, Kalıcı Olarak Sil'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
