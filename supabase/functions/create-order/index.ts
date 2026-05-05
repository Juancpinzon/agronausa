import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration variables");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract user if logged in
    const authHeader = req.headers.get("Authorization");
    let customer_id = null;

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);
      if (!userError && user) {
        customer_id = user.id;
      }
    }

    const body = await req.json();
    const {
      cartItems,
      customer,
      shippingAddress,
      notes,
      consentRequired,
      consentMarketing,
      policyVersion,
    } = body;

    // 1. Validate Consent (Ley 1581/2012)
    if (!consentRequired) {
      return new Response(
        JSON.stringify({ error: "El consentimiento para el tratamiento de datos es obligatorio." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Generate Order Number
    const year = new Date().getFullYear();
    const prefix = `AGN-${year}-`;

    const { count, error: countError } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .like("order_number", `${prefix}%`);

    if (countError) throw countError;

    const next = (count ?? 0) + 1;
    const orderNumber = `${prefix}${String(next).padStart(4, "0")}`;

    // 3. Prepare Items
    const items = cartItems.map((i: any) => ({
      product_id: i.product_id,
      product_name: i.product_name,
      quantity: i.quantity,
      unit: i.unit,
      price_applied: i.price_applied,
      subtotal: i.price_applied * i.quantity,
    }));

    const subtotal = items.reduce((s: number, i: any) => s + i.subtotal, 0);
    const total = subtotal;

    // 4. Create Payload
    const payload = {
      order_number: orderNumber,
      customer_id,
      customer_snapshot: {
        ...customer,
        consent_marketing: consentMarketing,
        policy_version: policyVersion,
      },
      items,
      subtotal,
      total,
      status: "pendiente",
      shipping_address: shippingAddress,
      notes: notes ?? null,
    };

    // 5. Insert Order
    const { data, error: insertError } = await supabase
      .from("orders")
      .insert(payload)
      .select()
      .single();

    if (insertError) throw insertError;

    // 6. Insert Consent Record
    const { error: consentError } = await supabase
      .from("consent_records")
      .insert({
        order_id: data.id,
        customer_email: customer.email,
        consent_required: consentRequired,
        consent_marketing: consentMarketing,
        policy_version: policyVersion,
      });

    if (consentError) {
      console.error("Error al guardar el consentimiento:", consentError);
      throw consentError;
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
