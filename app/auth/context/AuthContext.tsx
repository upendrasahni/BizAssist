import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContextType, User } from "./types";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const STORAGE_KEY = "BA::user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setUser(JSON.parse(raw));
      } catch (e) {
        console.warn("AuthProvider: failed to load user", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = async (u: User | null) => {
    if (!u) {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setUser(null);
      return;
    }
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    setUser(u);
  };

  const signUp = async (name: string, email: string, password: string) => {
    if (!email || !password || !name) throw new Error("Missing fields");
    const newUser: User = {
      id: `${Date.now()}`,
      name,
      email: email.toLowerCase(),
    };
    await persist(newUser);
    return newUser;
  };

  const signIn = async (email: string, password: string) => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("No account found. Please sign up.");

    const existing: User = JSON.parse(raw);
    if (existing.email !== email.toLowerCase())
      throw new Error("Invalid credentials.");

    await persist(existing);
    return existing;
  };

  const signOut = async () => {
    await persist(null);
  };

  const value = useMemo(
    () => ({ user, signIn, signUp, signOut, loading }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Add this hook export
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
