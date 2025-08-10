import { NextResponse } from 'next/server';

// Mock GraphQL endpoint for demonstration
export async function POST(request: Request) {
  const { query, variables } = await request.json();
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock response based on query
  if (query.includes('courses')) {
    return NextResponse.json({
      data: {
        courses: [
          {
            id: '1',
            title: 'Introduction to React',
            description: 'Learn the fundamentals of React',
            level: 'Beginner',
            instructor: 'John Smith',
            duration: '8 weeks',
            students: 1234
          }
        ]
      }
    });
  }
  
  return NextResponse.json({
    data: null,
    errors: [{ message: 'Query not supported' }]
  });
}

export async function GET() {
  return NextResponse.json({
    message: 'GraphQL endpoint is running'
  });
}