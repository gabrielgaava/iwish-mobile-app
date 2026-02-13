import { LinkButton } from "@/components/buttons";
import { Txt } from "@/components/ui/text";
import { api, isOkay } from "@/lib/api";
import { Wishlist } from "@/types/User";
import { normalizeImageUri } from "@/utils/format";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WishlistPage() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const [isFetching, setIsFetching] = useState(true);
    const [isRefreshing, setRefreshing] = useState(false);
    const [data, setData] = useState<Wishlist>({} as Wishlist);

    async function getWishlistDetails(refresh: boolean = false) {
        refresh ? setRefreshing(true) : setIsFetching(true);
        const response = await api.get(`/wishlist/${id}`);
        
        if(!isOkay(response)) {
            Alert.alert(response.data.code, response.data.message);
        }

        setData(response.data);
        refresh ? setRefreshing(false) : setIsFetching(false);
    }

    useEffect(() => {
        getWishlistDetails();
    }, [])

    if(isFetching) return <ActivityIndicator size="large" />

    return (
        <SafeAreaView style={{flex: 1}}>
            <ScrollView style={{flex: 1}}>
                <RefreshControl refreshing={isRefreshing} onRefresh={getWishlistDetails}>
                    <View>
                        <Image source={normalizeImageUri(data.cover_image)} style={{ flex: 1, maxHeight: 200 }}/>
                        <Txt text={data.name} weight="bold" size={20}/>
                        <Txt text={data.description} />
                        <LinkButton text="Voltar" onPress={() => router.back()}/>
                    </View>

                    {data.wishes.length === 0 && (
                        <View style={{ marginTop: 30 }}>
                            <Txt text="Sem desejos por enqunato, que tal adicionar alguns ?" />
                        </View>
                    )}

                    {data.wishes.length > 0 && (
                        <View>
                            {data.wishes.map((wish) => (
                                <View key={wish.id}>
                                    {wish.images && (
                                        <Image source={normalizeImageUri(wish.images[0].url)} style={{ width: 50, height: 50 }} />
                                    )}
                                    <Txt text={wish.title} />
                                    <Txt text={String(wish.price)} />
                                </View>
                            ))}
                        </View>
                    )}
                </RefreshControl>
            </ScrollView>
        </SafeAreaView>
    )
}