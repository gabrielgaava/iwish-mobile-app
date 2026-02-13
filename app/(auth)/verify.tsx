import OTPCodeInput from '@/components/otp';
import { Container } from "@/components/ui/container";
import { ScrollScreen } from "@/components/ui/screen";
import { Txt } from "@/components/ui/text";
import { images } from '@/constants/images';
import i18n from '@/constants/region';
import { api } from '@/lib/api';
import { VerifyTypes } from '@/types/IAuth';
import { useTheme } from '@react-navigation/native';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import styled from 'styled-components/native';

export default function OTPVerifyScreen() {
  const [canRetry, setCanRetry] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { email, type } = useLocalSearchParams<{ email: string, type: VerifyTypes }>();
  const { colors } = useTheme();

  const handleTimerFinish = useCallback(() => {
    console.log("Timer finished, can retry now.");
    setCanRetry(true);
  }, []);

  const handleOnComplete = async (code: string) => {
    console.log("OTP Code: ", code);
    if(type === "email-verification") {
      const response = await api.post("/auth/verification/validate", {
        email, otp: code, type
      });

      if(response.status !== 200) {
        setErrorMessage(i18n.t(response.data.code));
        return;
      }

      if(response.data) {
        router.replace("/(protected)/(tabs)");
      }
    }
  }

  return (
    <ScrollScreen>
      <Body type="column" stretch>
        <Header type='column'>
          <Image source={images.otpImage} style={{ width: 200, height: 200 }} />
          <Txt text={i18n.t("verify.header")} weight="bold" size={24} />
          <Txt text={i18n.t("verify.subheader")} color={colors.text70} />
          <Txt text={email || "no.email@gmail.com"} />
        </Header>

        <OTPCodeInput onComplete={handleOnComplete} length={6} />

        {/*!canRetry && (
          <ReesendRow type='row' justify='space-between' stretch>
            <Txt text="You can send a new code in:" color={colors.text70} />
            <CountdownTimer minutes={0.5} onFinish={() => handleTimerFinish()} />
          </ReesendRow>
        )*/}

        {!!errorMessage && !canRetry && <Txt text={errorMessage} color={colors.errorText} style={{ marginTop: 20 }} />}

      </Body>
    </ScrollScreen>
  )
}

const Body = styled(Container)`
  padding-horizontal: 24px;
  justify-content: center;

`

const Header = styled(Container)`
  align-items: center;
  margin-bottom: 20px;
`

const ReesendRow = styled(Container)`
  margin-top: 20px;
`