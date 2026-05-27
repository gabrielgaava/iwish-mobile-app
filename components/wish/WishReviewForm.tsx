import { CustomButton } from "@/components/buttons";
import { WishImagePicker } from "@/components/image-picker/wish-image-picker";
import { InputText } from "@/components/input";
import { UISwitch } from "@/components/ui/switch";
import { Txt } from "@/components/ui/text";
import i18n from "@/constants/region";
import { useTheme } from "@react-navigation/native";
import { Control } from "react-hook-form";
import styled from "styled-components/native";

export type WishFormData = {
  link: string;
  title: string;
  price: string;
  notes: string;
};

type WishReviewFormProps = {
  control: Control<WishFormData>;
  images: string[];
  isHighPriority: boolean;
  loading: boolean;
  headerTitle?: string;
  headerSubtitle?: string;
  saveLabel?: string;
  onAddImage: (uri: string) => void;
  onRemoveImage: (url: string) => void;
  onTogglePriority: (value: boolean) => void;
  onSubmit: () => void;
};

export function WishReviewForm({
  control,
  images,
  isHighPriority,
  loading,
  headerTitle,
  headerSubtitle,
  saveLabel,
  onAddImage,
  onRemoveImage,
  onTogglePriority,
  onSubmit,
}: WishReviewFormProps) {
  const { colors } = useTheme();

  const resolvedTitle = headerTitle ?? i18n.t("wish.create.detailsTitle");
  const resolvedSubtitle = headerSubtitle ?? i18n.t("wish.create.detailsSubtitle");
  const resolvedSaveLabel = saveLabel ?? i18n.t("wish.create.save");

  return (
    <>
      <Header>
        <Txt text={resolvedTitle} weight="bold" size={26} align="left" />
        <Txt
          text={resolvedSubtitle}
          color={colors.text70}
          style={{ marginTop: 8 }}
          size={14}
          align="left"
        />
      </Header>

      <FormContainer>
        <InputText
          control={control}
          label="Link/URL"
          name="link"
          rules={{ required: true }}
          leftIcon="link"
        />
        <InputText
          control={control}
          label={i18n.t("wish.create.titleLabel")}
          name="title"
          rules={{ required: true }}
          leftIcon="tag"
        />
        <InputText
          control={control}
          label={i18n.t("wish.create.priceLabel")}
          name="price"
          rules={{ required: true, isNumber: true }}
          leftIcon="dollar-sign"
        />
        <InputText
          control={control}
          label={i18n.t("wish.create.notesLabel")}
          name="notes"
          rules={{ required: false }}
          leftIcon="file-text"
        />

        <PriorityRow>
          <Txt
            text={i18n.t("wish.create.priority")}
            weight="semi"
            size={14}
            align="left"
          />
          <UISwitch
            value={isHighPriority}
            onValueChange={onTogglePriority}
            trackColor={{ false: colors.defaultBorder, true: colors.primary }}
          />
        </PriorityRow>

        <WishImagePicker
          images={images}
          onAdd={onAddImage}
          onRemove={onRemoveImage}
        />
      </FormContainer>

      <ButtonContainer>
        <CustomButton
          text={resolvedSaveLabel || ""}
          onPress={onSubmit}
          loading={loading}
        />
      </ButtonContainer>
    </>
  );
}

// ─── Styled Components ────────────────────────────────────────────────────────

const Header = styled.View`
  width: 100%;
`;

const FormContainer = styled.View`
  width: 100%;
  margin-top: 12px;
`;

const PriorityRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
  margin-bottom: 4px;
`;

const ButtonContainer = styled.View`
  width: 100%;
  margin-top: auto;
  padding-top: 24px;
`;
