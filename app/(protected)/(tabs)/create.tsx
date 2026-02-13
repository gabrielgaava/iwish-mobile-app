import { ActionButton } from "@/components/buttons";
import { ImagePickerViewer } from "@/components/image-picker";
import { InputText } from "@/components/input";
import { OptionSelector } from "@/components/option-selector/OptionSelector";
import { Txt } from "@/components/ui/text";
import { api } from "@/lib/api";
import Feather from "@expo/vector-icons/Feather";
import { useTheme } from "@react-navigation/native";
import * as ExpoImagePicker from 'expo-image-picker';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";
import styled from "styled-components/native";

export default function CreatePage() {
  const [image, setImage] = useState<ExpoImagePicker.ImagePickerAsset>();
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const { colors } = useTheme();

  const { control, handleSubmit } = useForm({
      defaultValues: {
        name: "",
        description: "",
      },
  });

  const visibilityOptions = [
    {
      value: "public",
      title: "Publica",
      description: "Qualquer pessoa pode ver sua lista.",
      icon: <Feather name="globe" size={20} color={colors.icon} />
    },
    {
      value: "private",
      title: "Privada",
      description: "Apenas você pode ver sua lista.",
      icon: <Feather name="lock" size={20} color={colors.icon} />
    }
  ];

  function handleImageChange(listImages: ExpoImagePicker.ImagePickerAsset[]) {
    console.log(listImages[0]);
    setImage(listImages[0])
  } 

  async function createWishlist(data: any) {
    const payload = {
      ...data,
      isPublic,
      coverImage: image?.base64
    }
    console.log(payload);
    const response = await api.post("/wishlist", payload);

    if(response.status !== 200){
      Alert.alert("Error on create the wishlist");
      console.log(response.data);
    }
  }

  return (
    <Page style={{ padding: 24, backgroundColor: colors.background }}>
      <FormContainer>
        <Txt text="Create Wishlist" size={18} />
        <ImagePickerViewer limit={1} onSelect={handleImageChange}/>
        <InputText control={control} label="Name" name="name" rules={{required: true}} />
        <InputText control={control} label="Description" name="description" rules={{required: true}} />
        <OptionSelector 
          options={visibilityOptions} 
          onValueChange={(value: string) => setIsPublic(value === "public")} 
        />
      </FormContainer>
      <ButtonContainer>
        <ActionButton text="Criar" onPress={handleSubmit(createWishlist)}/>
      </ButtonContainer>
    </Page>
  )
}

const Page = styled.View`
  flex: 1;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  background: ${({theme}) => theme.colors.background};
`

const FormContainer = styled.View`
  flex: 1;
`;

const ButtonContainer = styled.View``