import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LayoutDashboard, FileEdit, Settings, LogOut } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <>
      <PageHeader
        title="Admin Dashboard"
        description="Manage your portfolio content from here."
      />
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-headline">Manage Projects</CardTitle>
              <FileEdit className="h-6 w-6 text-accent" />
            </CardHeader>
            <CardContent>
              <CardDescription>Add, edit, or remove project entries.</CardDescription>
              <Button variant="outline" className="mt-4 w-full" disabled>Coming Soon</Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-headline">Manage Blog Posts</CardTitle>
              <LayoutDashboard className="h-6 w-6 text-accent" />
            </CardHeader>
            <CardContent>
              <CardDescription>Create new blog posts or update existing ones.</CardDescription>
              <Button variant="outline" className="mt-4 w-full" disabled>Coming Soon</Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-headline">Portfolio Settings</CardTitle>
              <Settings className="h-6 w-6 text-accent" />
            </CardHeader>
            <CardContent>
              <CardDescription>Update general site information and configurations.</CardDescription>
              <Button variant="outline" className="mt-4 w-full" disabled>Coming Soon</Button>
            </CardContent>
          </Card>
        </div>
        <div className="mt-12 text-center">
            <Button variant="destructive" asChild>
                <Link href="/">
                    <LogOut className="mr-2 h-4 w-4" /> Log Out (Simulated)
                </Link>
            </Button>
        </div>
      </div>
    </>
  );
}
