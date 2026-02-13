// screens/RegisterScreen.tsx  (apenas a parte relevante)
import { ActionButton, BorderButton, LinkButton } from "@/components/buttons";
import { GradientHeader } from "@/components/gradient-header";
import { InputText } from "@/components/input";
import { OrSection } from "@/components/or-section";
import { Container } from "@/components/ui/container";
import { ScrollScreen } from "@/components/ui/screen";
import { Txt } from "@/components/ui/text";
import { Icons } from "@/constants/icons";
import { api } from "@/lib/api";
import { LoginForm } from "@/types/Forms";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useTheme } from "@react-navigation/native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components/native";

export default function RegisterScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [isFetching, setIsFetching] = useState(false);
  const [loginError, setLoginError] = useState("");

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: "", email: "", password: "" },
  });

  const handleSignUp = async (form: LoginForm) => {
    setIsFetching(true);
    const response = await api.post("/auth/register", form);
    console.log(response.data);

    if(response.status !== 200) {
      setIsFetching(false);
      return setLoginError(response.data.code);
    }

    const otpResponse = await api.post("/auth/verification", {
      type: "email-verification",
      email: form.email
    });

    if(otpResponse.status !== 200) {
      setIsFetching(false);
      return setLoginError(response.data.code);
    }
    
    setIsFetching(false);

    return router.push({
      pathname: "/(auth)/verify", 
      params: { 
        email: response.data.email,
        type: "email-verification"
      }
    });
    
  }

  const goToLogin = () => {
    router.push("/(auth)/login");
  }

  return (
    <ScrollScreen>
      <GradientHeader colors={colors.primaryGradient} height={25}>
        <AntDesign name="shopping" size={36} color={colors.white70} />
        <Txt text="iWish App" weight="bold" color={colors.white} size={26} style={{paddingBottom: 40}}/>
      </GradientHeader>

      <Glassffect />
      <RoundedBody type="column" stretch>
        
        <InnerContainer type="column" stretch align="center" justify="space-between">
          <Container type="column" stretch>
            <TextContainer type="column">
              <Txt weight="bold" text="Get started free" size={24} />
              <Txt text="Free forever. Just share your wishes!" color={colors.text70} />
            </TextContainer>

            <FormContainer type="column">
              <InputText 
                name="name" 
                label="Name" 
                control={control} 
                rules={{ required: true }} 
              />
              <InputText 
                name="email" 
                label="E-mail" 
                control={control} 
                rules={{ required: true, isEmail: true }} 
              />
              <InputText 
                name="password" 
                label="Password" 
                control={control} 
                rules={{ required: true, isPassword: true }} 
              />
              {!!loginError && <Txt text={loginError} color={colors.errorText}/>}
              <ActionButton onPress={handleSubmit(handleSignUp)} text="Sign Up" loading={isFetching} />
              <LinkButton text="Already have an account ? Sign In" onPress={() => goToLogin()} />
            </FormContainer>
          </Container>

          <SocialContainer type="column" stretch justify="flex-end">
            <OrSection text="Or sign up with" />
            <Row type="row" gap={12} stretch>
              <BorderButton
                onPress={() => {}}
                text="Google"
                icon={<Image source={Icons.google} style={{ width: 20, height: 20 }} />}
              />
              <BorderButton
                onPress={() => {}}
                text="Facebook"
                color="#1976d2"
                icon={<Image source={Icons.facebook} style={{ width: 20, height: 20 }} />}
              />
            </Row>
          </SocialContainer>
        </InnerContainer>
      </RoundedBody>
    </ScrollScreen>
  );
}


const RoundedBody = styled(Container)`
  width: 100%;
  heigth: 100%;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  margin-top: -4px;          
  padding-top: 20px;  
  padding-vertical: 24px;
  padding-horizontal: 20px;
  justify-content: flex-start;
  align-items: center;
  background-color: ${p => p.theme.colors.background};
  flex-grow: 1;

  shadow-color: #000;
  shadow-offset: 0px -2px;
  shadow-opacity: 0.1;
  shadow-radius: 6px;
  elevation: 6;
`;

const Glassffect = styled.View`    
  background-color: ${p => p.theme.colors.glassBackground};
  width: 90%;
  height: 16px;
  margin-top: -50px;  
  justify-self: flex-end;
  align-self: center;
  border-radius: 30px 30px 0px 0px;
`;

const InnerContainer = styled(Container)`
  width: 100%;
  flex-grow: 1;
  max-width: 520px; /* opcional para telas grandes */
  align-items: center;
  justify-content: flex-start;
`;

const TextContainer = styled(Container)`
  width: 100%;
  align-items: center;
  margin-bottom: 12px;
`;

const FormContainer = styled(Container)`
  width: 100%;
  padding-bottom: 8px;
`;

const SocialContainer = styled(Container)`
  width: 100%;
  margin-top: 12px;
  flex-grow: 1;
`;

const Row = styled(Container)` width: 100%; `;
