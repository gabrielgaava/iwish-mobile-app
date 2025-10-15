import styled from "styled-components/native";

type TextProps = {
  text?: string;
  weight?: 'light' | 'regular' | 'bold';
  size?: number;
  color?: string;
  style?: object;
}

export const Txt = (props: TextProps) => {

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


const StyledText = styled.Text<TextProps>`
    font-family: ${({ weight }) =>
    weight === 'light' ? 'Poppins_300Light' :
      weight === 'bold' ? 'Poppins_700Bold' : 'Poppins_400Regular'};

    line-height: ${({ size }) => size || 14}px;
    font-size: ${({ size }) => size || 14}px;
    color: ${({ color, theme }) => color || theme.colors.text};
`;