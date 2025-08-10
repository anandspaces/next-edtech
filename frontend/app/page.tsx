'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useCourseStore, Course, CourseLevel } from '@/store/course-store';
import CourseGrid from '@/components/course/CourseGrid';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';

// Mock courses data
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to React',
    description: 'Learn the fundamentals of React including components, hooks, and state management. This comprehensive course covers everything from basic concepts to advanced patterns.',
    level: 'Beginner',
    instructor: 'John Smith',
    duration: '8 weeks',
    students: 1234,
    image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '2',
    title: 'Advanced JavaScript Patterns',
    description: 'Master advanced JavaScript concepts including closures, prototypes, and design patterns. Dive deep into modern JavaScript features.',
    level: 'Advanced',
    instructor: 'Sarah Johnson',
    duration: '12 weeks',
    students: 856,
    image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '3',
    title: 'Node.js Backend Development',
    description: 'Build robust backend applications with Node.js, Express, and MongoDB. Learn about RESTful APIs and authentication.',
    level: 'Intermediate',
    instructor: 'Mike Brown',
    duration: '10 weeks',
    students: 692,
    image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '4',
    title: 'Python for Data Science',
    description: 'Explore data analysis and visualization using Python, pandas, and matplotlib. Perfect for beginners in data science.',
    level: 'Beginner',
    instructor: 'Emily Davis',
    duration: '6 weeks',
    students: 1567,
    image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '5',
    title: 'Machine Learning Fundamentals',
    description: 'Understanding machine learning algorithms, training models, and making predictions with real-world datasets.',
    level: 'Intermediate',
    instructor: 'David Wilson',
    duration: '14 weeks',
    students: 943,
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '6',
    title: 'Advanced React & TypeScript',
    description: 'Build complex applications with React, TypeScript, and modern development practices. Includes testing and deployment.',
    level: 'Advanced',
    instructor: 'Lisa Chen',
    duration: '16 weeks',
    students: 478,
    image: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];

const HomePage: React.FC = () => {
  const { courses, setCourses } = useCourseStore();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel | 'All'>('All');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  useEffect(() => {
    // Simulate API call
    const fetchCourses = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCourses(mockCourses);
      setIsLoading(false);
    };

    fetchCourses();
  }, [setCourses]);

  useEffect(() => {
    if (!courses) return;

    let filtered = courses;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by level
    if (selectedLevel !== 'All') {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }

    setFilteredCourses(filtered);
  }, [courses, searchTerm, selectedLevel]);

  const levels: (CourseLevel | 'All')[] = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Expand Your Knowledge
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Discover world-class courses taught by expert instructors. 
              Start your learning journey today and advance your career.
            </p>
            <div className="flex justify-center">
              <Button variant="secondary" size="lg">
                Explore Courses
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-7xl mx-auto px-4 py-8"
      >
        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-4">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <div className="flex space-x-2">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      selectedLevel === level
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Course Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="mb-6">
              <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto flex items-center justify-center">
                <MagnifyingGlassIcon className="h-12 w-12 text-gray-400" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No courses found
            </h2>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters.
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedLevel('All');
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        ) : (
          <CourseGrid courses={filteredCourses} />
        )}
      </motion.div>
    </div>
  );
};

export default HomePage;