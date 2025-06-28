import type { Database } from "../supabase/database.types";

export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];