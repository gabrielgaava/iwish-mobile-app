import { CustomButton, LinkButton } from "@/components/buttons";
import { InputText } from "@/components/input";
import BackHeader from "@/components/ui/back-header";
import { Txt } from "@/components/ui/text";
import { WishFormData, WishReviewForm } from "@/components/wish/WishReviewForm";
import { WishlistSelectCard } from "@/components/wishlist-select-card";
import i18n from "@/constants/region";
import { urlRules } from "@/constants/rules";
import { useCreateWish } from "@/hooks/useCreateWish";
import { api } from "@/lib/api";
import { Wishlist } from "@/types/User";
import { appendWishImages } from "@/utils/image";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Foundation from "@expo/vector-icons/Foundation";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Control, useForm } from "react-hook-form";
import { Alert, ScrollView, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled, { useTheme } from "styled-components/native";

type FormData = WishFormData;

// select-list is the LAST step — only shown when no wishlistId is provided
type Step = "link" | "review" | "select-list";

const defaultValues: FormData = {
  link: "",
  title: "",
  price: "",
  notes: "",
};

export default function CreateWishPage() {
  const { wishlistId } = useLocalSearchParams<{ wishlistId: string }>();
  const { consumePrefill } = useCreateWish();

  // Capture initial values once — prefill is consumed here and cleared from the store
  const initialWishlistId = useRef(wishlistId).current;
  const initialPrefill = useRef(consumePrefill()).current;
  const hasPrefill = !!initialPrefill?.link;

  const [currentStep, setCurrentStep] = useState<Step>(hasPrefill ? "review" : "link");
  const [selectedWishlistId, setSelectedWishlistId] = useState<string | undefined>(initialWishlistId);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isHighPriority, setIsHighPriority] = useState(false);
  const [images, setImages] = useState<string[]>(hasPrefill ? initialPrefill!.images : []);

  // Used to force-remount SelectListStep so it re-fetches wishlists
  // after the user creates a new list and navigates back
  const [listRefreshKey, setListRefreshKey] = useState(0);

  // When the user navigates to wishlist/create, we skip the blur-reset
  // so they don't lose their entered wish data when they come back
  const skipNextReset = useRef(false);
  const cameFromListCreate = useRef(false);

  const { control, handleSubmit, reset, setValue } = useForm<FormData>({
    defaultValues: hasPrefill
      ? { link: initialPrefill!.link, title: initialPrefill!.title, price: initialPrefill!.price, notes: "" }
      : defaultValues,
  });

  const resetScreen = useCallback(() => {
    reset(defaultValues);
    setCurrentStep("link");
    setSelectedWishlistId(initialWishlistId);
    setIsRequesting(false);
    setIsHighPriority(false);
    setImages([]);
  }, [reset, initialWishlistId]);

  useFocusEffect(
    useCallback(() => {
      // Coming back from wishlist/create: bump the key to re-fetch lists
      if (cameFromListCreate.current) {
        cameFromListCreate.current = false;
        setListRefreshKey((k) => k + 1);
      }

      return () => {
        if (!skipNextReset.current) {
          // Normal navigation away → reset for next use
          resetScreen();
        } else {
          // Going to wishlist/create → preserve state, mark the return
          cameFromListCreate.current = true;
        }
        skipNextReset.current = false;
      };
    }, [resetScreen])
  );

  async function fetchProductDetails(data: FormData) {
    setIsRequesting(true);
    const response = await api.post("/wish/scrap", { url: data.link });

    setValue("title", response.data?.title || "");
    setValue("price", response.data?.price?.toFixed(2) || "");
    setImages(response.data?.images || []);
    setCurrentStep("review");
    setIsRequesting(false);
  }

  function addImage(uri: string) {
    setImages((prev) => [...prev, uri]);
  }

  function removeImage(url: string) {
    setImages((current) => current.filter((item) => item !== url));
  }

  // Called when the user taps "Salvar" on ReviewStep
  function handleReviewSubmit(data: FormData) {
    if (selectedWishlistId) {
      // List is already known — create immediately
      createWish(data, selectedWishlistId);
    } else {
      // No list selected yet — move to the selection step
      setCurrentStep("select-list");
    }
  }

  // Called when the user confirms a list on SelectListStep
  function handleListConfirm(id: string) {
    setSelectedWishlistId(id);
    // Trigger form validation + creation in one shot,
    // passing the id directly to avoid stale state issues
    handleSubmit((data) => createWish(data, id))();
  }

  function handleCreateNew() {
    skipNextReset.current = true;
    router.push("/(protected)/wishlist/create");
  }

  function handleBack() {
    if(currentStep === "review") {
      return setCurrentStep("link");
    }

    if(currentStep === "select-list"){
      return setCurrentStep("review");
    }

    return router.back();
  }

  async function createWish(data: FormData, targetWishlistId: string) {
    setIsRequesting(true);

    const form = new FormData();
    form.append("title", data.title);
    form.append("notes", data.notes);
    form.append("price", String(Number(data.price)));
    form.append("url", data.link);
    form.append("highPriority", String(isHighPriority));
    await appendWishImages(form, images);

    const response = await api.post(`/wishlist/${targetWishlistId}/wish`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setIsRequesting(false);

    if (response.status !== 200) {
      return Alert.alert("Nao foi possivel salvar os dados. Tente novamente mais tarde");
    }

    return router.replace({
      pathname: "/(protected)/wishlist/[id]",
      params: { id: targetWishlistId, forceRefresh: "true" },
    });
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <ContentContainer>
          <BackHeader onBack={handleBack}/>
          {currentStep === "link" && (
            <LinkStep
              control={control}
              loading={isRequesting}
              onSubmit={handleSubmit(fetchProductDetails)}
              onSkip={() => setCurrentStep("review")}
            />
          )}

          {currentStep === "review" && (
            <WishReviewForm
              control={control}
              images={images}
              isHighPriority={isHighPriority}
              loading={isRequesting}
              onAddImage={addImage}
              onRemoveImage={removeImage}
              onTogglePriority={setIsHighPriority}
              onSubmit={handleSubmit(handleReviewSubmit)}
            />
          )}

          {currentStep === "select-list" && (
            <SelectListStep
              key={listRefreshKey}
              loading={isRequesting}
              onConfirm={handleListConfirm}
              onCreateNew={handleCreateNew}
            />
          )}
        </ContentContainer>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── LinkStep ──────────────────────────────────────────────────────────────────

type LinkStepProps = {
  control: Control<FormData>;
  loading: boolean;
  onSubmit: () => void;
  onSkip: () => void;
};

function LinkStep({ control, loading, onSubmit, onSkip }: LinkStepProps) {
  const { colors } = useTheme();

  return (
    <>
      <HeaderContent>
        <IconBox>
          <AntDesign name="link" size={28} color={colors.primary} />
        </IconBox>
        <Txt text={i18n.t("wish.create.linkTitle")} weight="bold" size={26} />
        <Txt
          text={i18n.t("wish.create.linkSubtitle")}
          color={colors.text70}
          style={{ marginTop: 12 }}
          size={16}
        />
      </HeaderContent>

      <InputContainer>
        <InputText
          control={control}
          label="Link/URL"
          name="link"
          rules={{ required: true, validate: urlRules }}
          leftIcon="link"
        />
        <TooltipContainer>
          <Foundation name="info" size={20} color={colors.text70} />
          <Txt text="Nem todos sites permitem busca automatica" size={12} color={colors.text70} />
        </TooltipContainer>
      </InputContainer>

      <ButtonContainer>
        <CustomButton
          text="Continuar"
          onPress={onSubmit}
          loading={loading}
          icon={<Feather name="arrow-right" color={colors.white} />}
          iconPosition="right"
        />
        <LinkButton
          text={i18n.t("wish.create.manual")}
          onPress={onSkip}
          textAlign="center"
          contrast
          icon={<Feather name="file-text" color={colors.primary} />}
        />
      </ButtonContainer>
    </>
  );
}

// ─── SelectListStep ────────────────────────────────────────────────────────────

type SelectListStepProps = {
  loading: boolean;
  onConfirm: (wishlistId: string) => void;
  onCreateNew: () => void;
};

function SelectListStep({ loading, onConfirm, onCreateNew }: SelectListStepProps) {
  const { colors } = useTheme();
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetches on mount. When the parent gives this component a new `key`
  // (after returning from wishlist/create), it remounts and re-fetches.
  useEffect(() => {
    async function fetchWishlists() {
      setIsFetching(true);
      const response = await api.get("/users/me");
      if (response.status === 200) {
        setWishlists(response.data?.wishlists ?? []);
      }
      setIsFetching(false);
    }
    fetchWishlists();
  }, []);

  const filteredWishlists = useMemo(() => {
    if (!searchQuery.trim()) return wishlists;
    const q = searchQuery.toLowerCase();
    return wishlists.filter((w) => w.name.toLowerCase().includes(q));
  }, [wishlists, searchQuery]);

  const handleSelect = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedId) onConfirm(selectedId);
  }, [selectedId, onConfirm]);

  return (
    <>
      <HeaderContent>
        <Txt
          text={i18n.t("wish.create.selectListTitle")}
          weight="bold"
          size={26}
          align="left"
        />
        <Txt
          text={i18n.t("wish.create.selectListSubtitle")}
          color={colors.text70}
          style={{ marginTop: 8 }}
          size={14}
          align="left"
        />
      </HeaderContent>

      <SearchContainer>
        <Feather name="search" size={18} color={colors.text70} />
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={i18n.t("wish.create.searchPlaceholder")}
          placeholderTextColor={colors.text50}
        />
      </SearchContainer>

      <ListContainer>
        <CreateNewCard onPress={onCreateNew} activeOpacity={0.75}>
          <CreateNewIcon>
            <AntDesign name="plus" size={24} color={colors.text70} />
          </CreateNewIcon>
          <ListTextGroup>
            <Txt
              text={i18n.t("wish.create.createNewList")}
              weight="bold"
              size={15}
              align="left"
            />
            <Txt
              text={i18n.t("wish.create.createNewListSub")}
              size={13}
              color={colors.text70}
              align="left"
            />
          </ListTextGroup>
        </CreateNewCard>

        {isFetching ? (
          <LoadingContainer>
            <ListLoader color={colors.primary} />
          </LoadingContainer>
        ) : (
          filteredWishlists.map((wishlist) => (
            <WishlistSelectCard
              key={wishlist.id}
              wishlist={wishlist}
              selected={selectedId === wishlist.id}
              onSelect={handleSelect}
            />
          ))
        )}
      </ListContainer>

      <ButtonContainer>
        <CustomButton
          text={`${i18n.t("wish.create.confirmSelection")} →`}
          onPress={handleConfirm}
          disabled={!selectedId}
          loading={loading}
        />
      </ButtonContainer>
    </>
  );
}

