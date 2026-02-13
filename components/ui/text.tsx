import { TextStyle } from "react-native";
import styled from "styled-components/native";

type InnerTextProps = {
  text?: string;
  weight?: 'light' | 'regular' | 'bold' | 'semi';
  size?: number;
  color?: string;
  style?: TextStyle;
  align?: 'left' | 'center' | 'right';
}

export const Txt = (props: InnerTextProps) => {

  return (
    <StyledText
      weight={props.weight}
      size={props.size}
      color={props.color}
      style={props.style}
    >
      {props.text}
    </StyledText>
  );

}

const fontMap = {
  light: 'Poppins_300Light',
  regular: 'Poppins_400Regular',
  semi: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
};


const StyledText = styled.Text<InnerTextProps>`
  font-family: ${({ weight = 'regular' }) => fontMap[weight]};
  margin: 0;
  padding: 0;
  font-size: ${({ size }) => size || 14}px;
  color: ${({ color, theme }) => color || theme.colors.text};
  text-align: ${({ align }) => align || "center"};
`;