import { CustomButton } from "@/components/buttons";
import ImageBox from "@/components/image-box";
import { Txt } from "@/components/ui/text";
import { images } from "@/constants/images";
import i18n from "@/constants/region";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import styled, { useTheme } from "styled-components/native";

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <Screen>
      {/* Hero — placeholder até ter a foto definitiva */}
      <HeroSection>
        <ImageBox
          source={images.welcome}
          contentFit="cover"
          style={{ flex: 1 }}
        />
      </HeroSection>

      {/* Card de conteúdo com topo arredondado */}
      <ContentCard edges={["bottom"]}>
        <LogoRow>
          <Txt text="Wishhub" weight="bold" size={30} color={colors.primary} />
          <AccentStar>✦</AccentStar>
        </LogoRow>

        <Txt
          text={i18n.t("welcome.tagline")}
          weight="bold"
          size={22}
          color={colors.text}
          style={{ marginTop: 10, textAlign: "center" }}
        />
        <Txt
          text={i18n.t("welcome.subtitle")}
          size={14}
          color={colors.text70}
          style={{ marginTop: 8, textAlign: "center", lineHeight: 20 }}
        />

        <Features>
          <FeatureCard>
            <Txt
              text={i18n.t("welcome.features.lists.title")}
              weight="bold"
              size={16}
              color={colors.text}
            />
            <Txt
              text={i18n.t("welcome.features.lists.description")}
              size={14}
              color={colors.text70}
              style={{ marginTop: 4, lineHeight: 16 }}
            />
          </FeatureCard>

          <FeatureCard>
            <Txt
              text={i18n.t("welcome.features.socialize.title")}
              weight="bold"
              size={16}
              color={colors.text}
            />
            <Txt
              text={i18n.t("welcome.features.socialize.description")}
              size={14}
              color={colors.text70}
              style={{ marginTop: 4, lineHeight: 16 }}
            />
          </FeatureCard>
        </Features>

        <ButtonsSection>
          <CustomButton
            text={i18n.t("welcome.createAccount")}
            onPress={() => router.push("/(auth)/register")}
          />
          <CustomButton
            text={i18n.t("welcome.login")}
            onPress={() => router.push("/(auth)/login")}
            variant="outline"
          />
        </ButtonsSection>
      </ContentCard>
    </Screen>
  );
}

const Screen = styled.View`
  flex: 1;
  background-color: ${p => p.theme.colors.duotoneBackground};
`;

const HeroSection = styled.View`
  flex: 4;
  width: 100%;
  overflow: hidden;
`;

const ContentCard = styled(SafeAreaView)`
  flex: 6;
  border-top-left-radius: 28px;
  border-top-right-radius: 28px;
  background-color: ${p => p.theme.colors.background};
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 28px;
  margin-top: -28px;
`;

const LogoRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

const AccentStar = styled.Text`
  font-size: 22px;
  color: ${p => p.theme.colors.accent};
  line-height: 30px;
`;

const Features = styled.View`
  flex-direction: column;
  width: 100%;
  gap: 12px;
  margin-top: 16px;
`;

const FeatureCard = styled.View`
  background-color: ${p => p.theme.colors.darkBackground};
  border-radius: 14px;
  padding: 14px;
`;

const ButtonsSection = styled.View`
  gap: 12px;
  margin-top: auto;
  padding-bottom: 8px;
`;
