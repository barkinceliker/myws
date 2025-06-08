
import type { Timestamp } from 'firebase/firestore';

export interface ProjectFormData {
  title: string;
  description: string;
  imageUrl: string;
  imageHint?: string;
  tags: string[];
  liveDemoUrl?: string;
  repoUrl?: string;
}

export interface Project extends ProjectFormData {
  id: string;
  createdAt?: Timestamp; // Optional for form, required for display
  updatedAt?: Timestamp;
}

export interface BlogPostFormData {
  slug: string;
  title: string;
  content: string;
  publicationDate: string;
  author: string;
  tags: string[];
  imageUrl: string;
  imageHint?: string;
}

export interface BlogPost extends BlogPostFormData {
  id: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface SkillExperienceFormData {
  name: string;
  type: 'skill' | 'experience';
  category?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  company?: string;
  role?: string;
  dateRange?: string;
  description: string;
  details?: string[];
}

export interface SkillExperience extends SkillExperienceFormData {
  id: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// --- New Types for Home, About, Resume ---

// Home Page Content
export interface HomeContentFormData {
  heroTitle: string;
  heroSubtitle: string;
  heroCtaButtonText: string;
  heroCtaLink: string; // e.g., "#projects"
  heroSecondaryButtonText: string;
  heroSecondaryLink: string; // e.g., "#about"
  exploreTitle: string;
  exploreAboutTitle: string;
  exploreAboutDescription: string;
  exploreProjectsTitle: string;
  exploreProjectsDescription: string;
  exploreBlogTitle: string;
  exploreBlogDescription: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonText: string;
  ctaButtonLink: string; // e.g., a mailto link or /contact
}

export interface HomeContent extends HomeContentFormData {
  id: string; // Should be a fixed ID like "main"
  updatedAt?: Timestamp;
}


// About Page Content
export interface CoreValueFormData {
  title: string;
  description: string;
  // Icon name could be added here if we want to make icons dynamic
}
export interface AboutContentFormData {
  pageTitle: string;
  pageDescription: string;
  portraitImageUrl: string;
  portraitImageHint: string;
  greetingName: string; // "Hi, I'm [Your Name]"
  profession: string; // "[Your Profession/Title]"
  keySkill1: string;
  keySkill2: string;
  keySkill3: string;
  bioIntro: string; // "My journey into the world of [Your Field] began with a fascination for [Initial Spark/Interest]..."
  bioCollaboration: string; // "I thrive in collaborative environments..."
  bioPersonal: string; // "Beyond my professional pursuits, I'm an avid [Hobby 1]..."
  coreValuesTitle: string;
  coreValues: CoreValueFormData[];
}

export interface AboutContent extends AboutContentFormData {
  id: string; // Should be a fixed ID like "main"
  updatedAt?: Timestamp;
}

// Resume - Experience Item
export interface ExperienceFormData {
  role: string;
  company: string;
  dateRange: string;
  responsibilities: string[]; // Textarea, one per line
}

export interface ExperienceItem extends ExperienceFormData {
  id: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Resume - Education Item
export interface EducationFormData {
  degree: string;
  institution: string;
  dateRange: string;
  details: string; // Can be a paragraph or bullet points (managed as single string for now)
}

export interface EducationItem extends EducationFormData {
  id: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
