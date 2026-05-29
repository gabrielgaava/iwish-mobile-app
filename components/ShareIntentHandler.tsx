import { LoadingOverlay } from "@/components/ui/loading-overlay";
import i18n from "@/constants/region";
import { useCreateWish } from "@/hooks/useCreateWish";
import { api } from "@/lib/api";
import { router } from "expo-router";
import { useShareIntentContext } from "expo-share-intent";
import { useEffect, useState } from "react";

/**
 * Ouve share intents (Android e iOS) e navega para wish/create
 * com os dados do produto já preenchidos via useCreateWish.
 *
 * Deve ser montado dentro do root layout, após a autenticação estar disponível.
 */
export function ShareIntentHandler() {
  const { shareIntent, resetShareIntent } = useShareIntentContext();
  const { setPrefill } = useCreateWish();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const url = shareIntent?.webUrl ?? shareIntent?.text ?? null;
    if (!url) return;

    resetShareIntent();

    async function handleSharedUrl() {
      setIsLoading(true);
      const response = await api.post("/wish/scrap", { url });
      setIsLoading(false);

      setPrefill({
        link: url!,
        title: response.data?.title || "",
        price: response.data?.price?.toFixed(2) || "",
        images: response.data?.images || [],
      });

      router.push("/(protected)/wish/create");
    }

    handleSharedUrl();
  }, [shareIntent]);

  return (
    <LoadingOverlay
      visible={isLoading}
      message={i18n.t("shareIntent.loading")}
    />
  );
}
