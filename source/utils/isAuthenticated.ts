import { createClient } from "./supabase/server";

export const isAuthenticated = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return Boolean(user);
};
