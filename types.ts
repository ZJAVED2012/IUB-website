export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: 'Event' | 'Notice' | 'Result' | 'General';
  excerpt: string;
}

export interface Publication {
  title: string;
  year?: string;
  journal?: string;
  link?: string;
}

export interface FacultyMember {
  name: string;
  designation: string;
  qualification: string;
  image?: string;
  bio?: string;
  linkedin?: string;
  website?: string;
  researchInterests?: string[];
  publications?: (string | Publication)[];
  conferences?: string[];
  researchPapers?: string[];
}

export interface Program {
  name: string;
  description: string;
  duration: string;
}

export interface Department {
  id: string;
  name: string;
  faculty: string;
  image: string;
  description?: string;
  headOfDepartment?: string;
  researchAreas?: string[];
  facultyMembers?: FacultyMember[];
  programsOffered?: Program[];
  contactEmail?: string;
  contactPhone?: string;
}

export interface StatItem {
  label: string;
  value: string;
  icon: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}