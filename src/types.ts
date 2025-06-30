import type { Database } from "../supabase/database.types";

export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];

// RPC function return types
export type PostWithCounts = Database["public"]["Functions"]["get_posts_with_counts"]["Returns"][0];

export type Vote = Database["public"]["Tables"]["votes"]["Row"];

export type PostComment = Database["public"]["Tables"]["comments"]["Row"]
export type InsertComment = Database["public"]["Tables"]["comments"]["Insert"]

export type Community = Database["public"]["Tables"]["communities"]["Row"];
export type InsertCommunity = Database["public"]["Tables"]["communities"]["Insert"];