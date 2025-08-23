import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Create Supabase client using the anon key for user authentication
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Parse request body first
    const body = await req.json();
    const { planType, cycle, email } = body;
    logStep("Request body parsed", { planType, cycle, email });

    // Validate email is provided
    if (!email) {
      throw new Error("Email is required");
    }
    
    logStep("Using email from request", { email });

    // Plan pricing
    const plans = {
      basico: {
        monthlyPrice: 1490, // R$ 14.90 in cents
        yearlyPrice: 13410,  // R$ 134.10 in cents
        name: "Plano Básico"
      },
      genio: {
        monthlyPrice: 4599, // R$ 45.99 in cents
        yearlyPrice: 41390,  // R$ 413.90 in cents
        name: "Plano Gênio"
      }
    };

    const selectedPlan = plans[planType as keyof typeof plans];
    if (!selectedPlan) throw new Error("Invalid plan type");

    const price = cycle === 'monthly' ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice;
    const interval = cycle === 'monthly' ? 'month' : 'year';

    logStep("Plan selected", { planType, cycle, price, interval });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Check if customer exists
    const customers = await stripe.customers.list({ email: email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      logStep("No existing customer found");
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: { 
              name: selectedPlan.name,
              description: `Assinatura ${cycle === 'monthly' ? 'mensal' : 'anual'} do ${selectedPlan.name}`
            },
            unit_amount: price,
            recurring: { interval },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/auth?payment=success`,
      cancel_url: `${origin}/payment?plan=${planType}&cycle=${cycle}`,
      metadata: {
        plan_type: planType,
        cycle: cycle,
        email: email // Usar email em vez de user_id já que não temos usuário autenticado ainda
      }
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});