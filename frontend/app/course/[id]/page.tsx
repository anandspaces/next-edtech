'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  ClockIcon, 
  UsersIcon, 
  CheckCircleIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/store/auth-store';
import { useCourseStore, Course } from '@/store/course-store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Mock courses data
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to React',
    description: 'Learn the fundamentals of React including components, hooks, and state management. This comprehensive course covers everything from basic concepts to advanced patterns, providing hands-on experience through practical projects.',
    level: 'Beginner',
    instructor: 'John Smith',
    duration: '8 weeks',
    students: 1234,
    image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '2',
    title: 'Advanced JavaScript Patterns',
    description: 'Master advanced JavaScript concepts including closures, prototypes, and design patterns. Dive deep into modern JavaScript features and learn how to write maintainable, scalable code.',
    level: 'Advanced',
    instructor: 'Sarah Johnson',
    duration: '12 weeks',
    students: 856,
    image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '3',
    title: 'Node.js Backend Development',
    description: 'Build robust backend applications with Node.js, Express, and MongoDB. Learn about RESTful APIs, authentication, and database integration in this intermediate-level course.',
    level: 'Intermediate',
    instructor: 'Mike Brown',
    duration: '10 weeks',
    students: 692,
    image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];

const CourseDetailPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { selectedCourse, setSelectedCourse, enrollInCourse, isEnrolled } = useCourseStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    // Simulate API call
    const fetchCourse = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const course = mockCourses.find(c => c.id === id);
      if (course) {
        setSelectedCourse(course);
      }
      setIsLoading(false);
    };

    fetchCourse();
  }, [id, setSelectedCourse]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!selectedCourse) return;

    setIsEnrolling(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    enrollInCourse(selectedCourse.id);
    setIsEnrolling(false);
    router.push(`/enrollment-confirmation/${selectedCourse.id}`);
  };

  const handleEdit = () => {
    router.push(`/course/${id}/edit`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!selectedCourse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <Button onClick={() => router.push('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const enrolled = isEnrolled(selectedCourse.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 py-8"
      >
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-64 md:h-80">
            <Image
              src={selectedCourse.image}
              alt={selectedCourse.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center space-x-3 mb-4">
                <Badge variant={selectedCourse.level === 'Beginner' ? 'secondary' : selectedCourse.level === 'Intermediate' ? 'default' : 'destructive'}>
                  {selectedCourse.level}
                </Badge>
                {enrolled && (
                  <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                    <CheckCircleIcon className="h-3 w-3" />
                    <span>Enrolled</span>
                  </div>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {selectedCourse.title}
              </h1>
              <p className="text-gray-200">
                Instructor: {selectedCourse.instructor}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Course</h2>
              <p className="text-gray-700 leading-relaxed">
                {selectedCourse.description}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Course Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium text-gray-900">{selectedCourse.duration}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <UsersIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Students</p>
                    <p className="font-medium text-gray-900">{selectedCourse.students} enrolled</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="space-y-4">
                {user?.role === 'professor' && (
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span>Edit Course</span>
                  </Button>
                )}
                
                {!enrolled ? (
                  <Button
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                    className="w-full"
                    size="lg"
                  >
                    {isEnrolling ? 'Enrolling...' : isAuthenticated ? 'Enroll Now' : 'Login to Enroll'}
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    className="w-full"
                    size="lg"
                    disabled
                  >
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Enrolled
                  </Button>
                )}
                
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">What you'll learn:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start space-x-2">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Core concepts and fundamentals</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Hands-on practical projects</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Industry best practices</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Real-world applications</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CourseDetailPage;