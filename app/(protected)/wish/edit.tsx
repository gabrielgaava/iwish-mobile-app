import { WishReviewForm, WishFormData } from "@/components/wish/WishReviewForm";
import i18n from "@/constants/region";
import { api } from "@/lib/api";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

type EditWishParams = {
  id: string;
  wishlistId: string;
  title?: string;
  price?: string;
  link?: string;
  notes?: string;
  mostWanted?: string;
  images?: string; // JSON.stringify(string[])
};

export default function EditWishPage() {
  const { colors } = useTheme();
  const { id, wishlistId, title, price, link, notes, mostWanted, images } =
    useLocalSearchParams<EditWishParams>();

  const initialImages: string[] = (() => {
    try { return images ? JSON.parse(images) : []; }
    catch { return []; }
  })();

  const [wishImages, setWishImages] = useState<string[]>(initialImages);
  const [isHighPriority, setIsHighPriority] = useState(mostWanted === "true");
  const [isSaving, setIsSaving] = useState(false);

  const { control, handleSubmit } = useForm<WishFormData>({
    defaultValues: {
      link: link ?? "",
      title: title ?? "",
      price: price ?? "",
      notes: notes ?? "",
    },
  });

  const addImage = useCallback((uri: string) => {
    setWishImages((prev) => [...prev, uri]);
  }, []);

  const removeImage = useCallback((url: string) => {
    setWishImages((prev) => prev.filter((item) => item !== url));
  }, []);

  const handleSave = useCallback(
    async (data: WishFormData) => {
      setIsSaving(true);

      const response = await api.put(`/wish/${id}`, {
        title: data.title,
        notes: data.notes,
        price: Number(data.price),
        url: data.link,
        images: wishImages,
        highPriority: isHighPriority,
      });

      setIsSaving(false);

      if (response.status !== 200) {
        Alert.alert(i18n.t("wish.edit.error"));
        return;
      }

      router.replace({
        pathname: "/(protected)/wishlist/[id]",
        params: { id: wishlistId, forceRefresh: "true" },
      });
    },
    [id, wishlistId, wishImages, isHighPriority]
  );

  return (
    <ScreenSafeArea>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Header>
            <TouchableOpacity onPress={() => router.back()} style={{ marginVertical: 12 }}>
              <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
            </TouchableOpacity>
          </Header>

          <ContentContainer>
            <WishReviewForm
              control={control}
              images={wishImages}
              isHighPriority={isHighPriority}
              loading={isSaving}
              headerTitle={i18n.t("wish.edit.title")}
              headerSubtitle={i18n.t("wish.edit.subtitle")}
              saveLabel={i18n.t("wish.edit.saveButton")}
              onAddImage={addImage}
              onRemoveImage={removeImage}
              onTogglePriority={setIsHighPriority}
              onSubmit={handleSubmit(handleSave)}
            />
          </ContentContainer>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenSafeArea>
  );
}

// ─── Styled Components ────────────────────────────────────────────────────────

const ScreenSafeArea = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.screenBackground};
`;

const Header = styled.View`
  padding: 0 24px;
`;

const ContentContainer = styled.View`
  flex-direction: column;
  align-items: center;
  padding: 0 24px 32px;
  flex-grow: 1;
`;
