import { useTheme } from "@react-navigation/native";
import { ReactNode } from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { Txt } from "../ui/text";

type CustomButtonProps = {
  onPress: () => void;
  text: string;
  variant?: "solid" | "outline" | "glass";
  color?: string;
  radius?: number;
  height?: number;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
};

export default function CustomButton({
  onPress,
  text,
  variant = "solid",
  color,
  radius = 10,
  height = 50,
  loading = false,
  disabled = false,
  icon,
  iconPosition = "left",
}: CustomButtonProps) {
  const { colors } = useTheme();

  const resolvedColor = color ?? colors.primary;
  const textColor = variant === "solid" ? colors.white : resolvedColor;
  const isDisabled = disabled || loading;

  return (
    <Container
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      variant={variant}
      resolvedColor={resolvedColor}
      radius={radius}
      btnHeight={height}
      isDisabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Row>
          {icon && iconPosition === "left" && icon}
          {text && <Txt text={text} color={textColor} size={16} weight="semi" />}
          {icon && iconPosition === "right" && icon}
        </Row>
      )}
    </Container>
  );
}

type ContainerProps = {
  variant: "solid" | "outline" | "glass";
  resolvedColor: string;
  radius: number;
  btnHeight: number;
  isDisabled: boolean;
};

const Container = styled.TouchableOpacity<ContainerProps>`
  width: 100%;
  height: ${({ btnHeight }) => btnHeight}px;
  border-radius: ${({ radius }) => radius}px;
  background-color: ${({ variant, resolvedColor }) => {
    if (variant === "solid") return resolvedColor;
    if (variant === "glass") return `${resolvedColor}20`;
    return "transparent";
  }};
  border-width: ${({ variant }) => (variant === "outline" || variant === "glass" ? 1 : 0)}px;
  border-color: ${({ variant, resolvedColor }) =>
    variant === "glass" ? `${resolvedColor}50` : resolvedColor};
  justify-content: center;
  align-items: center;
  opacity: ${({ isDisabled }) => (isDisabled ? 0.5 : 1)};
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;
