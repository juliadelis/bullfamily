import { createClient } from "./supabase/client";

export const deleteUser = async (id: string) => {
  const supabase = createClient();

  try {
    await supabase.from("profiles").delete().eq("id", id);
    const { data, error } = await supabase.rpc("destroy_user", {
      user_id: id,
    });

    if (error) {
      throw Error(String(error));
    }

    return true;
  } catch (error) {
    console.error(error);
  }
};
