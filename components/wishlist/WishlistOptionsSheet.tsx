import UIBottomSheet from "@/components/bottom-sheet";
import { Txt } from "@/components/ui/text";
import i18n from "@/constants/region";
import { FeatherIconName } from "@/types/Ui";
import Feather from "@expo/vector-icons/Feather";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useTheme } from "@react-navigation/native";
import { RefObject, useCallback } from "react";
import { Alert, View } from "react-native";
import styled, { css } from "styled-components/native";

type Props = {
  sheetRef: RefObject<BottomSheetModal|null>;
  onShare: () => void;
  onEdit: () => void;
  onAddItem: () => void;
  onDelete: () => void;
};

export default function WishlistOptionsSheet({
  sheetRef,
  onShare,
  onEdit,
  onAddItem,
  onDelete,
}: Props) {
  const { colors } = useTheme();

  function dismiss() {
    sheetRef.current?.dismiss();
  }

  const handleDeletePress = useCallback(() => {
    dismiss();
    Alert.alert(
      i18n.t("wishlist.options.deleteConfirm.title"),
      i18n.t("wishlist.options.deleteConfirm.message"),
      [
        { text: i18n.t("wishlist.options.deleteConfirm.cancel"), style: "cancel" },
        { text: i18n.t("wishlist.options.deleteConfirm.confirm"), style: "destructive", onPress: onDelete },
      ]
    );
  }, [onDelete]);

  return (
    <UIBottomSheet
      ref={sheetRef}
      snapPoints={["50%"]}
      contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 18 }}
    >
      <Txt text={i18n.t("wishlist.options.label").toUpperCase()} size={12} weight="regular" color={colors.text70} />
      <Txt text={i18n.t("wishlist.options.title")} size={16} weight="bold" color={colors.text}/>
      <OptionsButtons>
        <OptionButton
          icon="share-2"
          text={i18n.t("wishlist.options.share")}
          divisor={false}
          onPress={() => { dismiss(); onShare(); }}
        />
        <OptionButton
          icon="edit"
          text={i18n.t("wishlist.options.editDetails")}
          onPress={() => { dismiss(); onEdit(); }}
        />
        <OptionButton
          icon="plus-circle"
          text={i18n.t("wishlist.options.addItems")}
          onPress={() => { dismiss(); onAddItem(); }}
        />
        <OptionButton
          icon="trash-2"
          text={i18n.t("wishlist.options.deleteList")}
          danger
          onPress={handleDeletePress}
        />
      </OptionsButtons>
    </UIBottomSheet>
  );
}

type OptionButtonProps = {
  onPress: () => void;
  icon: FeatherIconName;
  text: string;
  danger?: boolean;
  divisor?: boolean;
};

function OptionButton({
  icon,
  text,
  onPress,
  danger = false,
  divisor = true,
}: OptionButtonProps) {
  const { colors } = useTheme();
  const iconColor = danger ? colors.errorBgSolid : colors.primary;

  return (
    <TouchOptionButton onPress={onPress} line={divisor}>
      <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
        <OptionsIcon>
          <Feather name={icon} size={14} color={iconColor} />
        </OptionsIcon>
        <Txt
          text={text}
          size={15}
          color={danger ? colors.errorText : colors.text}
        />
      </View>
      <Feather name="chevron-right" size={18} color={iconColor} />
    </TouchOptionButton>
  );
}

const OptionsButtons = styled.View`
  margin-top: 16px;
`;

const OptionsIcon = styled.View`
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  background: ${(p) => p.theme.colors.border30};
  padding: 8px;
`;

const TouchOptionButton = styled.TouchableOpacity<{ line: boolean }>`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0px;
  ${({ line, theme }) =>
    line &&
    css`
      border-top-width: 1px;
      border-top-color: ${theme.colors.border};
    `}
`;
