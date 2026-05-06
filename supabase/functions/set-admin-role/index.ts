import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !serviceRoleKey || !supabaseAnonKey) {
      throw new Error("Missing environment variables");
    }

    const authHeader = req.headers.get("Authorization") ?? "";
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    const role = user.user_metadata?.role;
    if (role !== "admin") {
      return new Response(JSON.stringify({ error: "Forbidden: Admins only" }), { 
        status: 403, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
    
    const { action, user_id, is_admin } = await req.json();

    if (action === 'list_users') {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers();
      if (error) throw error;
      
      const usersData = data.users.map(u => ({
        id: u.id,
        role: u.user_metadata?.role ?? null
      }));

      return new Response(JSON.stringify({ users: usersData }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } 
    
    if (action === 'set_role') {
      if (!user_id) {
         throw new Error("user_id is required");
      }
      
      const { data, error } = await supabaseAdmin.auth.admin.updateUserById(user_id, {
        user_metadata: { role: is_admin ? 'admin' : null }
      });

      if (error) throw error;

      return new Response(JSON.stringify({ success: true, user: { id: data.user.id, role: data.user.user_metadata?.role } }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
