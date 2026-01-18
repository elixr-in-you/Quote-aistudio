import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // We set the third parameter to '' to load all env vars regardless of prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    // This defines the global constant process.env.API_KEY in the browser
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});