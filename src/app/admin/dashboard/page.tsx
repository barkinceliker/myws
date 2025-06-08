
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, FileText, Award, ArrowLeft, ArrowRight } from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();

  return (
    <>
      <PageHeader
        title="Admin Paneli"
        description="İçeriklerinizi buradan yönetebilirsiniz."
      />
      <div className="container py-8 md:py-12">
        <div className="flex justify-start gap-2 mb-8">
          <Button variant="outline" onClick={() => router.back()} aria-label="Geri">
            <ArrowLeft className="mr-2 h-4 w-4" /> Geri
          </Button>
          <Button variant="outline" onClick={() => router.forward()} aria-label="İleri">
            İleri <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link href="/admin/projects" className="group">
            <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
              <CardHeader>
                <Briefcase className="h-12 w-12 text-accent mb-4" />
                <CardTitle className="font-headline text-2xl group-hover:text-primary transition-colors">
                  Projeleri Yönet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yeni projeler ekleyin, mevcut projeleri düzenleyin veya silin.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/blog" className="group">
            <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
              <CardHeader>
                <FileText className="h-12 w-12 text-accent mb-4" />
                <CardTitle className="font-headline text-2xl group-hover:text-primary transition-colors">
                  Blog Yazılarını Yönet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yeni blog yazıları oluşturun, mevcutları güncelleyin veya silin.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/skills-experience" className="group">
            <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
              <CardHeader>
                <Award className="h-12 w-12 text-accent mb-4" />
                <CardTitle className="font-headline text-2xl group-hover:text-primary transition-colors">
                  Beceri & Deneyimleri Yönet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Becerilerinizi ve profesyonel deneyimlerinizi yönetin.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </>
  );
}
