import { api, isOkay } from "@/lib/api";
import { Wish, Wishlist } from "@/types/User";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

type Params = {
  id: string;
  from?: string;
  forceRefresh?: string;
};

export function useWishlistDetail({ id, from, forceRefresh }: Params) {
  const [data, setData] = useState<Wishlist | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);

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

    if (forceRefresh === "true") {
      return router.replace({
        pathname: "/wishlist/[id]",
        params: { id },
      });
    }
  }, [id, forceRefresh]);

  useEffect(() => {
    getWishlistDetails();
  }, [getWishlistDetails]);

  const handleBack = useCallback(() => {
    const fallbackRoute = "/profile";
    const backRoute =
      from && !from.startsWith("/wishlist/") ? from : fallbackRoute;
    return router.replace(backRoute as Parameters<typeof router.replace>[0]);
  }, [from]);

  const deleteWish = useCallback(async (wishId: string) => {
    setIsUpdating(true);
    const response = await api.delete("/wish/" + wishId);

    if (response.status !== 204) {
      setIsUpdating(false);
      Alert.alert("Erro ao deletar. Tente novamente");
      return;
    }

    setSelectedWish(null);
    setIsUpdating(false);
    getWishlistDetails();
  }, [getWishlistDetails]);

  const markPurchased = useCallback(async (wish: Wish, purchased: boolean) => {
    setIsUpdating(true);
    const response = await api.patch(`/wish/${wish.id}`, { purchased });

    if (response.status !== 200) {
      setIsUpdating(false);
      return;
    }

    setData((prev) => {
      if (!prev) return prev;
      const updatedWish = { ...response.data, images: wish.images };
      return {
        ...prev,
        wishes: prev.wishes.map((w) => (w.id === wish.id ? updatedWish : w)),
      };
    });
    setSelectedWish((prev) =>
      prev?.id === wish.id ? { ...response.data, images: prev.images } : prev
    );
    setIsUpdating(false);
  }, []);

  const deleteWishlist = useCallback(async (wishlistId: string) => {
    setIsFetching(true);
    const response = await api.delete("/wishlist/" + wishlistId);

    if (response.status !== 204) {
      setIsFetching(false);
      return;
    }

    setIsFetching(false);
    router.replace({
      pathname: "/(protected)/(tabs)/profile",
      params: { refresh: "1" },
    });
  }, []);

  return {
    data,
    isFetching,
    isRefreshing,
    isUpdating,
    selectedWish,
    setSelectedWish,
    getWishlistDetails,
    deleteWish,
    markPurchased,
    deleteWishlist,
    handleBack,
  };
}
