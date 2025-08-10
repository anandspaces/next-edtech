import { NextResponse } from 'next/server';

// This endpoint is no longer needed as we're connecting directly to the backend GraphQL server
// Keeping it for potential proxy functionality in the future

export async function POST(request: Request) {
  return NextResponse.json({
    error: 'This endpoint is deprecated. Frontend now connects directly to api/graphql'
  }, { status: 410 });
}

export async function GET() {
  return NextResponse.json({
    message: 'Frontend GraphQL proxy - deprecated. Use api/graphql directly.'
  });
}