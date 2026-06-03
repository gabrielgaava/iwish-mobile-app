import CustomButton from "@/components/buttons/CustomButton";
import BackHeader from "@/components/ui/back-header";
import { ScrollScreen } from "@/components/ui/screen";
import { Txt } from "@/components/ui/text";
import i18n from "@/constants/region";
import { api, isOkay } from "@/lib/api";
import { appendProcessedImage } from "@/utils/image";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { useTheme } from "@react-navigation/native";
import Constants from "expo-constants";
import { Image } from "expo-image";
import * as ExpoImagePicker from "expo-image-picker";
import { useCallback, useMemo, useState } from "react";
import { Alert, Dimensions, Platform } from "react-native";
import styled from "styled-components/native";

const MAX_IMAGES = 3;

type ImageItem = {
  uri: string;
  width?: number;
};

export default function FeedbackScreen() {
  const { colors } = useTheme();
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);

  const canAddMore = useMemo(() => images.length < MAX_IMAGES, [images.length]);
  const remainingSlots = useMemo(() => MAX_IMAGES - images.length, [images.length]);

  const imageSize = useMemo(() => {
    const screenW = Dimensions.get("window").width;
    const padding = 40;
    const gap = 8 * 2;
    return (screenW - padding - gap) / 3;
  }, []);

  const slots = useMemo<(ImageItem | null)[]>(() => {
    const result: (ImageItem | null)[] = [...images];
    while (result.length < MAX_IMAGES) result.push(null);
    return result;
  }, [images]);

  const pickImage = useCallback(async () => {
    const permission = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        i18n.t("wishlist.create.permissionTitle"),
        i18n.t("wishlist.create.permissionMessage")
      );
      return;
    }

    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: remainingSlots,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newItems: ImageItem[] = result.assets.map((a) => ({
        uri: a.uri,
        width: a.width,
      }));

      setImages((prev) => [...prev, ...newItems].slice(0, MAX_IMAGES));
    }
  }, [remainingSlots]);

  const handleRemove = useCallback((uri: string) => {
    setImages((prev) => prev.filter((img) => img.uri !== uri));
  }, []);

  const buildMetadata = useCallback(() => ({
    platform: Platform.OS,
    platformVersion: String(Platform.Version),
    appVersion: Constants.expoConfig?.version ?? "unknown",
    deviceName: Constants.deviceName ?? "unknown",
  }), []);

  const handleSubmit = useCallback(async () => {
    if (!description.trim()) {
      Alert.alert("", i18n.t("feedback.descriptionRequired"));
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append("description", description.trim());
      form.append("metadata", JSON.stringify(buildMetadata()));

      for (let i = 0; i < images.length; i++) {
        await appendProcessedImage(
          form,
          "images",
          { uri: images[i].uri, width: images[i].width },
          "feedback",
          `feedback-${Date.now()}-${i}.webp`
        );
      }

      const response = await api.post("/bug-reports", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (isOkay(response)) {
        Alert.alert(i18n.t("feedback.successTitle"), i18n.t("feedback.successMessage"));
        setDescription("");
        setImages([]);
      } else {
        Alert.alert("", i18n.t("feedback.errorMessage"));
      }
    } catch {
      Alert.alert("", i18n.t("feedback.errorMessage"));
    } finally {
      setLoading(false);
    }
  }, [description, images, buildMetadata]);

  return (
    <ScrollScreen indicator={false}>
      <PageContent>
        <BackHeader />

        <HeaderBlock>
          <Txt text={i18n.t("feedback.title")} weight="bold" size={28} align="left" />
          <Txt
            text={i18n.t("feedback.subtitle")}
            size={14}
            align="left"
            color={colors.text70}
          />
        </HeaderBlock>

        {/* Textarea de descrição */}
        <TextAreaWrapper style={{ borderColor: colors.defaultBorder }}>
          <TextArea
            value={description}
            onChangeText={setDescription}
            placeholder={i18n.t("feedback.descriptionPlaceholder")}
            placeholderTextColor={colors.text50}
            multiline
            textAlignVertical="top"
          />
        </TextAreaWrapper>

        {/* Seção de imagens */}
        <ImagesSection>
          <ImagesSectionHeader>
            <Txt
              text={i18n.t("feedback.imagesLabel")}
              weight="bold"
              size={16}
              align="left"
              color={colors.text70}
            />
            <Txt
              text={i18n.t("feedback.imagesLimit")}
              size={13}
              color={colors.text50}
              align="right"
            />
          </ImagesSectionHeader>

          <ImagesRow>
            {slots.map((item, index) => {
              if (canAddMore && item === null) {
                return (
                  <AddSlot
                    key={"add" + index}
                    onPress={pickImage}
                    size={imageSize}
                    activeOpacity={0.7}
                    style={{ borderColor: colors.text50 }}
                  >
                    <AntDesign name="plus" size={24} color={colors.text50} />
                    <Txt
                      text={i18n.t("wish.create.addImage")}
                      size={11}
                      color={colors.text50}
                      weight="semi"
                    />
                  </AddSlot>
                );
              }

              if (item) {
                return (
                  <ImageSlot key={item.uri} size={imageSize}>
                    <SlotImage source={item.uri} contentFit="cover" size={imageSize} />
                    <RemoveBtn onPress={() => handleRemove(item.uri)}>
                      <Feather name="x" size={14} color={colors.white} />
                    </RemoveBtn>
                  </ImageSlot>
                );
              }

              return (
                <EmptySlot
                  key={`empty-${index}`}
                  size={imageSize}
                  style={{ borderColor: colors.defaultBorder }}
                >
                  <Feather name="image" size={22} color={colors.text50} />
                </EmptySlot>
              );
            })}
          </ImagesRow>
        </ImagesSection>

        {/* Info card */}
        <InfoCard
          style={{
            borderColor: colors.primary + "30",
            backgroundColor: colors.duotoneBackground,
          }}
        >
          <AntDesign name="info-circle" size={18} color={colors.primary} style={{ marginTop: 1 }} />
          <InfoText
            text={i18n.t("feedback.infoMessage")}
            size={13}
            align="left"
            color={colors.text70}
          />
        </InfoCard>

        {/* Botão */}
        <CustomButton
          onPress={handleSubmit}
          text={i18n.t("feedback.submitButton")}
          loading={loading}
          icon={<Feather name="send" size={16} color={colors.white} />}
          iconPosition="right"
          height={52}
          radius={14}
        />
      </PageContent>
    </ScrollScreen>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const PageContent = styled.View`
  padding: 20px;
  flex: 1;
`;

const HeaderBlock = styled.View`
  gap: 8px;
`;

const TextAreaWrapper = styled.View`
  border-width: 1px;
  border-radius: 14px;
  background-color: ${({ theme }) => theme.colors.background};
  min-height: 140px;
  margin-top: 24px;
`;

const TextArea = styled.TextInput`
  flex: 1;
  min-height: 140px;
  padding: 16px;
  font-size: 15px;
  font-family: PlusJakartaSans_400Regular;
  color: ${({ theme }) => theme.colors.text};
`;

const ImagesSection = styled.View`
  gap: 14px;
  margin-top: 12px;
`;

const ImagesSectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ImagesRow = styled.View`
  flex-direction: row;
  gap: 8px;
`;

const AddSlot = styled.TouchableOpacity<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 12px;
  border-width: 1.5px;
  border-style: dashed;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

const EmptySlot = styled.View<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 12px;
  border-width: 1px;
  background-color: ${({ theme }) => theme.colors.altBackground};
  align-items: center;
  justify-content: center;
`;

const ImageSlot = styled.View<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 12px;
  overflow: visible;
`;

const SlotImage = styled(Image)<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 12px;
`;

const RemoveBtn = styled.TouchableOpacity`
  position: absolute;
  top: -7px;
  right: -7px;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.errorText};
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const InfoCard = styled.View`
  flex-direction: row;
  gap: 10px;
  border-width: 1px;
  border-radius: 14px;
  padding: 14px;
  align-items: flex-start;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const InfoText = styled(Txt)`
  flex: 1;
`;
