import { Image } from 'expo-image';
import * as ExpoImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';

type ImagePickerViewerProps = {
  limit: number;
  onSelect: (imageUri: ExpoImagePicker.ImagePickerAsset[]) => void;
}

export function ImagePickerViewer({ limit, onSelect }: ImagePickerViewerProps) {
  const [images, setImage] = useState<ExpoImagePicker.ImagePickerAsset[]>([]);

  async function selectImage() {
    const permissionResult = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    let result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      base64: true,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      const base = result.assets[0];
      setImage([base]);
      onSelect(limit === 1
        ? [base]
        : result.assets
      );
    }
  }

  return (
    <TouchContainer onPress={async () => await selectImage()}>
      <ImageGrid>
        {images.length > 0 && <ImageBox source={images[0].uri}  contentFit="cover" />}
      </ImageGrid>
    </TouchContainer>
  )
}

const ImageBox = styled(Image)`
  position: absolute;
  inset: 0;
`

const ImageGrid = styled.View`
  width: 100%;
  height: 200px;
  position: relative;
`

const TouchContainer = styled.TouchableOpacity`
  width: 100%;
  min-height: 200px;
  border-color: ${({ theme }) => theme.colors.border};
  border-width: 1px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;
`