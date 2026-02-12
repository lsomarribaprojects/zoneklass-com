export interface User {
  id: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'moderator' | 'member';
  level: number;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  likes: number;
  comments: number;
  category: string;
  createdAt: string;
  isPinned?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  progress: number;
  modules: Module[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  duration?: string; // e.g., "10:00"
  completed: boolean;
  videoUrl?: string; // Placeholder for video
}
