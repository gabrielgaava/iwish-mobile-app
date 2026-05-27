import { CustomButton } from "@/components/buttons";
import OTPWithResend from "@/components/otp/OTPWithResend";
import {
  AuthBackButton,
  AuthButtonWrapper,
  AuthHeaderSection,
  AuthIconContainer,
} from "@/components/shared-design";
import { ScrollScreen } from "@/components/ui/screen";
import { Txt } from "@/components/ui/text";
import i18n from "@/constants/region";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { VerifyTypes } from "@/types/IAuth";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { useTheme } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import styled from "styled-components/native";

export default function OTPVerifyScreen() {
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const { email, type } = useLocalSearchParams<{ email: string; type: VerifyTypes }>();
  const { colors } = useTheme();
  const { signInWithTokens } = useAuth();

  const handleResend = useCallback(async () => {
    setErrorMessage("");
    await api.post("/auth/verification", { email, type });
  }, [email, type]);

  const handleVerify = useCallback(async () => {
    if (otp.length !== 6) return;
    setIsFetching(true);
    setErrorMessage("");

    const response = await api.post("/auth/verification/validate", {
      email, otp, type,
    });

    setIsFetching(false);

    if (response.status !== 200) {
      setErrorMessage(i18n.t(response.data.code));
      return;
    }

    await signInWithTokens(response.data);
  }, [otp, email, type, signInWithTokens]);

  return (
    <ScrollScreen>
      <ScreenContent>

        <AuthBackButton onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </AuthBackButton>

        <AuthHeaderSection>
          <AuthIconContainer>
            <Feather name="shield" size={32} color={colors.primary} />
          </AuthIconContainer>
          <Txt
            text={i18n.t("verify.title")}
            weight="bold"
            size={28}
            color={colors.text}
            style={{ marginTop: 20 }}
          />
          <Txt
            text={i18n.t("verify.subTitle")}
            color={colors.text70}
            style={{ marginTop: 8, lineHeight: 22, textAlign: "center" }}
          />
          {email && (
            <Txt
              text={email}
              color={colors.text70}
              style={{ marginTop: 8, lineHeight: 22, textAlign: "center" }}
            />
          )}
        </AuthHeaderSection>

        <OTPWithResend
          onComplete={setOtp}
          onChange={setOtp}
          length={6}
          onResendPress={handleResend}
        />

        {!!errorMessage && (
          <Txt
            text={errorMessage}
            color={colors.errorText}
            style={{ textAlign: "center", marginTop: 8 }}
          />
        )}

        <AuthButtonWrapper>
          <CustomButton
            text={i18n.t("verify.verifyCode")}
            onPress={handleVerify}
            loading={isFetching}
            disabled={otp.length !== 6}
            icon={<AntDesign name="check-circle" size={18} color={colors.white} />}
            iconPosition="right"
            radius={14}
            height={54}
          />
        </AuthButtonWrapper>

      </ScreenContent>
    </ScrollScreen>
  );
}

const ScreenContent = styled.View`
  flex: 1;
  padding-left: 24px;
  padding-right: 24px;
`;
