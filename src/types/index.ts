
import type { Timestamp } from 'firebase/firestore';

export interface ProjectFormData {
  title: string;
  description: string;
  imageUrl: string;
  imageHint?: string;
  tags: string[]; // Comma-separated string to array
  liveDemoUrl?: string;
  repoUrl?: string;
}

export interface Project extends ProjectFormData {
  id: string;
  createdAt: Timestamp;
}

export interface BlogPostFormData {
  slug: string;
  title: string;
  content: string;
  publicationDate: string; // Will be stored as string, consider converting to Timestamp if needed for querying
  author: string;
  tags: string[]; // Comma-separated string to array
  imageUrl: string;
  imageHint?: string;
}

export interface BlogPost extends BlogPostFormData {
  id: string;
  createdAt: Timestamp;
}

export interface SkillExperienceFormData {
  name: string;
  type: 'skill' | 'experience'; // To differentiate between skill and experience
  category?: string; // e.g., "Frontend", "Backend" for skills
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'; // For skills
  company?: string; // For experience
  role?: string; // For experience
  dateRange?: string; // For experience, e.g., "Jan 2020 - Present"
  description: string;
  details?: string[]; // For experience responsibilities, or skill specifics
}

export interface SkillExperience extends SkillExperienceFormData {
  id: string;
  createdAt: Timestamp;
}

