
// BmoreCorny Admin - Supabase connection and database test

const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

script.onload = initializeBmoreCorny;
script.onerror = () => console.error("Could not load Supabase library.");

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

  testDatabaseConnection();
}

async function testDatabaseConnection() {
  const { data, error } = await window.bmorecornySupabase
    .from("events")
    .select("id")
    .limit(1);

  if (error) {
    console.error("Database test failed:", error.message);
    return;
  }

  console.log("SUCCESS: Supabase database is responding.");
  console.log("Visible event records:", data.length);
}

document.head.appendChild(script);
