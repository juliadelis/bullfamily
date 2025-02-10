import { createClient } from "@/utils/supabase/client";

export const registerAction = async (
  user: string,
  action: string,
  actionData: string,
  data: any
) => {
  const client = createClient();

  if (!user) {
    console.error("Erro: userId está indefinido ou nulo.");
    return false;
  }

  const { error } = await client.from("actions_pending").insert([
    {
      user,
      action,
      data,
      actionData,
      status: "pendente",
    },
  ]);

  if (error) {
    console.error("Erro ao registrar ação:", error);
    return false;
  }

  return true;
};
