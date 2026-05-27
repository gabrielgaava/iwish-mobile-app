import { Txt } from "@/components/ui/text";
import { FeatherIconName } from "@/types/Ui";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { Pressable } from "react-native";
import styled, { css } from "styled-components/native";

type Props = {
  selected: boolean;
  title: string;
  description: string;
  icon: FeatherIconName;
  onPress: () => void;
};


export function SelectableOption({
  selected,
  title,
  description,
  icon,
  onPress,
}: Props) {

  const { colors } = useTheme();

  return (
    <Card selected={selected} onPress={onPress}>
      <Left>
        <IconWrapper>
          <Feather name={icon} size={20} color={selected ? colors.primary : colors.icon} />
        </IconWrapper>
        <TextGroup>
          <Txt text={title} weight="semi" align="left"/>
          <Description text={description} align="left"/>
        </TextGroup>
      </Left>
      <RadioWrapper>
        {!selected && <Feather name="circle" size={22} color={colors.primary}/>}
        {selected && <Ionicons name="checkmark-circle" size={22} color={colors.primary}/>}
      </RadioWrapper>
    </Card>
  );
}

const Card = styled(Pressable)<{ selected: boolean }>`
  padding: 16px 32px 16px 16px;
  border-radius: 14px;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
  border-width: 1px;
  flex: 1;

  ${({ selected, theme }) =>
    selected
      ? css`
          background-color: ${theme.colors.duotoneBackground};
          border-color: ${theme.colors.primary};
        `
      : css`
          background-color: ${theme.colors.background};
          border-color: ${theme.colors.border};
        `}
`;

const Left = styled.View`
  flex-direction: column;
  align-items: flex-start;
`;

const IconWrapper = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  align-items: flex-start;
  justify-content: center;
`;

const TextGroup = styled.View`
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const Description = styled(Txt)`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text70};
`;

const Radio = styled.View<{ selected: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.primary};
  align-items: flex-start;
  justify-content: flex-start;

  ${({ selected, theme }) =>
    selected &&
    css`
      background-color: ${theme.colors.primary};
    `}
`;

const RadioWrapper = styled.View`
  height: 100%;
`;