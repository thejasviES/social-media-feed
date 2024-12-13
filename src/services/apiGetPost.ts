import { supabase } from "../lib/supabase";


export const getPostById = async (id: string) => {
    const { data, error } = await supabase
        .from("feed_posts")
        .select("*")
        .eq("id", id)
        .single();
    if (error) {
        throw error;
    }
    return data;
};