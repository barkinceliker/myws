
export interface ProjectFormData {
  title: string;
  description: string;
  imageUrl: string;
  imageHint?: string;
  tags: string; // Comma-separated
  liveDemoUrl?: string;
  repoUrl?: string;
}

export interface BlogPostFormData {
  slug: string;
  title: string;
  content: string;
  publicationDate: string;
  author: string;
  tags: string; // Comma-separated
  imageUrl: string;
  imageHint?: string;
}
