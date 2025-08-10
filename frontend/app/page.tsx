'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@apollo/client';
import { useCourseStore, Course, CourseLevel } from '@/store/course-store';
import CourseGrid from '@/components/course/CourseGrid';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { GET_COURSES } from '@/lib/graphql/queries';
import { Course as BackendCourse, convertLevelToFrontend } from '@/lib/types';
import { getCourseImage } from '@/lib/course-images';



const HomePage: React.FC = () => {
  const { courses, setCourses } = useCourseStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel | 'All'>('All');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  // Fetch courses from GraphQL backend
  const { data: coursesData, loading: coursesLoading, error: coursesError } = useQuery(GET_COURSES);

  useEffect(() => {
    if (coursesData?.courses) {
      // Convert backend courses to frontend format
      const frontendCourses: Course[] = coursesData.courses.map((backendCourse: BackendCourse) => ({
        id: backendCourse.id,
        title: backendCourse.title,
        description: backendCourse.description,
        level: convertLevelToFrontend(backendCourse.level),
        instructor: backendCourse.enrollments?.find(e => e.role === 'PROFESSOR')?.user?.name || 'Unknown',
        duration: '8-12 weeks', // Default duration
        students: backendCourse.enrollments?.length || 0,
        image: getCourseImage(backendCourse.id)
      }));
      setCourses(frontendCourses);
    }
  }, [coursesData, setCourses]);

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

  if (coursesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner 
          size="xl" 
          variant="dots" 
          text="Loading courses..." 
          className="p-8"
        />
      </div>
    );
  }

  if (coursesError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to load courses</h2>
          <p className="text-gray-600 mb-4">Please make sure the backend server is running.</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
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