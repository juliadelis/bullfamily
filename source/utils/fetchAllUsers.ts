import { createClient } from "./supabase/client";

export interface User {
  name: string;
  email: string;
  id: string;
}

export const fetchAllUsers = async () => {
  const supabase = createClient();
  try {
    const { data } = await supabase.from("profiles").select();
    return data as User[];
  } catch (error) {
    console.error(error);
  }
};
