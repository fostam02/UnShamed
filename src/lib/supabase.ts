import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

// Add debug log
console.log('Initializing Supabase with URL:', supabaseUrl);

// Create Supabase client with better error handling
let supabaseClient;

try {
  // Create the client with auto refresh token and persistent session
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });

  // Test the connection
  supabaseClient.auth.onAuthStateChange((event, session) => {
    console.log('Supabase auth state changed:', event, session ? 'User session exists' : 'No user session');
  });
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  // Create a fallback client that will show appropriate errors
  supabaseClient = createClient(supabaseUrl || 'https://example.com', supabaseAnonKey || 'fallback-key');
}

export const supabase = supabaseClient;
