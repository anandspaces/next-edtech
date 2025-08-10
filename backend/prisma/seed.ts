import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'alice@example.com' },
      update: {},
      create: {
        name: 'Alice Johnson',
        email: 'alice@example.com',
      },
    }),
    prisma.user.upsert({
      where: { email: 'bob@example.com' },
      update: {},
      create: {
        name: 'Bob Smith',
        email: 'bob@example.com',
      },
    }),
    prisma.user.upsert({
      where: { email: 'charlie@example.com' },
      update: {},
      create: {
        name: 'Dr. Charlie Brown',
        email: 'charlie@example.com',
      },
    }),
  ]);

  // Create courses
  const courses = await Promise.all([
    prisma.course.upsert({
      where: { id: '1' },
      update: {},
      create: {
        title: 'Introduction to JavaScript',
        description: 'Learn the basics of JavaScript programming language',
        level: 'BEGINNER',
      },
    }),
    prisma.course.upsert({
      where: { id: '2' },
      update: {},
      create: {
        title: 'React Fundamentals',
        description: 'Build modern web applications with React',
        level: 'INTERMEDIATE',
      },
    }),
    prisma.course.upsert({
      where: { id: '3' },
      update: {},
      create: {
        title: 'Advanced Node.js',
        description: 'Master server-side JavaScript with Node.js',
        level: 'ADVANCED',
      },
    }),
    prisma.course.upsert({
      where: { id: '4' },
      update: {},
      create: {
        title: 'Database Design',
        description: 'Learn relational database design and SQL',
        level: 'INTERMEDIATE',
      },
    }),
    prisma.course.upsert({
      where: { id: '5' },
      update: {},
      create: {
        title: 'GraphQL Basics',
        description: 'Introduction to GraphQL APIs',
        level: 'BEGINNER',
      },
    }),
  ]);

  // Create enrollments
  await Promise.all([
    // Alice enrollments (student)
    prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: users[0].id,
          courseId: courses[0].id,
        },
      },
      update: {},
      create: {
        userId: users[0].id,
        courseId: courses[0].id,
        role: 'STUDENT',
      },
    }),
    prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: users[0].id,
          courseId: courses[1].id,
        },
      },
      update: {},
      create: {
        userId: users[0].id,
        courseId: courses[1].id,
        role: 'STUDENT',
      },
    }),

    // Bob enrollments (student)
    prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: users[1].id,
          courseId: courses[0].id,
        },
      },
      update: {},
      create: {
        userId: users[1].id,
        courseId: courses[0].id,
        role: 'STUDENT',
      },
    }),
    prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: users[1].id,
          courseId: courses[4].id,
        },
      },
      update: {},
      create: {
        userId: users[1].id,
        courseId: courses[4].id,
        role: 'STUDENT',
      },
    }),

    // Charlie enrollments (professor)
    prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: users[2].id,
          courseId: courses[2].id,
        },
      },
      update: {},
      create: {
        userId: users[2].id,
        courseId: courses[2].id,
        role: 'PROFESSOR',
      },
    }),
    prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: users[2].id,
          courseId: courses[3].id,
        },
      },
      update: {},
      create: {
        userId: users[2].id,
        courseId: courses[3].id,
        role: 'PROFESSOR',
      },
    }),
  ]);

  console.log('✅ Database seeded successfully!');
  console.log(`Created ${users.length} users`);
  console.log(`Created ${courses.length} courses`);
  console.log('Created sample enrollments');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });