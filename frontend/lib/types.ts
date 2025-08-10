// GraphQL Types matching the backend schema
export type LevelEnum = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type RoleEnum = 'STUDENT' | 'PROFESSOR';

export interface User {
  id: string;
  name: string;
  email: string;
  enrollments?: Enrollment[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: LevelEnum;
  enrollments?: Enrollment[];
}

export interface Enrollment {
  id: string;
  role: RoleEnum;
  user: User;
  course: Course;
}

// Frontend-specific types
export interface FrontendCourse extends Omit<Course, 'level'> {
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor?: string;
  duration?: string;
  students?: number;
  image?: string;
}

// Helper function to convert backend level to frontend level
export const convertLevelToFrontend = (level: LevelEnum): 'Beginner' | 'Intermediate' | 'Advanced' => {
  switch (level) {
    case 'BEGINNER':
      return 'Beginner';
    case 'INTERMEDIATE':
      return 'Intermediate';
    case 'ADVANCED':
      return 'Advanced';
    default:
      return 'Beginner';
  }
};

// Helper function to convert frontend level to backend level
export const convertLevelToBackend = (level: 'Beginner' | 'Intermediate' | 'Advanced'): LevelEnum => {
  switch (level) {
    case 'Beginner':
      return 'BEGINNER';
    case 'Intermediate':
      return 'INTERMEDIATE';
    case 'Advanced':
      return 'ADVANCED';
    default:
      return 'BEGINNER';
  }
};
