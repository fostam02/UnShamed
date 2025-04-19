import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nykarpzbbrrvusqapzol.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55a2FycHpiYnJydnVzcWFwem9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NTQ4NjEsImV4cCI6MjA2MDQzMDg2MX0.c5cXE2S3S6T3nxxKWVfRCGx6TQYqiDdgwYmfXLw-YS8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
  const email = 'test.user@gmail.com';
  const password = 'password123';
  
  try {
    console.log('Attempting to sign in with:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Error signing in:', error);
      return;
    }
    
    console.log('Sign in successful:', data);
    
    // Get user profile
    if (data.user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
      }
      
      console.log('User profile:', profile);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testLogin();