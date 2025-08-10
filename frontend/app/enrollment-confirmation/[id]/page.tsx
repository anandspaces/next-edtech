'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircleIcon, HomeIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { useCourseStore, Course } from '@/store/course-store';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { getCourseImage } from '@/lib/course-images';

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

const EnrollmentConfirmationPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const foundCourse = mockCourses.find(c => c.id === id);
      setCourse(foundCourse || null);
      setIsLoading(false);
    };

    fetchCourse();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <LoadingSpinner 
          size="lg" 
          variant="pulse" 
          text="Processing enrollment..." 
          className="p-8"
        />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <Button onClick={() => router.push('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-green-100 rounded-full p-3">
            <CheckCircleIcon className="h-12 w-12 text-green-600" />
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Enrollment Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            You have successfully enrolled in the course
          </p>
        </motion.div>

        {/* Course Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-50 rounded-lg p-4 mb-6 text-left"
        >
          <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p>Instructor: {course.instructor}</p>
            <p>Duration: {course.duration}</p>
            <p>Level: {course.level}</p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          <Button
            onClick={() => router.push(`/course/${course.id}`)}
            className="w-full flex items-center justify-center space-x-2"
          >
            <BookOpenIcon className="h-4 w-4" />
            <span>View Course</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="w-full flex items-center justify-center space-x-2"
          >
            <HomeIcon className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>
        </motion.div>

        {/* Celebration Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-xs text-gray-500"
        >
          🎉 Welcome to your learning journey!
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EnrollmentConfirmationPage;