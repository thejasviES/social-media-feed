import { supabase } from "../lib/supabase";


export const getUserPosts = async (userId: string) => {
  
    const { data, error } = await supabase
      .from('feed_posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  console.log("data", data);
  console.log("error", error);
    return { data, error };
  }

 