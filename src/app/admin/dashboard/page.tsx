
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, FileText, Award, Settings } from 'lucide-react'; // Award or Settings for Skills/Experience

export default function AdminDashboardPage() {
  return (
    <>
      <PageHeader
        title="Admin Paneli"
        description="İçeriklerinizi buradan yönetebilirsiniz."
      />
      <div className="container py-12 md:py-16">
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
