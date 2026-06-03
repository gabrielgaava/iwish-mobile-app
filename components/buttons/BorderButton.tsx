import { useTheme } from "@react-navigation/native";
import { ReactNode } from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { Txt } from "../ui/text";

type ButtonProps = {
  onPress: () => void,
  text: string,
  disabled?: boolean,
  loading?: boolean,
  icon?: ReactNode,
  color?: string,
  weight?: "regular" | "semi" | "bold",
  height?: number;
}

export default function BorderButton(props: ButtonProps) {
  const theme = useTheme();

  const finalHeight = props.height ? props.height : 60;

  return (
    <Button 
      height={finalHeight}
      onPress={props.onPress} 
      disabled={props.disabled || props.loading} 
      activeOpacity={0.8}
    >
        {props.loading && <ActivityIndicator color={theme.colors.text} />}
        {!props.loading && 
        <Group>
          {!!props.icon && props.icon}
          <Txt 
            text={props.text} 
            color={props.color || theme.colors.text} 
            size={16} 
            weight={props.weight || "semi"} 
          />
        </Group>
        }
    </Button>
  )
}

const Button = styled.TouchableOpacity<{height: number}>`
  flex: 1;
  width: 100%;
  height: ${p => p.height}px;
  min-height: ${p => p.height}px;
  border-radius: 12px;
  overflow: hidden;
  padding-left: 12px;
  padding-right: 12px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
  justify-content: center;
  align-items: center;
`

const Group = styled.View`
  flex: 1;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
`

