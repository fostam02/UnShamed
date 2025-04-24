// Mock Supabase client for development
// This allows the app to work without actual Supabase credentials

// Create a mock Supabase client
const createMockClient = () => {
  console.log('Creating mock Supabase client');

  return {
    from: (table: string) => ({
      insert: (data: any) => {
        console.log(`Mock insert into ${table}:`, data);
        return Promise.resolve({ data, error: null });
      },
      select: (columns: string) => {
        console.log(`Mock select ${columns} from ${table}`);
        return {
          eq: (column: string, value: any) => {
            console.log(`Mock where ${column} = ${value}`);
            return Promise.resolve({ data: [], error: null });
          },
          order: (column: string, { ascending }: { ascending: boolean }) => {
            console.log(`Mock order by ${column} ${ascending ? 'ASC' : 'DESC'}`);
            return Promise.resolve({ data: [], error: null });
          },
          limit: (limit: number) => {
            console.log(`Mock limit ${limit}`);
            return Promise.resolve({ data: [], error: null });
          }
        };
      },
      update: (data: any) => {
        console.log(`Mock update ${table}:`, data);
        return {
          eq: (column: string, value: any) => {
            console.log(`Mock where ${column} = ${value}`);
            return Promise.resolve({ data, error: null });
          }
        };
      },
      delete: () => {
        console.log(`Mock delete from ${table}`);
        return {
          eq: (column: string, value: any) => {
            console.log(`Mock where ${column} = ${value}`);
            return Promise.resolve({ data: null, error: null });
          }
        };
      }
    }),
    auth: {
      onAuthStateChange: (callback: Function) => {
        console.log('Mock auth state change registered');
        return { data: { subscription: { unsubscribe: () => {} } }, error: null };
      },
      signUp: (credentials: any) => {
        console.log('Mock sign up:', credentials);
        return Promise.resolve({
          data: { user: { id: 'mock-user-id', email: credentials.email } },
          error: null
        });
      },
      signIn: (credentials: any) => {
        console.log('Mock sign in:', credentials);
        return Promise.resolve({
          data: { user: { id: 'mock-user-id', email: credentials.email } },
          error: null
        });
      },
      signOut: () => {
        console.log('Mock sign out');
        return Promise.resolve({ error: null });
      },
      getSession: () => {
        console.log('Mock get session');
        return Promise.resolve({
          data: { session: { user: { id: 'mock-user-id', email: 'mock@example.com' } } },
          error: null
        });
      }
    },
    storage: {
      from: (bucket: string) => ({
        upload: (path: string, file: File) => {
          console.log(`Mock upload to ${bucket}/${path}`);
          return Promise.resolve({ data: { path }, error: null });
        },
        getPublicUrl: (path: string) => {
          console.log(`Mock get public URL for ${bucket}/${path}`);
          return { data: { publicUrl: `https://mock-storage.com/${bucket}/${path}` } };
        },
        remove: (paths: string[]) => {
          console.log(`Mock remove from ${bucket}:`, paths);
          return Promise.resolve({ data: null, error: null });
        }
      })
    }
  };
};

// Export the mock client
export const supabase = createMockClient();
