import { TextStyle } from "react-native";
import styled from "styled-components/native";

type InnerTextProps = {
  text?: string;
  weight?: 'light' | 'regular' | 'bold' | 'semi';
  size?: number;
  color?: string;
  style?: TextStyle;
  align?: 'left' | 'center' | 'right';
  maxLength?: number;
}

export const Txt = (props: InnerTextProps) => {

  const finalText = props.maxLength && props.text 
  && props.text?.length > props.maxLength
    ? props.text?.slice(0, props.maxLength) + "..."
    : props.text;

  return (
    <StyledText
      weight={props.weight}
      size={props.size}
      color={props.color}
      style={props.style}
      align={props.align}
    >
      {finalText}
    </StyledText>
  );

}

const fontMap = {
  light: 'PlusJakartaSans_300Light',
  regular: 'PlusJakartaSans_400Regular',
  semi: 'PlusJakartaSans_500Medium',
  bold: 'PlusJakartaSans_700Bold',
};

const StyledText = styled.Text<InnerTextProps>`
  font-family: ${({ weight = 'regular' }) => fontMap[weight]};
  margin: 0;
  padding: 0;
  font-size: ${({ size }) => size || 14}px;
  color: ${({ color, theme }) => color || theme.colors.text};
  text-align: ${({ align }) => align || "center"};
`;