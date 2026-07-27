import nextEnvironment from "@next/env";
import { createClient } from "@supabase/supabase-js";

const { loadEnvConfig } = nextEnvironment;
loadEnvConfig(process.cwd());

const url = process.env.SUPABASE_URL?.trim();
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const bucket = process.env.SUPABASE_STORAGE_BUCKET?.trim() || "property-images";

if (!url || !serviceRole) {
  console.error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(url, serviceRole, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const [properties, inquiries, users, buckets] = await Promise.all([
  supabase.from("properties").select("id", { count: "exact" }).limit(1),
  supabase.from("inquiries").select("id", { count: "exact" }).limit(1),
  supabase.from("users").select("id", { count: "exact" }).limit(1),
  supabase.storage.listBuckets(),
]);

const checks = [
  ["properties", properties.error, properties.count],
  ["inquiries", inquiries.error, inquiries.count],
  ["users", users.error, users.count],
];

let valid = true;

for (const [name, error, count] of checks) {
  if (error) {
    valid = false;
    console.error(`${name}: ${error.code || "error"} - ${error.message}`);
  } else {
    console.log(`${name}: OK (${count ?? 0} registros)`);
  }
}

if (buckets.error) {
  valid = false;
  console.error(`storage: ${buckets.error.message}`);
} else if (!buckets.data.some((item) => item.id === bucket)) {
  valid = false;
  console.error(`storage: falta el bucket ${bucket}`);
} else {
  console.log(`storage: OK (${bucket})`);
}

if (!valid) process.exit(1);
