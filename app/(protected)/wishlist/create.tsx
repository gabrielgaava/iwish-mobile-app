import { CustomButton } from "@/components/buttons";
import { WishlistImagePicker } from "@/components/image-picker";
import { InputText } from "@/components/input";
import { OptionSelector } from "@/components/option-selector/OptionSelector";
import BackHeader from "@/components/ui/back-header";
import { ScrollScreen } from "@/components/ui/screen";
import { Txt } from "@/components/ui/text";
import i18n from "@/constants/region";
import { api } from "@/lib/api";
import { FeatherIconName } from "@/types/Ui";
import { appendProcessedImage } from "@/utils/image";
import Feather from "@expo/vector-icons/Feather";
import { useTheme } from "@react-navigation/native";
import * as ExpoImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";
import styled from "styled-components/native";

type CreateWishlistParams = {
  id?: string;
  name?: string;
  description?: string;
  isPublic?: string;
  coverImage?: string;
};

type WishlistFormData = {
  name: string;
  description: string;
};

export default function CreateWishlistPage() {
  const { colors } = useTheme();
  const { id, name, description, isPublic, coverImage } =
    useLocalSearchParams<CreateWishlistParams>();

  const isEditMode = !!id;

  const [newImage, setNewImage] = useState<ExpoImagePicker.ImagePickerAsset>();
  const [isPublicState, setIsPublicState] = useState<boolean>(
    isEditMode ? isPublic === "true" : true
  );
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { control, handleSubmit } = useForm<WishlistFormData>({
    defaultValues: {
      name: name ?? "",
      description: description ?? "",
    },
  });

  const visibilityOptions = useMemo(
    () => [
      {
        value: "public",
        title: "Publica",
        description: "Qualquer pessoa pode ver sua lista.",
        icon: "globe" as FeatherIconName,
      },
      {
        value: "private",
        title: "Privada",
        description: "Apenas você pode ver sua lista.",
        icon: "lock" as FeatherIconName,
      },
    ],
    []
  );

  const handleImageChange = useCallback(
    (listImages: ExpoImagePicker.ImagePickerAsset[]) => {
      setNewImage(listImages[0]);
    },
    []
  );

  const handleVisibilityChange = useCallback((value: string) => {
    setIsPublicState(value === "public");
  }, []);

  async function submitWishlist(data: WishlistFormData) {
    setIsFetching(true);

    if (isEditMode) {
      await updateWishlist(data);
    } else {
      await createWishlist(data);
    }
  }

  async function createWishlist(data: WishlistFormData) {
    const form = new FormData();
    form.append("name", data.name);
    form.append("description", data.description);
    form.append("isPublic", String(isPublicState));

    if (newImage) {
      await appendProcessedImage(
        form,
        "coverImage",
        { uri: newImage.uri, width: newImage.width },
        "cover",
        "cover.webp"
      );
    }

    const response = await api.post("/wishlist", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.status !== 200) {
      Alert.alert(i18n.t("wishlist.create.error"));
      setIsFetching(false);
      return;
    }

    setIsFetching(false);
    router.replace({
      pathname: "/(protected)/(tabs)/profile",
      params: { refresh: "1" },
    });
  }

  async function updateWishlist(data: WishlistFormData) {
    const form = new FormData();
    form.append("name", data.name);
    form.append("description", data.description);
    form.append("isPublic", String(isPublicState));

    if (newImage) {
      // Nova imagem do dispositivo -> upload do arquivo comprimido
      await appendProcessedImage(
        form,
        "coverImage",
        { uri: newImage.uri, width: newImage.width },
        "cover",
        "cover.webp"
      );
    } else if (coverImage) {
      // Mantem a capa atual (URL ja hospedada) - enviada como texto
      form.append("keepImages", coverImage);
    }

    const response = await api.put(`/wishlist/${id}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.status !== 200) {
      Alert.alert(i18n.t("wishlist.edit.error"));
      setIsFetching(false);
      return;
    }

    setIsFetching(false);
    router.replace({
      pathname: "/(protected)/wishlist/[id]",
      params: { id: id!, forceRefresh: "true" },
    });
  }

  const pageTitle = isEditMode
    ? i18n.t("wishlist.edit.title")
    : i18n.t("wishlist.create.title");

  const pageSubTitle = isEditMode
    ? i18n.t("wishlist.edit.subTitle")
    : i18n.t("wishlist.create.subTitle");

  const buttonText = isEditMode
    ? i18n.t("wishlist.edit.buttonText")
    : i18n.t("wishlist.create.buttonText");

  return (
    <ScrollScreen indicator={false}>
      <Header>
        <BackHeader />
        <Txt text={pageTitle} weight="bold" size={26} align="left" />
        <Txt text={pageSubTitle} size={16} align="left" color={colors.text70} />
        <Spacer />
      </Header>

      <Page>
        <FormContainer>
          <WishlistImagePicker
            limit={1}
            onSelect={handleImageChange}
            initialImage={isEditMode ? coverImage : undefined}
          />
          <InputText
            control={control}
            label={i18n.t("wishlist.create.nameLabel")}
            name="name"
            rules={{ required: true }}
          />
          <InputText
            control={control}
            label={i18n.t("wishlist.create.descriptionLabel")}
            name="description"
            rules={{ required: true }}
          />
          <OptionSelector
            style={{ marginTop: 12 }}
            options={visibilityOptions}
            onValueChange={handleVisibilityChange}
            defaultValue={isPublicState ? "public" : "private"}
          />
        </FormContainer>

        <ButtonContainer>
          <CustomButton
            text={buttonText}
            onPress={handleSubmit(submitWishlist)}
            iconPosition="right"
            loading={isFetching}
            icon={<Feather name="save" color={colors.white} size={18} />}
          />
        </ButtonContainer>
      </Page>
    </ScrollScreen>
  );
}

const Header = styled.View`
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 24px 24px 0px 24px;
`;

const Spacer = styled.View`
  width: 22px;
`;

const Page = styled.View`
  padding: 24px;
  flex: 1;
`;

const FormContainer = styled.View`
`;

const ButtonContainer = styled.View`
  margin-top: 32px;
  margin-bottom: 32px;
  flex: 1;
  justify-content: flex-end;
`;
