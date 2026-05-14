import IconButton from "@/components/buttons/IconButton";
import { Txt } from "@/components/ui/text";
import { api, isOkay } from "@/lib/api";
import { Wishlist } from "@/types/User";
import { normalizeImageUri } from "@/utils/format";

import { LinkButton } from "@/components/buttons";
import { useTheme } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

//Icons
import EmptyState from "@/components/empty-state";
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function WishlistPage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { colors } = useTheme();

    const [isFetching, setIsFetching] = useState(true);
    const [isRefreshing, setRefreshing] = useState(false);
    const [data, setData] = useState<Wishlist | null>(null);

    const getWishlistDetails = useCallback(async (refresh: boolean = false) => {
        if (refresh) {
            setRefreshing(true);
        } else {
            setIsFetching(true);
        }

        const response = await api.get(`/wishlist/${id}`);

        if (!isOkay(response)) {
            Alert.alert(response.data.code, response.data.message);
        }

        setData(response.data);
        if (refresh) {
            setRefreshing(false);
        } else {
            setIsFetching(false);
        }
    }, [id]);

    useEffect(() => {
        getWishlistDetails();
    }, [getWishlistDetails]);

    function formatText(text: string | undefined) {
        if (text && text.length > 40) {
            return text.substring(0, 36) + "...";
        }

        return text;
    }

    function handleBack() {
        if (router.canGoBack()) {
            return router.back();
        }

        return router.replace("/profile");
    }

    if (isFetching) return <ActivityIndicator size="large" />

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
                <RefreshControl refreshing={isRefreshing} onRefresh={getWishlistDetails}>
                    <HeaderContainer>
                        <BackgroundImage
                            source={{ uri: normalizeImageUri(data?.cover_image) }}
                            resizeMode="cover"
                        />
                        <Overlay />
                        <Content>
                            <IconButton icon={<Feather name="arrow-left" size={22} color={colors.white} />} onPress={handleBack} />
                            <Txt text="Detalhes da Lista" color={colors.white} weight="bold" size={18} />
                            <IconButton icon={<MaterialIcons name="share" size={22} color={colors.white} />} onPress={() => { }} />
                        </Content>
                    </HeaderContainer>

                    <WishlistDetailsContainer>
                        <Row style={{ marginBottom: 8 }}>
                            <Txt text={data?.name} weight="bold" size={22} align="left" />
                            <Badge>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                                    <Ionicons name="gift" size={12} color={colors.primary} />
                                    <Txt text={`${data?.wishes.length} itens`} color={colors.primary} size={12} />
                                </View>
                            </Badge>
                        </Row>
                        <Txt text={data?.description} size={16} align="left" weight="semi" color={colors.text70} />
                    </WishlistDetailsContainer>

                    {data?.wishes.length === 0 && (
                        <EmptyState type="wish" showButton />
                    )}

                    {data && data?.wishes.length > 0 && (
                        <ItensGrid>
                            <Row>
                                <Txt text="Itens Desejados" weight="regular" size={18} align="left" />
                                <LinkButton text="Ordernar" onPress={() => { }} />
                            </Row>
                            {data.wishes.map((wish) => (
                                <WishContainer key={wish.id} onPress={() => { }}>
                                    {wish.images && (
                                        <WishImage source={{ uri: normalizeImageUri(wish.images[0].url) }} />
                                    )}
                                    <Txt text={formatText(wish.title)} align="left" />
                                    <Txt text={`R$ ${String(wish.price)}`} align="left" size={18} weight="semi" />
                                </WishContainer>
                            ))}
                        </ItensGrid>
                    )}
                </RefreshControl>
            </ScrollView>
        </SafeAreaView>
    )
}

export const HeaderContainer = styled.View`
  height: 260px;
  position: relative;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
`;

export const BackgroundImage = styled.Image`
  position: absolute;
  width: 100%;
  height: 100%;
`;

export const Content = styled.View`
  width: 100%;
  padding: 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  z-index: 2;
`;

export const Overlay = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
`;

const Badge = styled.View`
    padding: 4px 8px;
    background-color: #ffffff30;
    border-radius: 12px;
    background-color: ${({ theme }) => theme.colors.duotoneBackground};
    text-align: center;
    justify-content: center;
    align-items: center;
`;

const WishlistDetailsContainer = styled.View`
    margin-top: 16px;
    margin-bottom: 16px;
    justify-content: flex-start;
    align-items: flex-start;
    text-align: left;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 16px;
    border-bottom-width: 1px;
    border-color: #00000015;
`;

const Row = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

const ItensGrid = styled.View`
    flex-direction: row;
    flex-wrap: wrap; 
    padding-left: 20px;
    padding-right: 20px;
    gap: 12px;
`
const WishContainer = styled.TouchableOpacity`
    width: 48%;
    margin-bottom: 16px;
`

const WishImage = styled.Image`
    width: 100%;
    height: 169px;
    border-radius: 16px;
    margin-bottom: 6px;
`;
