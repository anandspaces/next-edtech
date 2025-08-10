// Development logging utility
export const logger = {
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`ℹ️ ${message}`, data || '');
    }
  },
  
  success: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ ${message}`, data || '');
    }
  },
  
  error: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ ${message}`, data || '');
    }
  },
  
  connection: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔗 ${message}`, data || '');
    }
  },
  
  user: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`👤 ${message}`, data || '');
    }
  }
};
