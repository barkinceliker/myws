
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, FileText, Award, ArrowLeft, Settings, UserCircle, ClipboardList, LayoutDashboard } from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();

  const adminSections = [
    {
      title: "Ana Sayfa İçeriği",
      description: "Ana sayfanızdaki metinleri ve bağlantıları yönetin.",
      href: "/admin/home-content",
      Icon: Settings,
    },
    {
      title: "Hakkımda Sayfası",
      description: "Biyografinizi, portre resminizi ve temel değerlerinizi düzenleyin.",
      href: "/admin/about-content",
      Icon: UserCircle,
    },
    {
      title: "Özgeçmiş Yönetimi",
      description: "Deneyimlerinizi ve eğitim bilgilerinizi güncelleyin.",
      href: "/admin/resume-content",
      Icon: ClipboardList,
    },
    {
      title: "Projeleri Yönet",
      description: "Yeni projeler ekleyin, mevcut projeleri düzenleyin veya silin.",
      href: "/admin/projects",
      Icon: Briefcase,
    },
    {
      title: "Blog Yazılarını Yönet",
      description: "Yeni blog yazıları oluşturun, mevcutları güncelleyin veya silin.",
      href: "/admin/blog",
      Icon: FileText,
    },
    {
      title: "Beceri & Deneyimleri Yönet",
      description: "Becerilerinizi ve profesyonel deneyimlerinizi (ayrı liste) yönetin.",
      href: "/admin/skills-experience",
      Icon: Award,
    },
  ];

  return (
    <>
      <PageHeader
        title="Admin Paneli"
        description="Portfolyo web sitenizin içeriğini buradan yönetebilirsiniz."
        className="bg-secondary/80 shadow-md border-b"
      />
      <div className="container py-8 md:py-12">
        <div className="flex justify-start gap-2 mb-8">
          <Button variant="outline" onClick={() => router.back()} aria-label="Geri" className="shadow-sm hover:shadow-md transition-shadow">
            <ArrowLeft className="mr-2 h-4 w-4" /> Geri
          </Button>
        </div>
        
        <Card className="mb-12 shadow-xl border rounded-lg overflow-hidden">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-800/20 border-b">
            <div className="flex items-center space-x-3">
              <LayoutDashboard className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="font-headline text-2xl text-primary">Kontrol Paneli</CardTitle>
                <CardDescription className="text-muted-foreground">İçerik yönetimi bölümlerine hızlıca erişin.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminSections.map((section) => (
                <Link href={section.href} className="group" key={section.title}>
                  <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-0.5 border rounded-lg overflow-hidden hover:border-primary/50 bg-card hover:bg-card/95">
                    <CardHeader className="p-5">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-md">
                         <section.Icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="font-headline text-lg group-hover:text-primary transition-colors">
                          {section.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-5 pt-0">
                      <p className="text-sm text-muted-foreground">
                        {section.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
