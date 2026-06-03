import { images } from "@/constants/images";
import i18n from "@/constants/region";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import * as ExpoImagePicker from "expo-image-picker";
import { useCallback } from "react";
import { Alert } from "react-native";
import styled from "styled-components/native";

const AVATAR_SIZE = 100;
const EDIT_BUTTON_SIZE = 30;

type AvatarPickerProps = {
  uri?: string | null;
  size?: number;
  onSelect: (asset: ExpoImagePicker.ImagePickerAsset) => void;
};

export function AvatarPicker({ uri, size, onSelect }: AvatarPickerProps) {
  const handlePress = useCallback(async () => {
    const permission = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        i18n.t("wishlist.create.permissionTitle"),
        i18n.t("wishlist.create.permissionMessage")
      );
      return;
    }

    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      onSelect(result.assets[0]);
    }
  }, [onSelect]);

  return (
    <Container onPress={handlePress} activeOpacity={0.8} size={size || AVATAR_SIZE}>
      <StyledAvatar source={uri || images.avatarPlaceholder} size={size || AVATAR_SIZE}/>
      <EditBadge>
        <Feather name="upload" size={15} color="#fff" />
      </EditBadge>
    </Container>
  );
}

const Container = styled.TouchableOpacity<{size: number}>`
  position: relative;
  width: ${p => p.size}px;
  align-items: center;
  align-self: center;
`;

const StyledAvatar = styled(Image)<{size: number}>`
  width: ${p => p.size}px;
  height: ${p => p.size}px;
  border-radius: ${p => p.size / 2}px;
  border-width: 3px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const EditBadge = styled.View`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: ${EDIT_BUTTON_SIZE}px;
  height: ${EDIT_BUTTON_SIZE}px;
  border-radius: ${EDIT_BUTTON_SIZE / 2}px;
  background-color: ${({ theme }) => theme.colors.primary};
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.background};
`;
