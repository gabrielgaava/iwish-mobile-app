import { CustomButton, LinkButton } from '@/components/buttons';
import { InputText } from '@/components/input';
import OTPWithResend from '@/components/otp/OTPWithResend';
import {
  AuthBackButton,
  AuthButtonWrapper,
  AuthHeaderSection,
  AuthIconContainer,
  AuthNotReceivedRow,
} from '@/components/shared-design';
import { Container } from '@/components/ui/container';
import { ScrollScreen } from '@/components/ui/screen';
import { Txt } from '@/components/ui/text';
import i18n from '@/constants/region';
import { passwordRules } from '@/constants/rules';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

export default function RecoveryScreen() {

  const router = useRouter();
  const { colors } = useTheme();
  const { signInWithTokens } = useAuth();
  const { control, handleSubmit, getValues } = useForm({
    defaultValues: { email: "", newPassword: "" },
  });

  const [currentStep, setCurrentStep] = useState<string>("email");
  const [isFetching, setIsFetching] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string|null>(null);
  const [email, setEmail] = useState("");

  const handleEmailRecoveryEvent = async (data: any) => {
    setIsFetching(true);

    const response = await api.post("/auth/verification", {
      email: data.email,
      type: "reset-password",
    });

    console.log("Recovery Data: ", response.data);

    if(response.status !== 200) {
      setError(response.data.code);
    }

    if(response.status === 200) {
      setCurrentStep("otp");
      setEmail(data.email);
    }

    setIsFetching(false);
  }

  const handleResend = useCallback(async () => {
    const email = getValues("email");
    await api.post("/auth/verification", { email, type: "reset-password" });
  }, [getValues]);

  const goBack = useCallback(() => {
    if(currentStep === "otp") {
      return setCurrentStep("email");
    }

    return router.back();
  }, [currentStep]);

  const goToPasswordStep = useCallback((code: string) => {
    setOtp(code);
    setCurrentStep("password")
  }, [])

  const verifyOtp = async (data: any) => {
    setIsFetching(true);
    setError(null);

    const response = await api.post("/auth/verification/validate", {
      otp: otp,
      email: email,
      type: "reset-password",
      newPassword: data.newPassword
    });

    setIsFetching(false);

    if (response.status !== 200) {
      setError(response.data.code);
      return;
    }

    return await signInWithTokens(response.data);
  }

  return (
    <ScrollScreen>
      <Body type="column" stretch>

        <AuthBackButton onPress={() => goBack()}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </AuthBackButton>

        <AuthHeaderSection>
          <AuthIconContainer>
            <Feather name="refresh-ccw" size={32} color={colors.primary} />
          </AuthIconContainer>
          <Txt
            text={i18n.t("recovery.header")}
            weight="bold"
            size={28}
            color={colors.text}
            style={{ marginTop: 20 }}
          />
          <Txt
            text={i18n.t("recovery.subTitle")}
            color={colors.text70}
            style={{ marginTop: 8, lineHeight: 22, textAlign: "center" }}
          />
          {currentStep === "otp" && <Txt
            text={email}
            color={colors.text70}
            style={{ marginTop: 8, lineHeight: 22, textAlign: "center" }}
          />}
        </AuthHeaderSection>

        {currentStep === "email" && (
          <>
            <InputText name='email' label='Email' control={control} rules={{required: true, isEmail: true}}/>
            <AuthButtonWrapper>
              {error && <Txt text={i18n.t(error)} size={14} color={colors.errorText} style={{marginBottom: 12}}/>}
              <CustomButton
                text="Send Recovery Code"
                onPress={handleSubmit(handleEmailRecoveryEvent)}
                loading={isFetching}
                icon={<Feather name="chevrons-right" size={18} color={colors.white} />}
                iconPosition="right"
                radius={14}
                height={54}
              />
            </AuthButtonWrapper>
            <TouchableOpacity onPress={() => router.replace("/login")} activeOpacity={0.7}>
              <AuthNotReceivedRow>
                <Txt
                  text={i18n.t("recovery.doLogin") + " "}
                  color={colors.text50}
                  size={14}
                />
                <Txt
                  text={i18n.t("recovery.doLoginBold")}
                  color={colors.primary}
                  weight={"bold"}
                  size={14}
                />
              </AuthNotReceivedRow>
            </TouchableOpacity>
          </>
        )}

        {currentStep === "otp" && (
          <>
            <OTPWithResend
              onComplete={goToPasswordStep}
              length={6}
              onResendPress={handleResend}
            />
            <LinkButton text='Voltar' onPress={() => setCurrentStep("email")}/>
          </>
        )}

        {currentStep === "password" && (
          <>
            <InputText 
              name='newPassword' 
              label={i18n.t("auth.password")}
              control={control} 
              rules={{required: true, isPassword: true, validate: passwordRules}}
            />
            <AuthButtonWrapper>
              {error && <Txt text={i18n.t(error)} size={14} color={colors.errorText} style={{marginBottom: 12}}/>}
              <CustomButton
                text={i18n.t("recovery.updatePassword")}
                onPress={handleSubmit(verifyOtp)}
                loading={isFetching}
                icon={<Feather name="chevrons-right" size={18} color={colors.white} />}
                iconPosition="right"
                radius={14}
                height={54}
              />
            </AuthButtonWrapper>
          </>
        )}

      </Body>
    </ScrollScreen>
  )
}

const Body = styled(Container)`
  padding-left: 24px;
  padding-right: 24px;
  justify-content: center;
`;
