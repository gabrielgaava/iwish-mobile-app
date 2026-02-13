import { ActionButton, BorderButton, LinkButton } from "@/components/buttons";
import { GradientHeader } from "@/components/gradient-header";
import { InputText } from "@/components/input";
import { OrSection } from "@/components/or-section";
import { Container } from "@/components/ui/container";
import { ScrollScreen } from "@/components/ui/screen";
import { Txt } from "@/components/ui/text";
import { Icons } from "@/constants/icons";
import i18n from "@/constants/region";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import AntDesign from "@expo/vector-icons/AntDesign";
import { GoogleSignin, isSuccessResponse } from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from 'expo-apple-authentication';
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Platform } from "react-native";
import styled, { useTheme } from "styled-components/native";

type LoginForm = {
  email: string;
  password: string;
};

GoogleSignin.configure({
  iosClientId: "604176384181-6qhbp4ditta249f7a3v2g09ln1di0tos.apps.googleusercontent.com",
  webClientId: "604176384181-pds7paq5eu7bksivhn3347r31d40jp48.apps.googleusercontent.com",
})

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, socialSignIn } = useAuth();
  const { colors } = useTheme();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | any>(null);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginForm> = async (formData) => {

    setIsFetching(true);
    console.log(formData);

    const { data, error } = await signIn(formData.email, formData.password);
    console.log("Login response", data)

    setIsFetching(false);

    if (error) {
      console.log("Login error: ", error);

      // Not verified email, send notification and redirect to verification screen
      if(error?.code === "EMAIL_NOT_VERIFIED") {

        const codeResponse = await api.post("/auth/verification", {
          email: formData.email, 
          type: "email-verification"
        });
        
        if(codeResponse.status === 200) {
          router.push({
            pathname: "/verify",
            params: { 
              email: formData.email,
              type: "email-verification"
            },
          });
          return;
        } 

        setError("errors.somethingWentWrong");
      }

      return setError(error?.code);
    } 
    
    return router.replace("/(protected)/(tabs)");

  };

  const goToRecovery = () => {
    router.push({
      pathname: "/recovery", params: {
        email: "teste.brabo@gmail.com"
      }
    });
  }

  const handelSocialLogin = async (provider: "google" | "apple") => {
    setIsFetching(true);
    if (provider === "google") return handleGoogleSignIn();
    if (provider === "apple") return handleAppleLogin();
  }

  async function handleGoogleSignIn() {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if(isSuccessResponse(response)){
        console.log("Google Response:", response.data);
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  async function handleAppleLogin() {
    try {
      const credentials = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        ]
      });

      console.log(credentials);
      socialSignIn({ provider: "apple", idToken: credentials.identityToken! });
      router.replace("/(protected)/(tabs)")
    }

    catch (error) {
      console.log(error);
    }
  }

  return (
    <ScrollScreen>
      <GradientHeader colors={colors.primaryGradient}>
        <AntDesign name="shopping" size={36} color={colors.white70} />
        <HeaderText text="iWish" weight="bold" color={colors.white} />
      </GradientHeader>

      <Glassffect />
      <RoundedBody type="column" stretch>
        <InnerContainer type="column" stretch align="center" justify="space-between">
          <Container type="column" stretch>
            <Txt text="Welcome Back!" weight="semi" color={colors.text} size={24} />
            <Txt text="Enter your details below" color={colors.text70} style={{ marginBottom: 12 }} />
          </Container>

          <FormSection>
            <InputText
              control={control}
              name="email"
              label="Email"
              rules={{ isEmail: true, required: true }}
            />
            <InputText
              control={control}
              name="password"
              label="Password"
              rules={{ isPassword: true, required: true }}
            />
            {!!error && <Txt text={i18n.t(error)} color={colors.errorText} />}
            <ActionButton
              onPress={handleSubmit(onSubmit)}
              text="Sign in"
              loading={isFetching}
            />
            <LinkButton
              text="Forgot your password ?"
              onPress={() => goToRecovery()}
              textAlign="center"
              style={{ marginTop: 20 }}
            />
          </FormSection>

          <FooterSection>
            <OrSection text="Or sign in with" />

            <SocialButtons>
              <BorderButton
                onPress={() => handelSocialLogin("google")}
                text="Google"
                icon={<Image source={Icons.google} style={{ width: 20, height: 20 }} />}
              />
              {Platform.OS === "ios" &&
                <BorderButton
                  onPress={() => handelSocialLogin("apple")}
                  text="Apple"
                  color={colors.text}
                  icon={<Image source={Icons.apple} style={{ width: 20, height: 20 }} />}
                />}
            </SocialButtons>
          </FooterSection>
        </InnerContainer>
      </RoundedBody>
    </ScrollScreen>
  );
}

const RoundedBody = styled(Container)`
  width: 100%;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  margin-top: -4px;          
  padding-top: 20px;  
  padding-bottom: 20px;
  padding-left: 24px;
  padding-right: 24px;
  justify-content: flex-start;
  align-items: center;
  background-color: ${p => p.theme.colors.background};
  flex-grow: 1;
`;

const InnerContainer = styled(Container)`
  width: 100%;
  flex-grow: 1;
  max-width: 520px; 
  align-items: center;
  justify-content: flex-start;
  padding-top: 20px;
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

const HeaderText = styled(Txt)`
  padding-bottom: 20px;
`;

const FormSection = styled.View`
  flex: 1;
  width: 100%;
`;

const FooterSection = styled.View`
  width: 100%;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
`;

const SocialButtons = styled.View`
  flex-direction: row;
  gap: 16px;
`;
