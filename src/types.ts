import type { Database } from "../supabase/database.types";

export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];

export type Vote = Database["public"]["Tables"]["votes"]["Row"];

export type Comment = Database["public"]["Tables"]["comments"]["Row"]
export type InsertComment = Database["public"]["Tables"]["comments"]["Insert"]