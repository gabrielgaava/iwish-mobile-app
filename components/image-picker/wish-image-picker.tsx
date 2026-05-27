import { Txt } from "@/components/ui/text";
import i18n from "@/constants/region";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import * as ExpoImagePicker from "expo-image-picker";
import { useCallback, useMemo } from "react";
import { Alert, Dimensions } from "react-native";
import styled, { useTheme } from "styled-components/native";

const MAX_IMAGES = 6;

type WishImagePickerProps = {
  images: string[];
  onAdd: (uri: string) => void;
  onRemove: (uri: string) => void;
};

export function WishImagePicker({ images, onAdd, onRemove }: WishImagePickerProps) {
  const { colors } = useTheme();

  const canAddMore = useMemo(
    () => images.length < MAX_IMAGES, 
    [images]
  );

  const counterText = useMemo(
    () => `${images.length}/${MAX_IMAGES} ${i18n.t("wish.create.imagesOf")}`,
    [images]
  );

  const imageSize = useMemo(() => {
    const screenW = Dimensions.get('window').width;
    const spaces = ((2 * 8) + 48 + 1); // Gap + Padding
    return (screenW - spaces) / 3
  }, [])

  const pickImage = useCallback(async () => {
    const permissionResult = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        i18n.t("wish.create.permissionTitle"),
        i18n.t("wish.create.permissionMessage")
      );
      return;
    }

    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      base64: true,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onAdd(result.assets[0].uri);
    }
  }, [onAdd]);

  const handleRemove = useCallback(
    (uri: string) => () => onRemove(uri),
    [onRemove]
  );

  return (
    <Container>
      <HeaderRow>
        <Txt
          text={i18n.t("wish.create.pics")}
          weight="semi"
          size={14}
          align="left"
        />
        <Txt
          text={counterText}
          size={12}
          color={colors.text70}
          weight="semi"
          align="right"
        />
      </HeaderRow>

      <ImagesGrid>
        {images.map((uri) => (
          <ImageItem key={uri} size={imageSize}>
            <StyledImage
              source={uri}
              contentFit="cover"
              size={imageSize}
            />
            <RemoveButton onPress={handleRemove(uri)}>
              <Feather name="x" size={22} color={colors.white} />
            </RemoveButton>
          </ImageItem>
        ))}

        {canAddMore && (
          <AddButton onPress={pickImage} size={imageSize}>
            <AntDesign name="plus" size={24} color={colors.text50} />
            <Txt
              text={i18n.t("wish.create.addImage")}
              size={11}
              color={colors.text50}
              weight="semi"
            />
          </AddButton>
        )}
      </ImagesGrid>
    </Container>
  );
}

const Container = styled.View`
  width: 100%;
  margin-top: 12px;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ImagesGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

const ImageItem = styled.View<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 10px;
  overflow: visible;
`;

const StyledImage = styled(Image)<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 10px;
  border: solid 1px ${p => p.theme.colors.border30};
`;

const RemoveButton = styled.TouchableOpacity`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: ${({ theme }) => theme.colors.errorText};
  border-radius: 12px;
  z-index: 10;
`;

const AddButton = styled.TouchableOpacity<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 10px;
  border-width: 1.5px;
  border-style: dashed;
  border-color: ${({ theme }) => theme.colors.text50};
  align-items: center;
  justify-content: center;
  gap: 4px;
`;