// ─── Styled Components ─────────────────────────────────────────────────────────

const ContentContainer = styled.View`
  flex-direction: column;
  align-items: center;
  padding: 24px;
  flex-grow: 1;
  justify-content: center;
`;

const HeaderContent = styled.View`
  width: 100%;
`;

const IconBox = styled.View`
  padding: 20px;
  border-radius: 14px;
  width: 68px;
  margin: 0px auto 18px auto;
  background-color: ${({ theme }) => theme.colors.duotoneBackground};
`;

const InputContainer = styled.View`
  margin-top: 12px;
  width: 100%;
`;

const TooltipContainer = styled.View`
  flex-direction: row;
  width: 100%;
  align-items: center;
  gap: 6px;
  margin-top: 0px;
  justify-content: center;
`;

const ButtonContainer = styled.View`
  width: 100%;
  margin-top: auto;
  padding-top: 24px;
  gap: 12px;
`;

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  width: 100%;
  margin-top: 20px;
  padding: 0 14px;
  height: 48px;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.defaultBorder};
  background-color: ${({ theme }) => theme.colors.darkBackground};
`;

const SearchInput = styled(TextInput)`
  flex: 1;
  height: 48px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
`;

const ListContainer = styled.View`
  width: 100%;
  margin-top: 16px;
  gap: 10px;
`;

const CreateNewCard = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  border-width: 1.5px;
  border-style: dashed;
  border-color: ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
`;

const CreateNewIcon = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.border30};
  align-items: center;
  justify-content: center;
`;

const ListTextGroup = styled.View`
  flex: 1;
  gap: 2px;
`;

const LoadingContainer = styled.View`
  padding: 24px 0;
  align-items: center;
`;

const ListLoader = styled.ActivityIndicator``;
