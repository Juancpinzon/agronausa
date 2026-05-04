import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { UserProfile, Product } from "../types";

export interface RegisterInput {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  customer_type: "persona" | "negocio";
  business_name?: string;
  nit?: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  /** Returns the price this user should pay for a given product. */
  getEffectivePrice: (product: Product) => number;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [specialPricing, setSpecialPricing] = useState<Record<string, number>>(
    {}
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        void loadProfile(s.user.id);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        void loadProfile(s.user.id);
      } else {
        setProfile(null);
        setSpecialPricing({});
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(userId: string) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (data) {
      const p = data as UserProfile;
      setProfile(p);
      if (p.has_special_pricing) {
        await loadSpecialPricing(userId);
      }
    }
    setLoading(false);
  }

  async function loadSpecialPricing(userId: string) {
    const { data } = await supabase
      .from("special_pricing")
      .select("product_id, price")
      .eq("customer_id", userId);

    if (data) {
      const map: Record<string, number> = {};
      for (const row of data) {
        map[row.product_id as string] = row.price as number;
      }
      setSpecialPricing(map);
    }
  }

  async function login(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
  }

  async function register(input: RegisterInput) {
    const { email, password, ...meta } = input;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: meta },
    });
    if (error) throw new Error(error.message);
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  function getEffectivePrice(product: Product): number {
    if (!profile || profile.customer_type !== "negocio") {
      return product.price_retail;
    }
    if (
      profile.has_special_pricing &&
      specialPricing[product.id] !== undefined
    ) {
      return specialPricing[product.id]!;
    }
    return product.price_retail;
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        login,
        register,
        logout,
        getEffectivePrice,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
