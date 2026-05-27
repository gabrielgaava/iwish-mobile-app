import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";

type BackHeaderProps = {
  onBack?: () => {};
}

export default function BackHeader({ onBack }: BackHeaderProps) {

  const { colors } = useTheme();
  const router = useRouter();

  const handleBack = () => {
    if(!!onBack) {
      return onBack();
    }

    return router.back();
  }

  return (
    <Container>
      <TouchableOpacity onPress={() => handleBack()} style={{ marginVertical: 12 }}>
        <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
      </TouchableOpacity>
    </Container>
  )
}

const Container = styled.View`
  width: 100%;
  flex-direction: row;
`