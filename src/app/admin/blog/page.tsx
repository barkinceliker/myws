
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function ManageBlogPage() {
  return (
    <>
      <PageHeader
        title="Blog Yazılarını Yönet"
        description="Mevcut blog yazılarınızı görüntüleyin, düzenleyin veya yenilerini ekleyin."
      />
      <div className="container py-8">
        <div className="flex justify-end mb-8">
          <Button asChild>
            <Link href="/admin/blog/add">
              <PlusCircle className="mr-2 h-5 w-5" /> Yeni Blog Yazısı Ekle
            </Link>
          </Button>
        </div>
        <div className="p-8 border rounded-lg shadow-sm bg-card">
          <p className="text-center text-muted-foreground">
            Blog yazısı listesi burada görünecektir. Mevcut yazıları düzenleyebilir veya silebilirsiniz.
            Bu özellik yakında eklenecektir.
          </p>
        </div>
      </div>
    </>
  );
}
