import { Course, Post, User } from './types';

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Luis Somarriba', role: 'admin', level: 20 },
  { id: '2', name: 'Maria Gonzalez', role: 'member', level: 5 },
  { id: '3', name: 'John Doe', role: 'member', level: 2 },
  { id: '4', name: 'Jane Smith', role: 'moderator', level: 12 },
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    author: MOCK_USERS[0],
    content: 'Welcome to ZoneKlass! Here are the community guidelines. Make sure to complete your profile and introduce yourself in the comments below.',
    likes: 42,
    comments: 12,
    category: 'Announcements',
    createdAt: '2 days ago',
    isPinned: true,
  },
  {
    id: 'p2',
    author: MOCK_USERS[1],
    content: 'Does anyone know how to integrate payment gateways? I\'ve been trying to set up Stripe but getting some errors with the webhook configuration.',
    likes: 8,
    comments: 3,
    category: 'General',
    createdAt: '3 hours ago',
  },
  {
    id: 'p3',
    author: MOCK_USERS[2],
    content: 'Just finished the Module 2 of the React course! The useEffect hook finally makes sense now. Thanks for the great explanation!',
    likes: 15,
    comments: 5,
    category: 'Wins',
    createdAt: '5 hours ago',
  },
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Web Development Mastery',
    description: 'Learn the full stack from scratch. HTML, CSS, JavaScript, React, Node.js.',
    imageUrl: 'https://placehold.co/600x400/6366f1/white?text=Web+Dev', // Using placeholder service for now
    progress: 35,
    modules: [
      {
        id: 'm1',
        title: 'Introduction to HTML & CSS',
        lessons: [
          { id: 'l1', title: 'Setting up your environment', completed: true, duration: '10:00' },
          { id: 'l2', title: 'HTML structure', completed: true, duration: '15:30' },
          { id: 'l3', title: 'CSS basics', completed: false, duration: '20:00' },
        ],
      },
      {
        id: 'm2',
        title: 'JavaScript Fundamentals',
        lessons: [
          { id: 'l4', title: 'Variables and Data Types', completed: false, duration: '12:00' },
          { id: 'l5', title: 'Functions and Scope', completed: false, duration: '18:45' },
        ],
      },
    ],
  },
  {
    id: 'c2',
    title: 'Design Systems & UI/UX',
    description: 'Create beautiful user interfaces and scalable design systems.',
    imageUrl: 'https://placehold.co/600x400/ec4899/white?text=UI+UX',
    progress: 0,
    modules: [],
  },
];
