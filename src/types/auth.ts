export interface UserProfile {
  name: string;
  email: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
