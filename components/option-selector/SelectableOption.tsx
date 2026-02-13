import { Txt } from "@/components/ui/text";
import React from "react";
import { Pressable } from "react-native";
import styled, { css } from "styled-components/native";

type Props = {
  selected: boolean;
  title: string;
  description: string;
  icon: React.ReactNode;
  onPress: () => void;
};

export function SelectableOption({
  selected,
  title,
  description,
  icon,
  onPress,
}: Props) {
  return (
    <Card selected={selected} onPress={onPress}>
      <Left>
        <IconWrapper>{icon}</IconWrapper>
        <TextGroup>
          <Txt text={title} weight="semi" />
          <Description text={description} />
        </TextGroup>
      </Left>

      <Radio selected={selected} />
    </Card>
  );
}

const Card = styled(Pressable)<{ selected: boolean }>`
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  border-width: 1px;

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
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const IconWrapper = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  align-items: center;
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
  align-items: center;
  justify-content: center;

  ${({ selected, theme }) =>
    selected &&
    css`
      background-color: ${theme.colors.primary};
    `}
`;
