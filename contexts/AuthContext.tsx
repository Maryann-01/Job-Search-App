"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { auth } from "@/lib/firebase"; 

const SESSION_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // 7days session expiration time (in milliseconds)

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkSessionExpiration = () => {
      const lastLoginTime = localStorage.getItem('lastLoginTime');
      
      if (lastLoginTime && user) {
        const now = Date.now();
        const loginTimestamp = parseInt(lastLoginTime, 10);
        
        if (now - loginTimestamp > SESSION_EXPIRATION) {
          logout();
        }
      }
    };
    checkSessionExpiration();
    const interval = setInterval(checkSessionExpiration, 15 * 60 * 1000);  // Added interval to periodically check (e.g., every 15 minutes)
    
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        localStorage.setItem('lastLoginTime', Date.now().toString());
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

 const login = async () => {
  if (loading) return; 
  setLoading(true); 
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    localStorage.setItem('lastLoginTime', Date.now().toString());
  } catch (error) {
    console.error("Login error:", error);
  } finally {
    setLoading(false);
  }
};

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('lastLoginTime');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};