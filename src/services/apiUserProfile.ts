import { supabase } from "../lib/supabase";
import { Profile } from "../types/profile";


export const getUserProfile = async (userId: string) => {
 
    const { data, error } = await supabase
      .from('profiles') 
      .select('*')
      .eq('id', userId)
      .single();
  console.log("data", data);
  console.log("error", error);
    return { data  , error };
  }

  export const updateUserProfile = async (userId: string, updatedData: Profile) => {
    const { data, error } = await supabase
      .from('profiles') 
      .update(updatedData)
      .eq('id', userId)
      .single();
  console.log("data", data);
  console.log("error", error);
    return { data  , error };
  }