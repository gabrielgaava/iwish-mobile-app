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
}

export const Column = styled.View<ContainerProps>`
  flex: ${({ height }) => (height ? "0" : "1")};
  flex-direction: ${({ isReverse }) => (isReverse ? "column-reverse" : "column")};
  width: ${({ width }) => width ?? "100%"};
  height: ${({ height }) => height ?? "auto"};
  justify-content: ${props => !!props.justify ? props.justify : "center"};
  align-items: ${props => !!props.align ? props.align : "center"};
`;

export const Row = styled.View<ContainerProps>`
  flex: ${({ width }) => (width ? "0" : "1")};
  flex-direction: ${({ isReverse }) => isReverse ? "row-reverse" : "row"};
  width: ${({ width }) => width ?? "auto"};
  height: ${({ height }) => height ?? "100%"};
  justify-content: ${props => !!props.justify ? props.justify : "center"};
  align-items: ${props => !!props.align ? props.align : "center"};
`;

export const Container = (props: ContainerProps) => {

  if(props.type === "column") return (
    <Column {...props}>
      {props.children}
    </Column>
  );

  return (
    <Row {...props}>
      {props.children}
    </Row>
  );


}