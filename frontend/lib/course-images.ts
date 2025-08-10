// Demo course images mapping
export const COURSE_IMAGES = {
  '1': '/demo.png',
  '2': '/demo.png', 
  '3': '/demo.png',
  '4': '/demo.png',
  '5': '/demo.png',
  // Add more course IDs as needed
};

// Fallback demo image
export const DEFAULT_COURSE_IMAGE = '/demo.png';

// Function to get course image by ID
export const getCourseImage = (courseId: string): string => {
  return COURSE_IMAGES[courseId as keyof typeof COURSE_IMAGES] || DEFAULT_COURSE_IMAGE;
};
