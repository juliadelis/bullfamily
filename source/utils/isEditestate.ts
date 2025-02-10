import { createClient } from "./supabase/client";

export const isEditestate = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  let { data: profiles, error } = await supabase
    .from("profiles")
    .select("editestate")
    .eq("id", user.id);

  if (!profiles) return;

  return Boolean(profiles[0].editestate);
};
