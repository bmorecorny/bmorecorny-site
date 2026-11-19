
// BmoreCorny Admin - Supabase connection

const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
script.onload = initializeBmoreCorny;
document.head.appendChild(script);

function initializeBmoreCorny() {
  const config = window.BMORECORNY_CONFIG;

  if (!config?.SUPABASE_URL || !config?.SUPABASE_ANON_KEY) {
    console.error("BmoreCorny configuration is missing.");
    return;
  }

  window.bmorecornySupabase = window.supabase.createClient(
    config.SUPABASE_URL,
    config.SUPABASE_ANON_KEY
  );

  console.log("BmoreCorny Supabase client initialized.");
}
