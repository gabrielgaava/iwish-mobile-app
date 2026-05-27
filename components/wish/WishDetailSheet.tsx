import UIBottomSheet from "@/components/bottom-sheet";
import { BorderButton, CustomButton } from "@/components/buttons";
import { Txt } from "@/components/ui/text";
import i18n from "@/constants/region";
import { Wish } from "@/types/User";
import { toPrice } from "@/utils/format";
import Feather from "@expo/vector-icons/Feather";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useTheme } from "@react-navigation/native";
import { Image } from "expo-image";
import { RefObject } from "react";
import { Linking } from "react-native";
import styled from "styled-components/native";

type Props = {
  sheetRef: RefObject<BottomSheetModal|null>;
  wish: Wish | null;
  isOwner: boolean;
  isUpdating: boolean;
  userId?: string;
  onDelete: (wishId: string) => void;
  onMarkPurchased: (wish: Wish, purchased: boolean) => void;
  onEdit: (wish: Wish) => void;
};

export default function WishDetailSheet({
  sheetRef,
  wish,
  isOwner,
  isUpdating,
  userId,
  onDelete,
  onMarkPurchased,
  onEdit,
}: Props) {
  const { colors } = useTheme();

  function handleDelete() {
    if (!wish) return;
    sheetRef.current?.dismiss();
    onDelete(wish.id);
  }

  function handleEdit() {
    if (!wish) return;
    sheetRef.current?.dismiss();
    onEdit(wish);
  }

  function handleVisitWebsite() {
    if (wish?.link) Linking.openURL(wish.link);
  }

  return (
    <UIBottomSheet
      ref={sheetRef}
      snapPoints={["40%"]}
      contentContainerStyle={{ padding: 18 }}
    >
      {wish && (
        <ModalRow>
          <ModalImage source={wish.images?.[0]?.url} />
          <ModalTextColumn>
            <Txt
              text={wish.title}
              align="left"
              maxLength={80}
              size={18}
              style={{ width: "100%" }}
            />
            <Txt text={toPrice(wish.price)} />
            <Txt text={wish.notes} weight="bold" />
          </ModalTextColumn>
        </ModalRow>
      )}

      {wish && !isOwner && (
        <ModalContextAction>
          {!wish.was_purchased && (
            <CustomButton
              loading={isUpdating}
              text={i18n.get("wish.actions.markAsPurchased")}
              onPress={() => onMarkPurchased(wish, true)}
            />
          )}
          {wish.purchased_by === userId && (
            <CustomButton
              loading={isUpdating}
              text={i18n.get("wish.actions.markAsUnpurchased")}
              onPress={() => onMarkPurchased(wish, false)}
            />
          )}
          <BorderButton
            text={i18n.get("wish.actions.visit")}
            onPress={handleVisitWebsite}
          />
        </ModalContextAction>
      )}

      {wish && isOwner && (
        <ModalContextAction>
          <CustomButton
            text={i18n.get("actions.edit")}
            onPress={handleEdit}
            icon={<Feather name="edit" color={colors.white} />}
          />
          <CustomButton
            variant="outline"
            text={i18n.get("actions.delete")}
            onPress={handleDelete}
            icon={<Feather name="trash" color={colors.errorText} />}
            color={colors.errorText}
            loading={isUpdating}
          />
        </ModalContextAction>
      )}
    </UIBottomSheet>
  );
}

const ModalRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  width: 100%;
  border-bottom-width: 1px;
  border-bottom-color: ${(p) => p.theme.colors.border};
  padding-bottom: 24px;
  margin-bottom: 16px;
`;

const ModalImage = styled(Image)`
  width: 100px;
  height: 100px;
  border-radius: 12px;
`;

const ModalTextColumn = styled.View`
  flex: 1;
  min-width: 0px;
  align-items: flex-start;
`;

const ModalContextAction = styled.View`
  gap: 10px;
`;
