import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    console.log('[GENERATE-INVOICES] Starting invoice generation process');

    // Get all active clients
    const { data: clients, error: clientsError } = await supabaseClient
      .from('clients')
      .select('*')
      .eq('subscription_active', true);

    if (clientsError) {
      console.error('[GENERATE-INVOICES] Error fetching clients:', clientsError);
      throw clientsError;
    }

    console.log(`[GENERATE-INVOICES] Found ${clients?.length || 0} active clients`);

    const today = new Date();
    const generatedInvoices = [];

    for (const client of clients || []) {
      // Calculate next billing date
      const nextBillingDate = client.subscription_end_date 
        ? new Date(client.subscription_end_date)
        : new Date(today.getFullYear(), today.getMonth() + 1, 11); // Default to 11th of next month

      // Generate invoice 5 days before due date
      const generateDate = new Date(nextBillingDate);
      generateDate.setDate(generateDate.getDate() - 5);

      // Check if we should generate invoice today
      if (today >= generateDate) {
        // Check if invoice already exists for this period
        const invoiceMonth = nextBillingDate.getMonth() + 1;
        const invoiceYear = nextBillingDate.getFullYear();
        const invoiceNumber = `FAT-${invoiceYear}${invoiceMonth.toString().padStart(2, '0')}-${client.id.slice(0, 4).toUpperCase()}`;

        const { data: existingInvoice } = await supabaseClient
          .from('invoices')
          .select('id')
          .eq('client_id', client.id)
          .eq('invoice_number', invoiceNumber)
          .single();

        if (!existingInvoice) {
          // Calculate close date (5 days before due date)
          const closeDate = new Date(nextBillingDate);
          closeDate.setDate(closeDate.getDate() - 5);

          // Create new invoice
          const { data: newInvoice, error: invoiceError } = await supabaseClient
            .from('invoices')
            .insert({
              client_id: client.id,
              invoice_number: invoiceNumber,
              amount: client.monthly_fee || 79.90,
              currency: 'BRL',
              due_date: nextBillingDate.toISOString().split('T')[0],
              issue_date: closeDate.toISOString().split('T')[0],
              status: 'pendente',
              description: `Mensalidade ${client.subscription_plan || 'Premium'} - ${nextBillingDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`,
              payment_method: 'Cartão de Crédito'
            })
            .select()
            .single();

          if (invoiceError) {
            console.error(`[GENERATE-INVOICES] Error creating invoice for client ${client.id}:`, invoiceError);
          } else {
            console.log(`[GENERATE-INVOICES] Created invoice ${invoiceNumber} for client ${client.id}`);
            generatedInvoices.push(newInvoice);

            // Create notification for the client
            const { data: profile } = await supabaseClient
              .from('profiles')
              .select('user_id')
              .eq('id', client.profile_id)
              .single();

            if (profile) {
              await supabaseClient
                .from('notifications')
                .insert({
                  client_id: client.id,
                  user_id: profile.user_id,
                  title: 'Nova Fatura Disponível',
                  message: `Sua fatura de ${nextBillingDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })} foi gerada. Vencimento: ${nextBillingDate.toLocaleDateString('pt-BR')}.`,
                  type: 'info'
                });
            }
          }
        } else {
          console.log(`[GENERATE-INVOICES] Invoice ${invoiceNumber} already exists for client ${client.id}`);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Generated ${generatedInvoices.length} invoices`,
        invoices: generatedInvoices 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('[GENERATE-INVOICES] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});