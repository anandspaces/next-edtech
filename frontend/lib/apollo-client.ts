import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { logger } from './logger';

// Connect to the backend GraphQL server
const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL;

// Log the API connection details
logger.connection('Apollo Client Configuration');
logger.info(`GraphQL URL: ${graphqlUrl || 'NOT SET - Check environment variables!'}`);
logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);

const httpLink = createHttpLink({
  uri: graphqlUrl,
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

  // Log request details (only in development)
  logger.connection('Making GraphQL request', {
    url: graphqlUrl,
    userId: user?.id || 'anonymous',
    userName: user?.name || 'not logged in',
    timestamp: new Date().toLocaleTimeString()
  });

  return {
    headers: {
      ...headers,
      // Send user ID in header for backend authentication
      'x-user-id': user?.id || '',
      'content-type': 'application/json',
    }
  }
});

// Error link for logging API errors
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      logger.error('GraphQL Error', {
        message,
        locations,
        path,
        operation: operation.operationName
      });
    });
  }

  if (networkError) {
    logger.error('Network Error', {
      message: networkError.message,
      url: graphqlUrl,
      operation: operation.operationName
    });
  }
});

export const apolloClient = new ApolloClient({
  link: errorLink.concat(authLink).concat(httpLink),
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