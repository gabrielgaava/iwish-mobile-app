import { BorderButton, CustomButton } from "@/components/buttons";
import { InputText } from "@/components/input";
import { OrSection } from "@/components/or-section";
import { ScrollScreen } from "@/components/ui/screen";
import { Txt } from "@/components/ui/text";
import { Icons } from "@/constants/icons";
import i18n from "@/constants/region";
import { nameRules, passwordRules, usernameRules } from "@/constants/rules";
import { api } from "@/lib/api";
import { RegisterForm } from "@/types/Forms";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Platform, TouchableOpacity } from "react-native";
import styled, { useTheme } from "styled-components/native";

export default function RegisterScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [isFetching, setIsFetching] = useState(false);
  const [serverError, setServerError] = useState("");

  const { control, handleSubmit } = useForm<RegisterForm>({
    defaultValues: { name: "", username: "", email: "", password: "" },
  });

  const handleSignUp: SubmitHandler<RegisterForm> = async (form) => {
    setIsFetching(true);
    setServerError("");

    const response = await api.post("/auth/register", form);
    console.log(response.data);

    if (response.status !== 200) {
      setIsFetching(false);
      return setServerError(response.data.code);
    }

    const otpResponse = await api.post("/auth/verification", {
      type: "email-verification",
      email: form.email,
    });

    if (otpResponse.status !== 200) {
      setIsFetching(false);
      return setServerError(response.data.code);
    }

    setIsFetching(false);
    return router.push({
      pathname: "/(auth)/verify",
      params: { email: response.data.email, type: "email-verification" },
    });
  };

  return (
    <ScrollScreen>
      <ScreenContent>

        {router.canGoBack() && (
          <BackButton onPress={() => router.back()}>
            <Feather name="arrow-left" size={22} color={colors.text} />
          </BackButton>
        )}

        <TitleSection>
          <Txt
            text={i18n.t("auth.register.title")}
            weight="bold"
            align="left"
            size={28}
            color={colors.text}
          />
          <Txt
            align="left"
            text={i18n.t("auth.register.subTitle")}
            color={colors.text70}
            style={{ marginTop: 4 }}
          />
        </TitleSection>

        <FormSection>
          <InputText
            control={control}
            name="name"
            label={i18n.t("auth.register.fullName")}
            rules={{ required: true, validate: nameRules }}
            leftIcon="user"
          />
          <InputText
            control={control}
            name="username"
            label={i18n.t("auth.register.username")}
            rules={{ required: true, minLength: 3, validate: usernameRules }}
            leftIcon="at-sign"
          />
          <InputText
            control={control}
            name="email"
            label={i18n.t("auth.email")}
            rules={{ required: true, isEmail: true }}
            leftIcon="mail"
          />
          <InputText
            control={control}
            name="password"
            label={i18n.t("auth.password")}
            rules={{
              required: true,
              isPassword: true,
              minLength: 8,
              validate: passwordRules,
            }}
          />

          {!!serverError && (
            <Txt
              text={i18n.t(serverError)}
              color={colors.errorText}
              style={{ marginBottom: 8 }}
            />
          )}

          <ButtonWrapper>
            <CustomButton
              text={i18n.t("auth.register.createAccount")}
              onPress={handleSubmit(handleSignUp)}
              loading={isFetching}
            />
          </ButtonWrapper>
        </FormSection>

        <SocialSection>
          <OrSection text={i18n.t("auth.register.orContinueWith")} />
          <SocialRow>
            <BorderButton
              onPress={() => {}}
              text="Google"
              icon={<Image source={Icons.google} style={{ width: 20, height: 20 }} />}
            />
            {Platform.OS === "ios" && (
              <BorderButton
                onPress={() => {}}
                text="Apple"
                color={colors.text}
                icon={<Image source={Icons.apple} style={{ width: 20, height: 20 }} />}
              />
            )}
          </SocialRow>
        </SocialSection>

        <FooterSection>
          <AlreadyRow>
            <Txt
              text={i18n.t("auth.register.alreadyHaveAccount")}
              color={colors.text70}
            />
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Txt
                text={i18n.t("auth.register.login")}
                color={colors.primary}
                weight="bold"
              />
            </TouchableOpacity>
          </AlreadyRow>

          <TermsRow>
            <Txt
              text={i18n.t("auth.register.termsPrefix") + " "}
              color={colors.text50}
              size={12}
              style={{ textAlign: "center" }}
            />
            <TouchableOpacity>
              <Txt
                text={i18n.t("auth.register.termsLink")}
                color={colors.text50}
                size={12}
                style={{ textDecorationLine: "underline" }}
              />
            </TouchableOpacity>
            <Txt text={" " + i18n.t("auth.register.termsMiddle") + " "} color={colors.text50} size={12} />
            <TouchableOpacity>
              <Txt
                text={i18n.t("auth.register.privacyLink")}
                color={colors.text50}
                size={12}
                style={{ textDecorationLine: "underline" }}
              />
            </TouchableOpacity>
            <Txt text="." color={colors.text50} size={12} />
          </TermsRow>
        </FooterSection>

      </ScreenContent>
    </ScrollScreen>
  );
}

const ScreenContent = styled.View`
  flex: 1;
  padding: 0px 24px;
`;

const BackButton = styled.TouchableOpacity`
  padding: 4px;
  margin-bottom: 24px;
  align-self: flex-start;
`;

const TitleSection = styled.View`
  margin-bottom: 8px;
  justify-content: flex-start;
  align-items: flex-start;
`;

const FormSection = styled.View`
  width: 100%;
`;

const SocialSection = styled.View`
  margin-top: 8px;
`;

const SocialRow = styled.View`
  flex-direction: row;
  gap: 12px;
`;

const FooterSection = styled.View`
  margin-top: auto;
  padding-top: 24px;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: flex-end;
`;

const AlreadyRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const TermsRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding-bottom: 12px;
`;

const ButtonWrapper = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
`;