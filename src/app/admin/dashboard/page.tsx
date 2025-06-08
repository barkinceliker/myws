
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, FileText, Award, ArrowLeft, ArrowRight, Home, UserCircle, ClipboardList, Settings } from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();

  const adminSections = [
    {
      title: "Ana Sayfa İçeriği",
      description: "Ana sayfanızdaki metinleri ve bağlantıları yönetin.",
      href: "/admin/home-content",
      Icon: Settings, // Changed from Home to Settings for more "content management" feel
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
        className="bg-secondary/80 shadow-md"
      />
      <div className="container py-8 md:py-12">
        <div className="flex justify-start gap-2 mb-8">
          <Button variant="outline" onClick={() => router.back()} aria-label="Geri" className="shadow-sm hover:shadow-md transition-shadow">
            <ArrowLeft className="mr-2 h-4 w-4" /> Geri
          </Button>
          <Button variant="outline" onClick={() => router.forward()} aria-label="İleri" className="shadow-sm hover:shadow-md transition-shadow">
            İleri <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {adminSections.map((section) => (
            <Link href={section.href} className="group" key={section.title}>
              <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 border rounded-lg overflow-hidden">
                <CardHeader className="p-6">
                  <section.Icon className="h-10 w-10 text-accent mb-3" />
                  <CardTitle className="font-headline text-xl group-hover:text-primary transition-colors">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
