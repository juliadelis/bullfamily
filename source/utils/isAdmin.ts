import { createClient } from "./supabase/client";

export const isAdmin = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  let { data: profiles, error } = await supabase
    .from("profiles")
    .select("isadmin")
    .eq("id", user.id);

  if (!profiles) return;

  return Boolean(profiles[0].isadmin);
};
