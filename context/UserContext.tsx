"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { useRouter } from "next/navigation";

// UPDATED TYPE DEFINITION
type UserType = {
  id: string;
  phone: string;
  email: string;
  full_name: string;
  address?: string; // New
  city?: string;    // New
};

type UserContextType = {
  user: UserType | null;
  login: (phone: string, fullName: string, email?: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  refreshUser: () => Promise<void>; // New helper to re-fetch data
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUserId = localStorage.getItem("app_user_id");
    if (storedUserId) {
      fetchUser(storedUserId);
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchUser(id: string) {
    const { data } = await supabase.from("app_users").select("*").eq("id", id).single();
    if (data) setUser(data);
    setLoading(false);
  }

  // Helper to manually refresh user data (useful after checkout updates)
  async function refreshUser() {
    if (user?.id) await fetchUser(user.id);
  }

  const login = async (phone: string, fullName: string, email: string = "") => {
    let { data: existingUser } = await supabase.from("app_users").select("*").eq("phone", phone).single();
    
    if (existingUser) {
      // Update name/email if changed
      const { data: updatedUser } = await supabase
        .from("app_users")
        .update({ full_name: fullName, email: email || existingUser.email })
        .eq("id", existingUser.id)
        .select()
        .single();
        
      if (updatedUser) existingUser = updatedUser;
    } else {
      const { data: newUser, error } = await supabase
        .from("app_users")
        .insert([{ phone, full_name: fullName, email }])
        .select()
        .single();
      
      if (error) {
        console.error("Login Error:", error);
        return false;
      }
      existingUser = newUser;
    }

    setUser(existingUser);
    localStorage.setItem("app_user_id", existingUser.id);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("app_user_id");
    router.push("/"); 
    router.refresh();
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};