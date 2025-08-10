'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';

const EditCoursePage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 py-8"
      >
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center space-x-2 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Back</span>
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="text-center py-12">
            <div className="mb-4">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
                <span className="text-2xl">🚧</span>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Edit Course Feature
            </h2>
            
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              This is a placeholder for the course editing functionality. In a full implementation, 
              you would have form fields to edit course details, upload new images, and manage course content.
            </p>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Course ID: {id}
              </p>
              
              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EditCoursePage;