import { useTheme } from "@react-navigation/native";
import { ColorValue } from 'react-native';
import styled from "styled-components/native";
import { Button, ButtonText, Gradient } from "./styles";
;

type ButtonProps = {
  onPress: () => void,
  text: string,
  disabled?: boolean,
  loading?: boolean,
  duotone?: boolean,
}

export default function ActionButton(props: ButtonProps) {

  const theme = useTheme();

  const bgColor:[ColorValue, ColorValue, ...ColorValue[]] = props.duotone 
  ? [theme.colors.duotoneBackground, theme.colors.duotoneBackground]
  :  theme.colors.primaryGradient

  const textColor = props.duotone 
  ?  theme.colors.primary
  : theme.colors.white;

  return (
    <Button 
      onPress={props.onPress} 
      disabled={props.disabled || props.loading} 
    >
      <Gradient 
        colors={bgColor}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {props.loading && <Loader color={textColor} size="small" />}
        {!props.loading && <ButtonText color={textColor} text={props.text} weight="semi" />}
      </Gradient>
    </Button>
  )
}

const Loader = styled.ActivityIndicator`
  height: 100%;
`;