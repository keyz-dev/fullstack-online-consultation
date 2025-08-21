declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Backend API URLs
      NEXT_PUBLIC_LOCAL_BACKEND_API_URL: string;
      NEXT_PUBLIC_REMOTE_BACKEND_API_URL?: string;

      // App Configuration
      NEXT_PUBLIC_APP_NAME?: string;
      NEXT_PUBLIC_VERSION?: string;

      // Node.js built-in variables
      NODE_ENV: "development" | "production" | "test";
    }
  }
}

export {};
