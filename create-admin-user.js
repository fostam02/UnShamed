import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nykarpzbbrrvusqapzol.supabase.co';
const supabaseServiceKey = 'YOUR_SERVICE_ROLE_KEY'; // Get this from Supabase dashboard

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  const email = 'admin@unshamed.com';
  const password = 'Admin123!';
  
  try {
    // 1. Direct SQL to bypass email verification
    const { error: sqlError } = await supabase.rpc('force_create_admin_user', {
      p_email: email,
      p_password: password
    });

    if (sqlError) {
      // If RPC doesn't exist, we'll create it
      const createRpcSql = `
        CREATE OR REPLACE FUNCTION force_create_admin_user(p_email TEXT, p_password TEXT)
        RETURNS void
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          v_user_id UUID;
        BEGIN
          -- Delete existing user if exists
          DELETE FROM auth.users WHERE email = p_email;
          
          -- Insert new user
          INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            recovery_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change_token_new,
            email_change,
            phone_change,
            phone_change_token,
            phone_change_sent_at,
            confirmed_at,
            confirmation_sent_at,
            recovery_token,
            phone_confirmed_at,
            phone,
            phone_change_token_current,
            phone_change_token_new,
            email_change_token_current,
            email_change_confirm_status,
            banned_until,
            reauthentication_token,
            reauthentication_sent_at,
            is_super_admin,
            is_sso_user
          )
          VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            p_email,
            crypt(p_password, gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '{"provider": "email", "providers": ["email"], "role": "admin"}',
            '{"role": "admin"}',
            NOW(),
            NOW(),
            '',
            '',
            '',
            '',
            '',
            NOW(),
            NOW(),
            NOW(),
            '',
            NOW(),
            '',
            '',
            '',
            '',
            0,
            NULL,
            '',
            NOW(),
            FALSE,
            FALSE
          )
          RETURNING id INTO v_user_id;

          -- Insert into profiles table
          INSERT INTO public.profiles (id, email, role, email_confirmed)
          VALUES (v_user_id, p_email, 'admin', true);
          
          -- Grant all necessary permissions
          INSERT INTO auth.grants (user_id, role)
          VALUES (v_user_id, 'admin');
        END;
        $$;
      `;

      const { error: createError } = await supabase.rpc('exec_sql', { sql: createRpcSql });
      if (createError) {
        console.error('Error creating RPC:', createError);
        return;
      }

      // Try creating admin user again
      const { error: retryError } = await supabase.rpc('force_create_admin_user', {
        p_email: email,
        p_password: password
      });

      if (retryError) {
        console.error('Error in retry:', retryError);
        return;
      }
    }

    console.log('Admin user created successfully');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('\nYou can now log in with these credentials.');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createAdminUser();


