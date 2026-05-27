import i18n from '@/constants/region';
import Feather from '@expo/vector-icons/Feather';
import { Image } from 'expo-image';
import * as ExpoImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

type ImagePickerViewerProps = {
  limit: number;
  onSelect: (imageUri: ExpoImagePicker.ImagePickerAsset[]) => void;
  initialImage?: string;
}

export default function WishlistImagePicker({ limit, onSelect, initialImage }: ImagePickerViewerProps) {
  const [images, setImage] = useState<ExpoImagePicker.ImagePickerAsset[]>([]);
  const theme = useTheme();

  const selectImage = useCallback(async () => {
    const permissionResult = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        i18n.t('wishlist.create.permissionTitle'),
        i18n.t('wishlist.create.permissionMessage')
      );
      return;
    }

    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      base64: true,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const base = result.assets[0];
      setImage([base]);
      onSelect(limit === 1 ? [base] : result.assets);
    }
  }, [limit, onSelect]);

  const previewUri = images.length > 0 ? images[0].uri : initialImage;

  return (
    <TouchContainer onPress={selectImage}>
      {previewUri ? (
        <ImageBox source={previewUri} contentFit="cover" />
      ) : (
        <Placeholder>
          <IconWrapper>
            <Feather name="camera" size={28} color={theme.colors.primary} />
          </IconWrapper>
          <PlaceholderTitle>{i18n.t('wishlist.coverPhoto')}</PlaceholderTitle>
          <PlaceholderSubtitle>{i18n.t('wishlist.tapToSelect')}</PlaceholderSubtitle>
        </Placeholder>
      )}
    </TouchContainer>
  );
}

const TouchContainer = styled.TouchableOpacity`
  width: 100%;
  min-height: 160px;
  border-color: ${({ theme }) => theme.colors.tint};
  border-width: 1.5px;
  border-radius: 12px;
  border-style: dashed;
  overflow: hidden;
  margin-bottom: 12px;
`;

const ImageBox = styled(Image)`
  position: absolute;
  inset: 0;
`;

const Placeholder = styled.View`
  flex: 1;
  min-height: 160px;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

const IconWrapper = styled.View`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: ${({ theme }) => theme.colors.duotoneBackground};
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
`;

const PlaceholderTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

const PlaceholderSubtitle = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text50};
  text-align: center;
`;
