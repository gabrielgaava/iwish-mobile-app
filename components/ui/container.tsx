import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { styled } from "styled-components/native";

interface ContainerProps {
  type: "row" | "column";
  isReverse?: boolean;
  width?: number | string;
  height?: number | string;
  children: ReactNode;
  justify?: ViewStyle['justifyContent'];
  align?: ViewStyle['alignItems'];
  style?: StyleProp<ViewStyle>;
  flex?: number;
  gap?: number;
  stretch?: boolean; // 👈 ocupa 100% da largura
}

const BaseContainer = styled.View<ContainerProps>`
  flex-direction: ${({ type, isReverse }) =>
    type === "row"
      ? isReverse ? "row-reverse" : "row"
      : isReverse ? "column-reverse" : "column"};

  ${({ flex }) => flex ? `flex: ${flex};` : ""}
  ${({ width }) => width ? `width: ${typeof width === 'number' ? `${width}px` : width};` : ""}
  ${({ height }) => height ? `height: ${typeof height === 'number' ? `${height}px` : height};` : ""}

  ${({ stretch }) => stretch ? `width: 100%;` : ""}

  justify-content: ${({ justify }) => justify ?? "center"};
  align-items: ${({ align }) => align ?? "center"};
  gap: ${({ gap }) => gap ?? 0};
`;

export const Container = ({ type, children, ...props }: ContainerProps) => {
  return (
    <BaseContainer type={type} {...props}>
      {children}
    </BaseContainer>
  );
};
