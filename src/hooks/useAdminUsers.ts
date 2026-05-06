import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { UserProfile } from "../types";

export type AdminUser = UserProfile & { role?: "admin" | null };

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw new Error(profilesError.message);

      const { data: edgeData, error: edgeError } = await supabase.functions.invoke('set-admin-role', {
        method: 'POST',
        body: { action: 'list_users' }
      });

      if (edgeError) {
        console.error("Error fetching roles from edge function:", edgeError);
        setUsers((profiles ?? []) as AdminUser[]);
        setLoading(false);
        return;
      }

      const roleMap = new Map<string, "admin" | null>();
      if (edgeData && Array.isArray(edgeData.users)) {
        edgeData.users.forEach((u: any) => {
          roleMap.set(u.id, u.role);
        });
      }

      const mergedUsers = (profiles ?? []).map((p: any) => ({
        ...p,
        role: roleMap.get(p.id) ?? null
      })) as AdminUser[];

      setUsers(mergedUsers);
    } catch (err) {
      console.error("Failed to load admin users", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function setAdminRole(userId: string, isAdmin: boolean) {
    const { error } = await supabase.functions.invoke('set-admin-role', {
      method: 'POST',
      body: { 
        action: 'set_role',
        user_id: userId,
        is_admin: isAdmin
      }
    });

    if (error) throw new Error("Error setting admin role: " + error.message);
    
    setUsers((prev) => 
      prev.map((u) => u.id === userId ? { ...u, role: isAdmin ? "admin" : null } : u)
    );
  }

  return { users, loading, setAdminRole, refresh: load };
}
