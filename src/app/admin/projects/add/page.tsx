
// This page is no longer used directly. 
// Its functionality has been merged into /src/app/admin/projects/page.tsx
// You can delete this file if you wish.
import { redirect } from 'next/navigation';

export default function AddProjectPageRedirect() {
  redirect('/admin/projects');
  return null; 
}
