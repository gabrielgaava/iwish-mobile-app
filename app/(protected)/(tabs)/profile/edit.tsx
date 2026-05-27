import { CustomButton } from "@/components/buttons";
import { InputText } from "@/components/input";
import { AvatarPicker } from "@/components/profile/AvatarPicker";
import BackHeader from "@/components/ui/back-header";
import { Txt } from "@/components/ui/text";
import i18n from "@/constants/region";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { UserProfile } from "@/types/User";
import Feather from "@expo/vector-icons/Feather";
import { useTheme } from "@react-navigation/native";
import * as ExpoImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

type EditProfileFormData = {
  name: string;
  username: string;
  email: string;
};

export default function EditProfileScreen() {
  const { colors } = useTheme();
  const { user, updateUser } = useAuth();

  const [avatarAsset, setAvatarAsset] =
    useState<ExpoImagePicker.ImagePickerAsset | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { control, handleSubmit } = useForm<EditProfileFormData>({
    defaultValues: {
      name: user?.name ?? "",
      username: user?.username ?? "",
      email: user?.email ?? "",
    },
  });

  const handleAvatarSelect = useCallback(
    (asset: ExpoImagePicker.ImagePickerAsset) => {
      setAvatarAsset(asset);
    },
    []
  );

  const handleSave = useCallback(
    async (data: EditProfileFormData) => {
      setIsSaving(true);

      const payload: Partial<UserProfile> & { image?: string | null } = {
        name: data.name,
        username: data.username,
        ...(avatarAsset?.base64 && { image: avatarAsset.base64 }),
      };

      const response = await api.patch<UserProfile>("/users/me", payload);

      if (response.status !== 200) {
        Alert.alert(i18n.t("profile.edit.error"));
        setIsSaving(false);
        return;
      }

      updateUser({
        name: data.name,
        username: data.username,
        ...(avatarAsset?.uri && { image: avatarAsset.uri }),
      });

      setIsSaving(false);
      router.replace({
        pathname: "/(protected)/(tabs)/profile",
        params: { refresh: "1" },
      });
    },
    [avatarAsset]
  );

  const avatarPreviewUri = avatarAsset?.uri ?? user?.image ?? null;

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
            <BackHeader />
            <Txt text={i18n.t("profile.edit.title")} weight="bold" size={26} align="left" />
            <Txt
              text={i18n.t("profile.edit.subtitle")}
              size={16}
              align="left"
              color={colors.text70}
            />
          </Header>

          <Page>
            <AvatarSection>
              <AvatarPicker uri={avatarPreviewUri} onSelect={handleAvatarSelect} size={120}/>
            </AvatarSection>

            <FormContainer>
              <InputText
                control={control}
                label={i18n.t("profile.edit.nameLabel")}
                name="name"
                rules={{ required: true, minLength: 2, maxLength: 60 }}
                leftIcon="user"
              />
              <InputText
                control={control}
                label={i18n.t("profile.edit.usernameLabel")}
                name="username"
                rules={{
                  required: true,
                  minLength: 3,
                  maxLength: 30,
                  validate: {
                    noSpecialChars: (v: string) =>
                      /^[a-zA-Z0-9_.]+$/.test(v) || i18n.t("INVALID_USERNAME"),
                  },
                }}
                leftIcon="at-sign"
              />

              <EmailSection>
                <InputText
                  control={control}
                  label={i18n.t("profile.edit.emailLabel")}
                  name="email"
                  disabled={true}
                  rules={{ required: false }}
                  leftIcon="mail"
                />
                <Txt
                  text={i18n.t("profile.edit.emailHint")}
                  align="left"
                  color={colors.text50}
                  style={{ paddingLeft: 6 }}
                />
              </EmailSection>
            </FormContainer>

            <ButtonContainer>
              <CustomButton
                text={i18n.t("profile.edit.saveButton")}
                onPress={handleSubmit(handleSave)}
                loading={isSaving}
                iconPosition="right"
                icon={<Feather name="save" color={colors.white} size={18} />}
              />
            </ButtonContainer>
          </Page>
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
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0 24px;
`;

const Page = styled.View`
  padding: 24px;
  flex: 1;
`;

const AvatarSection = styled.View`
  align-items: center;
  margin-top: 28px;
  margin-bottom: 28px;
`;

const FormContainer = styled.View`
  gap: 4px;
`;

const EmailSection = styled.View`
`;

const ButtonContainer = styled.View`
  margin-top: 32px;
  margin-bottom: 32px;
  flex: 1;
`;
