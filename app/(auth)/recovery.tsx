
import { ActionButton, LinkButton } from '@/components/buttons';
import { InputText } from '@/components/input';
import OTPCodeInput from '@/components/otp';
import { Container } from '@/components/ui/container';
import { ScrollScreen } from '@/components/ui/screen';
import { Txt } from '@/components/ui/text';
import { images } from '@/constants/images';
import i18n from '@/constants/region';
import { useTheme } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components/native';

export default function RecoveryScreen() {

  const router = useRouter();
  const { colors } = useTheme();
  const { control, handleSubmit } = useForm({
    defaultValues: { email: "", newPassword: "" },
  });

  const [currentStep, setCurrentStep] = useState<string>("email");

  const handleOnComplete = (code: string) => {
    console.log("OTP Code entered: ", code);
  }

  const handleEmailRecoveryEvent = (data: any) => {
    setCurrentStep("otp");
    console.log("Recovery Data: ", data);
  }

  return (
    <ScrollScreen>
      <Body type="column" stretch>
        <Header type='column'>
          <Image source={images.otpImage} style={{ width: 200, height: 200 }} />
          <Txt text={i18n.t("recovery.header")} weight="bold" size={24} />
        </Header>

        {currentStep === "email" && (
          <>
            <Txt text={i18n.t("recovery.subheader")} color={colors.text70} />
            <InputText name='email' label='Email' control={control} rules={{required: true, isEmail: true}}/>
            <ActionButton text='Send Recovery Code' onPress={handleSubmit(handleEmailRecoveryEvent)} />
          </>
        )}
        
        {currentStep === "otp" && (
          <>
            <OTPCodeInput onComplete={handleOnComplete} length={6} />
            <LinkButton text='Voltar' onPress={() => setCurrentStep("email")}/>
          </>
        )}

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