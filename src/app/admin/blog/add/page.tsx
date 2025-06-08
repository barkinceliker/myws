
// This page is no longer used directly. 
// Its functionality has been merged into /src/app/admin/blog/page.tsx
// You can delete this file if you wish.
import { redirect } from 'next/navigation';

export default function AddBlogPostPageRedirect() {
  redirect('/admin/blog');
  return null;
}
