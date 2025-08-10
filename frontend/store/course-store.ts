import { create } from 'zustand';

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Course {
  id: string;
  title: string;
  description: string;
  level: CourseLevel;
  instructor: string;
  duration: string;
  students: number;
  image: string;
}

interface CourseState {
  courses: Course[] | null;
  selectedCourse: Course | null;
  enrolledCourses: string[];
  setCourses: (courses: Course[]) => void;
  setSelectedCourse: (course: Course | null) => void;
  enrollInCourse: (courseId: string) => void;
  isEnrolled: (courseId: string) => boolean;
}

export const useCourseStore = create<CourseState>()((set, get) => ({
  courses: null,
  selectedCourse: null,
  enrolledCourses: [],
  setCourses: (courses) => set({ courses }),
  setSelectedCourse: (course) => set({ selectedCourse: course }),
  enrollInCourse: (courseId) => {
    const { enrolledCourses } = get();
    if (!enrolledCourses.includes(courseId)) {
      set({ enrolledCourses: [...enrolledCourses, courseId] });
    }
  },
  isEnrolled: (courseId) => {
    const { enrolledCourses } = get();
    return enrolledCourses.includes(courseId);
  },
}));