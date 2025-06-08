
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function ManageProjectsPage() {
  return (
    <>
      <PageHeader
        title="Projeleri Yönet"
        description="Mevcut projelerinizi görüntüleyin, düzenleyin veya yenilerini ekleyin."
      />
      <div className="container py-8">
        <div className="flex justify-end mb-8">
          <Button asChild>
            <Link href="/admin/projects/add">
              <PlusCircle className="mr-2 h-5 w-5" /> Yeni Proje Ekle
            </Link>
          </Button>
        </div>
        <div className="p-8 border rounded-lg shadow-sm bg-card">
          <p className="text-center text-muted-foreground">
            Proje listesi burada görünecektir. Mevcut projeleri düzenleyebilir veya silebilirsiniz.
            Bu özellik yakında eklenecektir.
          </p>
        </div>
      </div>
    </>
  );
}
