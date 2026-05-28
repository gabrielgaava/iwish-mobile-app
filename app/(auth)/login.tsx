import { BorderButton, CustomButton, LinkButton } from "@/components/buttons";
import { InputText } from "@/components/input";
import MessageAlert from "@/components/message-alert";
import { OrSection } from "@/components/or-section";
import { ScrollScreen } from "@/components/ui/screen";
import { Txt } from "@/components/ui/text";
import { Icons } from "@/constants/icons";
import i18n from "@/constants/region";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import Feather from "@expo/vector-icons/Feather";
import { GoogleSignin, isSuccessResponse } from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Platform } from "react-native";
import styled, { useTheme } from "styled-components/native";

type LoginForm = {
  email: string;
  password: string;
};


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

  const onSubmit: SubmitHandler<LoginForm> = useCallback(async (formData) => {

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
    
    return router.replace("/(protected)/(tabs)/(home)");
  }, []);

  const goToRecovery = () => {
    router.push({
      pathname: "/recovery", params: {}
    });
  }

  const goToRegister = () => {
    router.push({
      pathname: "/register"
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

      if (isSuccessResponse(response)) {
        const { error } = await socialSignIn({
          provider: "google",
          idToken: response.data.idToken!,
        });

        if (error) {
          return setError(error?.code);
        }

        router.replace("/(protected)/(tabs)/(home)");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  }

  async function handleAppleLogin() {
    try {
      const credentials = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        ],
      });

      const givenName = credentials.fullName?.givenName ?? "";
      const familyName = credentials.fullName?.familyName ?? "";
      const fullName = `${givenName} ${familyName}`.trim() || undefined;

      const { error } = await socialSignIn({
        provider: "apple",
        idToken: credentials.identityToken!,
        name: fullName,
      });

      if (error) {
        return setError(error?.code);
      }

      router.replace("/(protected)/(tabs)/(home)");
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  }

  return (
    <ScrollScreen indicator={false}>
      <Body>
        <InnerContainer>
          <Feather name="gift" size={40} color={colors.primary} style={{marginTop: 28, marginBottom: 8}}/>
          <Header>
            <Txt text={i18n.get("auth.login.title")} weight="bold" color={colors.text} size={26} align="left" />
            <Txt text={i18n.get("auth.login.subTitle")}  color={colors.text70} style={{ marginBottom: 24 }} size={16} align="left"/>
          </Header>

          <FormSection>
            <InputText
              control={control}
              name="email"
              label="Email"
              rules={{ isEmail: true, required: true }}
              leftIcon="mail"
            />
            <InputText
              control={control}
              name="password"
              label="Password"
              rules={{ isPassword: true, required: true, minLength: 6 }}
            />
            <Forgot>
               <LinkButton
                  text="Forgot your password ?"
                  onPress={() => goToRecovery()}
                  textAlign="center"
                />
            </Forgot>
            <CustomButton
              onPress={handleSubmit(onSubmit)}
              text="Sign in"
              loading={isFetching}
            />
            {!!error && <MessageAlert type="error" message={i18n.t(error)}/>}
          </FormSection>

          <FooterSection>
            <OrSection text={i18n.t("or")} />
            <SocialButtons>
              <BorderButton
                onPress={() => handelSocialLogin("google")}
                text={i18n.get("auth.login.goWithGoogle")}
                icon={<Image source={Icons.google} style={{ width: 20, height: 20 }} />}
              />
              {Platform.OS === "ios" &&
                <BorderButton
                  onPress={() => handelSocialLogin("apple")}
                  text={i18n.get("auth.login.goWithApple")}
                  color={colors.text}
                  icon={<Image source={Icons.apple} style={{ width: 20, height: 20 }} />}
                />
              }
              <LinkButton
                text={i18n.t("auth.login.noAccount")}
                onPress={() => goToRegister()}
                textAlign="center"
              />
            </SocialButtons>
          </FooterSection>
        </InnerContainer>
      </Body>
    </ScrollScreen>
  );
}

const Header = styled.View``;

const Body = styled.View`
  width: 100%;
  flex: 1;
  padding-left: 24px;
  padding-right: 24px;
  justify-content: center;
  align-items: center;
`;

const InnerContainer = styled.View`
  width: 100%;
  padding-top: 20px;
`;

const FormSection = styled.View`
  width: 100%;
`;

const FooterSection = styled.View`
  width: 100%;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  margin-top: auto;
  padding-top: 16px;
  padding-bottom: 16px;
`;

const SocialButtons = styled.View`
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const Forgot = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 24px;
  padding-right: 6px;
`;