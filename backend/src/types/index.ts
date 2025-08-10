import { PrismaClient } from '@prisma/client';

// Define User type manually until Prisma client is properly generated
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Context {
  prisma: PrismaClient;
  user: User | null;
}

export interface EnrollUserInput {
  userId: string;
  courseId: string;
  role: 'STUDENT' | 'PROFESSOR';
}

export interface UpdateCourseInput {
  id: string;
  title?: string;
  description?: string;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
}