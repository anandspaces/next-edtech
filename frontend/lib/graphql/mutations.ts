import { gql } from '@apollo/client';

// Mutation to enroll a user in a course
export const ENROLL_USER = gql`
  mutation EnrollUser($userId: ID!, $courseId: ID!, $role: RoleEnum!) {
    enrollUser(userId: $userId, courseId: $courseId, role: $role) {
      id
      role
      user {
        id
        name
        email
      }
      course {
        id
        title
        description
        level
      }
    }
  }
`;

// Mutation to update a course (for professors)
export const UPDATE_COURSE = gql`
  mutation UpdateCourse($id: ID!, $title: String, $description: String, $level: LevelEnum) {
    updateCourse(id: $id, title: $title, description: $description, level: $level) {
      id
      title
      description
      level
      enrollments {
        id
        role
        user {
          id
          name
          email
        }
      }
    }
  }
`;
