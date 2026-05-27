import { Txt } from "@/components/ui/text";
import i18n from "@/constants/region";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useMemo } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

export default function CreatePage() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.darkBackground }}>
      <Page style={{ padding: 24, backgroundColor: colors.darkBackground }}>
        <View style={{ marginTop: 36, marginBottom: 36, paddingHorizontal: 12 }}>
          <Octicons name="sparkles-fill" size={36} color={colors.primary} style={{ marginBottom: 18 }}/>
          <Txt text={i18n.t("createPage.title")} size={24} weight="bold" align="left" />
          <Txt text={i18n.t("createPage.subtitle")} size={14} align="left" />
        </View>
        <View style={{ gap: 12 }}>
          <CreateOption type="wish" />
          <CreateOption type="wishlist" />
          <CreateOption type="event" />
        </View>
      </Page>
    </SafeAreaView>
  );
}

function CreateOption({ type }: { type: "wish" | "wishlist"| "event" }) {
  const { colors } = useTheme();

  const titleMap = useMemo(() => ({
    wish: i18n.t("createPage.wish.title"),
    wishlist: i18n.t("createPage.wishlist.title"),
    event: i18n.t("createPage.event.title"),
  }), []);

  const descriptionMap = useMemo(() => ({
    wish: i18n.t("createPage.wish.description"),
    wishlist: i18n.t("createPage.wishlist.description"),
    event: i18n.t("createPage.event.description"),
  }), []);

  const iconMap = useMemo(() => ({
    wish: <AntDesign name="plus-circle" size={24} color={colors.primary} />,
    wishlist: <Feather name="layers" size={24} color={colors.text70} />,
    event: <Feather name="calendar" size={24} color={colors.text50} />
  }), [colors]);

  const handlePress = useCallback(() => {
    if (type === "wish") {
      router.push("/(protected)/wish/create");
    } else if (type === "wishlist") {
      router.push("/(protected)/wishlist/create");
    }
  }, [type]);

  return (
    <OptionCard onPress={handlePress} activeOpacity={0.8} disabled={type === "event"}>
      {type === "event" &&
      <SoonBadge>
        <Txt text={i18n.t("createPage.soonBadge")} size={12}/>
      </SoonBadge>
      }
      <OptionCardRow>
        <OptionIcon>
          {iconMap[type]}
        </OptionIcon>
        <View>
          <Txt text={titleMap[type]} align="left" weight="bold" size={16} />
          <Txt text={descriptionMap[type]} align="left" />
        </View>
      </OptionCardRow>
      <MaterialIcons name="chevron-right" size={24} color={colors.text50} />
    </OptionCard>
  );
}

const Page = styled.View`
  flex: 1;
  width: 100%;
  background: ${({ theme }) => theme.colors.background};
`;

const OptionCard = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: ${props => props.theme.colors.background};
  border: solid 1px ${props => props.theme.colors.border30};
  border-radius: 8px;
  height: 82px;
  padding: 8px 16px;
  opacity: ${p => p.disabled ? 0.4 : 1};
`;

const OptionCardRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const OptionIcon = styled.View`
  justify-content: center;
  align-items: center;
  background: ${props => props.theme.colors.duotoneBackground};
  padding: 10px;
  border-radius: 8px;
`;

export const SoonBadge = styled.View`
  background: ${p => p.theme.colors.altBackground};
  padding: 4px 8px;
  border-radius: 6px;
  position: absolute;
  right: 0;
  top: 0;
`;