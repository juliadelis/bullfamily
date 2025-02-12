import { createClient } from "@/utils/supabase/client";

export const ProcessAction = async (actionId: string, approve: boolean) => {
  const client = createClient();

  console.log("🔍 Buscando ação com ID:", actionId);
  const { data, error } = await client
    .from("actions_pending")
    .select("*")
    .eq("id", actionId)
    .single();

  if (error || !data) {
    console.error("❌ Erro ao buscar ação pendente:", error);
    return false;
  }

  console.log("✅ Ação encontrada:", data);

  let changeData;
  try {
    changeData =
      typeof data.data === "string" ? JSON.parse(data.data) : data.data;
  } catch (parseError) {
    console.error("❌ Erro ao converter dados da ação:", parseError);
    return false;
  }

  console.log("📌 Dados processados para ação:", changeData);

  if (approve) {
    let actionError = null;

    switch (data.actionData) {
      case "adicionar":
        console.log("✏️ Adicionando imóvel");
        const { error: addError } = await client
          .from("estates")
          .insert(changeData);
        actionError = addError;
        break;
      case "excluir":
        console.log("🗑 Excluindo imóvel com ID:", changeData.id);
        const { error: deleteError } = await client
          .from("estates")
          .delete()
          .eq("id", changeData.id);
        actionError = deleteError;
        break;

      case "editar":
        console.log("✏️ Editando imóvel com ID:", changeData.id);
        const { error: editError } = await client
          .from("estates")
          .update(changeData)
          .eq("id", changeData.id);
        actionError = editError;
        break;

      case "adicionar pagamento":
        console.log("💰 Adicionar pagamento:", changeData);
        const { error: paymentError } = await client
          .from("financialRecord")
          .insert(changeData);
        actionError = paymentError;
        break;

      case "editar pagamento":
        console.log("💰 Editar pagamento:", changeData);
        const { error: paymenEditError } = await client
          .from("financialRecord")
          .update(changeData)
          .eq("id", changeData.id);
        actionError = paymenEditError;
        break;

      case "adicionar historico":
        console.log("📜 Adicionando histórico:", changeData);
        const { error: historyError } = await client
          .from("historys")
          .insert(changeData);
        actionError = historyError;
        break;

      case "excluir historico":
        console.log("📜 Apagando histórico:", changeData);
        const { error: historyDeleteError } = await client
          .from("historys")
          .delete()
          .eq("id", changeData.id);
        actionError = historyDeleteError;
        break;

      default:
        console.error("❌ Ação desconhecida:", data.actionData);
        return false;
    }

    if (actionError) {
      console.error("❌ Erro ao executar a ação:", actionError);
      return false;
    }
  }

  console.log("🗑 Removendo ação pendente com ID:", actionId);
  const { error: deletePendingError } = await client
    .from("actions_pending")
    .delete()
    .eq("id", actionId);

  if (deletePendingError) {
    console.error("❌ Erro ao remover ação pendente:", deletePendingError);
    return false;
  }

  console.log("✅ Ação processada com sucesso!");
  return true;
};
