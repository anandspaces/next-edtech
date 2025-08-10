'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '@/store/auth-store';
import { useCourseStore, Course } from '@/store/course-store';
import CourseGrid from '@/components/course/CourseGrid';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Mock courses data
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to React',
    description: 'Learn the fundamentals of React including components, hooks, and state management.',
    level: 'Beginner',
    instructor: 'John Smith',
    duration: '8 weeks',
    students: 1234,
    image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '2',
    title: 'Advanced JavaScript Patterns',
    description: 'Master advanced JavaScript concepts including closures, prototypes, and design patterns.',
    level: 'Advanced',
    instructor: 'Sarah Johnson',
    duration: '12 weeks',
    students: 856,
    image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '3',
    title: 'Node.js Backend Development',
    description: 'Build robust backend applications with Node.js, Express, and MongoDB.',
    level: 'Intermediate',
    instructor: 'Mike Brown',
    duration: '10 weeks',
    students: 692,
    image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];

const MyCoursesPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { enrolledCourses } = useCourseStore();
  const [enrolledCoursesData, setEnrolledCoursesData] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchEnrolledCourses = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const enrolled = mockCourses.filter(course => 
        enrolledCourses.includes(course.id)
      );
      
      setEnrolledCoursesData(enrolled);
      setIsLoading(false);
    };

    fetchEnrolledCourses();
  }, [isAuthenticated, enrolledCourses, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 py-8"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
          <p className="text-gray-600">
            Manage and continue your learning journey
          </p>
        </div>

        {enrolledCoursesData.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="mb-6">
              <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto flex items-center justify-center">
                <BookOpenIcon className="h-12 w-12 text-gray-400" />
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Enrolled Courses
            </h2>
            
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You haven't enrolled in any courses yet. Browse our course catalog 
              to start your learning journey.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Browse Courses
            </motion.button>
          </motion.div>
        ) : (
          <CourseGrid courses={enrolledCoursesData} />
        )}
      </motion.div>
    </div>
  );
};

export default MyCoursesPage;