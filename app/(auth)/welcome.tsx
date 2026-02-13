import { ActionButton } from "@/components/buttons";
import { GradientHeader } from "@/components/gradient-header";
import { Container } from "@/components/ui/container";
import { ScrollScreen } from "@/components/ui/screen";
import { Txt } from "@/components/ui/text";
import { images } from "@/constants/images";
import { useTheme } from "@react-navigation/native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import styled from "styled-components/native";



export default function WelcomeScreen() {
  const router = useRouter();
  const {colors} = useTheme();

  return (
    <ScrollScreen>
      <GradientHeader colors={colors.primaryGradient}>
        <Txt text="Welcome to" weight="light" color={colors.white70} />
        <Txt text="iWish App" weight="bold" size={26} color={colors.white}/>
      </GradientHeader>
      <Body type="column">
        <Content type="column" justify="flex-start" align="center">
          <Txt text="Todo mundo tem desejos" weight="bold" size={24}/>
          <Txt text="Que tal compartilhar os seus com a galera?" size={18} color={colors.text70}/>
          <StyledImage source={images.welcomeImage1} />
        </Content>
        <ButtonsGroup type="column" align="flex-end" justify="flex-end" stretch>
          <ActionButton text="Fazer Login" onPress={() => router.push("/(auth)/login")} duotone/>
          <ActionButton text="Criar Conta" onPress={() => router.push("/(auth)/register")}/>
        </ButtonsGroup>
      </Body>
    </ScrollScreen>
  );
}

const Body = styled(Container)`
  flex-grow: 1;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  margin-top: -30px;
  padding-top: 24px;
  padding-bottom: 24px;
  padding-left: 24px;
  padding-right: 24px;
  justify-content: flex-start;
  align-items: center;
  background-color: ${props => props.theme.colors.background};
  
  /* sombra no RN via styled-components */
  shadow-color: #000;
  shadow-offset: 0px -2px;
  shadow-opacity: 0.1;
  shadow-radius: 6px;
  elevation: 6;
`;

const Content = styled(Container)`
  margin-top: 20px;
  margin-bottom: 60px;
`

const StyledImage = styled(Image)`
  width: 200px;
  height: 200px;
  margin-top: 20px;
`

const ButtonsGroup = styled(Container)`
  flex-grow: 1;
`
