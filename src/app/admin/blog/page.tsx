
"use client";

import type { ChangeEvent, FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy, Timestamp } from 'firebase/firestore';
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
import { Loader2, PlusCircle, Trash2, Edit, ArrowLeft, ArrowRight } from 'lucide-react';
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

  const [formData, setFormData] = useState<BlogPostFormData>(initialFormData);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [accordionValue, setAccordionValue] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    setIsLoadingData(true);
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
  };

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
      imageHint: post.imageHint,
    });
    setEditingPostId(post.id);
    setAccordionValue("add-blog-post");
  };

  const handleDelete = async (postId: string) => {
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
          <AccordionItem value="add-blog-post">
            <AccordionTrigger className="text-xl font-semibold">
              <PlusCircle className="mr-2 h-6 w-6" />
              {editingPostId ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı Ekle'}
            </AccordionTrigger>
            <AccordionContent>
              <form onSubmit={handleSubmit} className="space-y-6 p-4 border rounded-md shadow-sm">
                <div>
                  <Label htmlFor="title">Başlık</Label>
                  <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="slug">Slug (URL için kısa ad)</Label>
                  <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required disabled={!!editingPostId} />
                   {!editingPostId && <p className="text-xs text-muted-foreground mt-1">Başlık yazarken otomatik oluşturulur. Gerekirse düzenleyebilirsiniz.</p>}
                </div>
                <div>
                  <Label htmlFor="content">İçerik (HTML destekler)</Label>
                  <Textarea id="content" name="content" value={formData.content} onChange={handleChange} rows={10} required />
                </div>
                <div>
                  <Label htmlFor="publicationDate">Yayın Tarihi</Label>
                  <Input id="publicationDate" name="publicationDate" type="date" value={formData.publicationDate} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="author">Yazar</Label>
                  <Input id="author" name="author" value={formData.author} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="tags">Etiketler (virgülle ayırın)</Label>
                  <Input id="tags" name="tags" value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''} onChange={handleTagsChange} />
                </div>
                <div>
                  <Label htmlFor="imageUrl">Görsel URL</Label>
                  <Input id="imageUrl" name="imageUrl" type="url" value={formData.imageUrl} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="imageHint">Görsel İpucu (AI için)</Label>
                  <Input id="imageHint" name="imageHint" value={formData.imageHint} onChange={handleChange} />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : (editingPostId ? 'Güncelle' : 'Yazı Ekle')}
                  </Button>
                   {editingPostId && (
                    <Button type="button" variant="outline" onClick={handleCancelEdit} disabled={isSubmitting}>
                      İptal
                    </Button>
                  )}
                </div>
              </form>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <h2 className="text-2xl font-semibold mb-6 text-primary">Mevcut Blog Yazıları</h2>
        {isLoadingData ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Blog yazıları yükleniyor...</p>
          </div>
        ) : blogPosts.length === 0 ? (
          <p className="text-muted-foreground text-center">Henüz eklenmiş blog yazısı bulunmuyor.</p>
        ) : (
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            {blogPosts.map((post) => (
              <Card key={post.id} className="flex flex-col">
                <CardHeader>
                  {post.imageUrl && (
                     <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
                      <Image src={post.imageUrl} alt={post.title} fill style={{objectFit: 'cover'}} data-ai-hint={post.imageHint || "blog header"}/>
                    </div>
                  )}
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>
                    Yazar: {post.author} | Tarih: {post.publicationDate} | Slug: {post.slug}
                  </CardDescription>
                   {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {post.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="line-clamp-3 text-sm">{post.content.replace(/<[^>]*>?/gm, '').substring(0,200)}...</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t pt-4 mt-auto">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(post)} disabled={isSubmitting}>
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
                          Bu işlem geri alınamaz. &quot;{post.title}&quot; adlı blog yazısını kalıcı olarak silmek istediğinizden emin misiniz?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(post.id)} disabled={isSubmitting}>
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
