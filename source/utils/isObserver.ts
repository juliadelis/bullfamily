import { createClient } from "./supabase/client";

export const isObserver = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  let { data: profiles, error } = await supabase
    .from("profiles")
    .select("isobserver")
    .eq("id", user.id);

  if (!profiles) return;

  return Boolean(profiles[0].isobserver);
};
