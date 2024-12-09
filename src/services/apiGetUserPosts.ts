import { supabase } from "../lib/supabase";

const getUserPosts = async (userId: string) => {
    const { data, error } = await supabase
      .from('feed_posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  
    return { data, error };
  }