
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Briefcase, FileText, LogOut, PlusCircle } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <>
      <PageHeader
        title="Admin Dashboard"
        description="Portfolyo içeriğinizi buradan yönetin."
      />
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-headline">Projeler</CardTitle>
              <Briefcase className="h-6 w-6 text-accent" />
            </CardHeader>
            <CardContent>
              <CardDescription>Yeni projeler ekleyin veya mevcutları yönetin.</CardDescription>
              <Button variant="outline" className="mt-4 w-full" asChild>
                <Link href="/admin/projects/add">
                  <PlusCircle className="mr-2 h-5 w-5" /> Yeni Proje Ekle
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-headline">Blog Yazıları</CardTitle>
              <FileText className="h-6 w-6 text-accent" />
            </CardHeader>
            <CardContent>
              <CardDescription>Yeni blog yazıları oluşturun veya mevcutları güncelleyin.</CardDescription>
              <Button variant="outline" className="mt-4 w-full" asChild>
                <Link href="/admin/blog/add">
                  <PlusCircle className="mr-2 h-5 w-5" /> Yeni Blog Yazısı Ekle
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="mt-12 text-center">
            <Button variant="destructive" asChild>
                <Link href="/">
                    <LogOut className="mr-2 h-4 w-4" /> Çıkış Yap (Simüle Edildi)
                </Link>
            </Button>
        </div>
      </div>
    </>
  );
}
