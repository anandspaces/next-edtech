import { GraphQLError } from 'graphql';
import { Context, EnrollUserInput, UpdateCourseInput } from '../types';

export const resolvers = {
  Query: {
    courses: async (_: any, __: any, { prisma }: Context) => {
      try {
        return await prisma.course.findMany({
          include: {
            enrollments: {
              include: {
                user: true,
              },
            },
          },
        });
      } catch (error) {
        throw new GraphQLError('Failed to fetch courses', {
          extensions: { code: 'INTERNAL_ERROR' },
        });
      }
    },

    course: async (_: any, { id }: { id: string }, { prisma }: Context) => {
      try {
        const course = await prisma.course.findUnique({
          where: { id },
          include: {
            enrollments: {
              include: {
                user: true,
              },
            },
          },
        });

        if (!course) {
          throw new GraphQLError('Course not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }

        return course;
      } catch (error) {
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError('Failed to fetch course', {
          extensions: { code: 'INTERNAL_ERROR' },
        });
      }
    },

    users: async (_: any, __: any, { prisma }: Context) => {
      try {
        return await prisma.user.findMany({
          include: {
            enrollments: {
              include: {
                course: true,
              },
            },
          },
        });
      } catch (error) {
        throw new GraphQLError('Failed to fetch users', {
          extensions: { code: 'INTERNAL_ERROR' },
        });
      }
    },

    user: async (_: any, { id }: { id: string }, { prisma }: Context) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id },
          include: {
            enrollments: {
              include: {
                course: true,
              },
            },
          },
        });

        if (!user) {
          throw new GraphQLError('User not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }

        return user;
      } catch (error) {
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError('Failed to fetch user', {
          extensions: { code: 'INTERNAL_ERROR' },
        });
      }
    },
  },

  Mutation: {
    enrollUser: async (
      _: any,
      { userId, courseId, role }: EnrollUserInput,
      { prisma }: Context
    ) => {
      try {
        // Check if user exists
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
          throw new GraphQLError('User not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }

        // Check if course exists
        const course = await prisma.course.findUnique({ where: { id: courseId } });
        if (!course) {
          throw new GraphQLError('Course not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }

        // Check if enrollment already exists
        const existingEnrollment = await prisma.enrollment.findFirst({
          where: { userId, courseId },
        });

        if (existingEnrollment) {
          throw new GraphQLError('User is already enrolled in this course', {
            extensions: { code: 'ALREADY_EXISTS' },
          });
        }

        // Create enrollment
        const enrollment = await prisma.enrollment.create({
          data: { userId, courseId, role },
          include: {
            user: true,
            course: true,
          },
        });

        return enrollment;
      } catch (error) {
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError('Failed to enroll user', {
          extensions: { code: 'INTERNAL_ERROR' },
        });
      }
    },

    updateCourse: async (
      _: any,
      { id, title, description, level }: UpdateCourseInput,
      { prisma, user }: Context
    ) => {
      try {
        // Check if user is authenticated
        if (!user) {
          throw new GraphQLError('Authentication required', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }

        // Check if course exists
        const course = await prisma.course.findUnique({ 
          where: { id },
          include: {
            enrollments: {
              where: { userId: user.id },
            },
          },
        });

        if (!course) {
          throw new GraphQLError('Course not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }

                 // Check if user is a professor of this course
         const isProfessor = course.enrollments.some(
           (enrollment: any) => enrollment.role === 'PROFESSOR'
         );

        if (!isProfessor) {
          throw new GraphQLError('Only professors can update courses', {
            extensions: { code: 'FORBIDDEN' },
          });
        }

        // Update course
        const updatedCourse = await prisma.course.update({
          where: { id },
          data: {
            ...(title && { title }),
            ...(description && { description }),
            ...(level && { level }),
          },
          include: {
            enrollments: {
              include: {
                user: true,
              },
            },
          },
        });

        return updatedCourse;
      } catch (error) {
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError('Failed to update course', {
          extensions: { code: 'INTERNAL_ERROR' },
        });
      }
    },
  },

  // Field resolvers
  Course: {
    enrollments: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.enrollment.findMany({
        where: { courseId: parent.id },
        include: {
          user: true,
        },
      });
    },
  },

  User: {
    enrollments: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.enrollment.findMany({
        where: { userId: parent.id },
        include: {
          course: true,
        },
      });
    },
  },
};