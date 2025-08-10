export const typeDefs = `#graphql
  enum LevelEnum {
    BEGINNER
    INTERMEDIATE
    ADVANCED
  }

  enum RoleEnum {
    STUDENT
    PROFESSOR
  }

  type User {
    id: ID!
    name: String!
    email: String!
    enrollments: [Enrollment!]!
  }

  type Course {
    id: ID!
    title: String!
    description: String!
    level: LevelEnum!
    enrollments: [Enrollment!]!
  }

  type Enrollment {
    id: ID!
    role: RoleEnum!
    user: User!
    course: Course!
  }

  type Query {
    courses: [Course!]!
    course(id: ID!): Course
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    enrollUser(userId: ID!, courseId: ID!, role: RoleEnum!): Enrollment!
    updateCourse(id: ID!, title: String, description: String, level: LevelEnum): Course!
  }
`;