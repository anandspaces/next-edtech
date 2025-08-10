import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Connect to the backend GraphQL server
const httpLink = createHttpLink({
  uri: process.env.NODE_ENV === 'production' 
    ? 'https://next-edtech.onrender.com/graphql' 
    : 'http://localhost:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
  // Get user from localStorage for authentication
  let user = null;
  if (typeof window !== 'undefined') {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const parsedAuth = JSON.parse(authStorage);
      user = parsedAuth?.state?.user;
    }
  }

  return {
    headers: {
      ...headers,
      // Send user ID in header for backend authentication
      'x-user-id': user?.id || '',
      'content-type': 'application/json',
    }
  }
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Course: {
        fields: {
          enrollments: {
            merge(existing = [], incoming) {
              return incoming;
            }
          }
        }
      },
      User: {
        fields: {
          enrollments: {
            merge(existing = [], incoming) {
              return incoming;
            }
          }
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});