import { gql } from '@apollo/client';

// Query to fetch all courses
export const GET_COURSES = gql`
  query GetCourses {
    courses {
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

// Query to fetch a single course by ID
export const GET_COURSE = gql`
  query GetCourse($id: ID!) {
    course(id: $id) {
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

// Query to fetch all users
export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      enrollments {
        id
        role
        course {
          id
          title
          level
        }
      }
    }
  }
`;

// Query to fetch a single user by ID
export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      enrollments {
        id
        role
        course {
          id
          title
          description
          level
        }
      }
    }
  }
`;
