'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@apollo/client';
import { useAuthStore, UserRole } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { GET_USERS } from '@/lib/graphql/queries';
import { User } from '@/lib/types';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { loginWithBackendUser } = useAuthStore();
  const router = useRouter();
  
  // Fetch users from backend for authentication
  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    setIsLoading(true);
    setError('');
    
    try {
      // Check if user exists in backend
      const backendUser = usersData?.users?.find((user: User) => 
        user.email.toLowerCase() === email.toLowerCase()
      );
      
      if (backendUser) {
        // User found in backend, log them in with backend user data
        loginWithBackendUser(backendUser, role);
        router.push('/');
      } else {
        // For demo purposes, show available users
        setError(`User not found. Available demo users: ${usersData?.users?.map((u: User) => u.email).join(', ')}`);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <AcademicCapIcon className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to access your courses</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="student">Student</option>
              <option value="professor">Professor</option>
            </select>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || usersLoading || !email || !name}
          >
            {isLoading || usersLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Demo users:</p>
          <div className="mt-2 space-y-1">
            <p>• alice@example.com (Alice Johnson)</p>
            <p>• bob@example.com (Bob Smith)</p>
            <p>• charlie@example.com (Dr. Charlie Brown)</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;