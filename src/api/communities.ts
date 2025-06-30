import type { Community } from "../types";
import { supabase } from "../../supabase/supabase-client";

export const fetchCommunities = async (): Promise<Community[]> => {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data as Community[];
};