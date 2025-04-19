import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nykarpzbbrrvusqapzol.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55a2FycHpiYnJydnVzcWFwem9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NTQ4NjEsImV4cCI6MjA2MDQzMDg2MX0.c5cXE2S3S6T3nxxKWVfRCGx6TQYqiDdgwYmfXLw-YS8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTestUser() {
  const email = 'test.user@gmail.com';
  const password = 'password123';
  
  try {
    // First, check if user exists
    const { data: existingUser } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (!existingUser?.user) {
      // Create new user if doesn't exist
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        console.error('Error creating user:', error);
        return;
      }
      
      console.log('User created successfully:', data);
      
      // Create a profile for the user
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: email,
              email_confirmed: true // Add this field
            }
          ]);
          
        if (profileError) {
          console.error('Error creating profile:', profileError);
          return;
        }
        
        console.log('Profile created successfully');
      }
    } else {
      console.log('Test user already exists');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createTestUser();
