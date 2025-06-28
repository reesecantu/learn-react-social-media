import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types"

const supabaseUrl = "https://bxzzimoggvxsgwvcwkdz.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);