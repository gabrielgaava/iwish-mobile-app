import { UISwitch } from "@/components/ui/switch";
import { TabScrollView } from "@/components/ui/tab-scroll-view";
import { Txt } from "@/components/ui/text";
import { images } from "@/constants/images";
import { useAppTheme } from "@/context/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { normalizeImageUri } from "@/utils/format";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTheme } from "@react-navigation/native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ReactNode } from "react";
import { Linking, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

// ─── Row item ────────────────────────────────────────────────────────────────

type SettingRowProps = {
  icon: ReactNode;
  label: string;
  onPress?: () => void;
  rightLabel?: string;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
  isLast?: boolean;
};

function SettingRow({
  icon,
  label,
  onPress,
  rightLabel,
  toggle,
  toggleValue,
  onToggle,
  isLast,
}: SettingRowProps) {
  const { colors } = useTheme();

  return (
    <RowContainer onPress={!toggle ? onPress : undefined} activeOpacity={0.7} isLast={!!isLast}>
      <RowLeft>
        <IconBox>{icon}</IconBox>
        <Txt text={label} align="left" size={15} />
      </RowLeft>
      <RowRight>
        {rightLabel && (
          <Txt text={rightLabel} size={14} color={colors.text70} />
        )}
        {toggle ? (
          <UISwitch
            value={toggleValue}
            onValueChange={onToggle}
          />
        ) : (
          <MaterialIcons name="chevron-right" size={20} color={colors.text50} />
        )}
      </RowRight>
    </RowContainer>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const { colors } = useTheme();
  const { navigate } = useRouter();
  const { isDarkMode, setPreference } = useAppTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.darkBackground }}>
      <TabScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <PageContent>

          <Txt text="Configurações" weight="bold" size={28} align="left" />

          {/* User card */}
          <UserCard style={{ borderColor: colors.border }}>
            <UserAvatar
              source={
                user?.image
                  ? normalizeImageUri(user.image)
                  : images.avatarPlaceholder
              }
            />
            <UserInfo>
              <Txt text={user?.name ?? ""} weight="semi" size={15} align="left" />
              <Txt text={user?.email ?? ""} size={13} color={colors.text70} align="left" />
            </UserInfo>
            <EditButton activeOpacity={0.7} onPress={() => navigate("/(protected)/(tabs)/profile/edit")}>
              <Txt text="Editar" size={13} color={colors.primary} weight="semi" />
            </EditButton>
          </UserCard>

          {/* CONTA */}
          <Section>
            <SectionLabel text="CONTA" size={12} color={colors.text70} weight="semi" align="left" />
            <SectionCard style={{ borderColor: colors.border }}>
              <SettingRow
                icon={<Feather name="lock" size={18} color={colors.primary} />}
                label="Segurança e Senha"
                onPress={() => {}}
              />
              <SettingRow
                icon={<Feather name="link-2" size={18} color={colors.primary} />}
                label="Contas Vinculadas"
                onPress={() => {}}
              />
              <SettingRow
                icon={<Feather name="globe" size={18} color={colors.primary} />}
                label="Idioma"
                rightLabel="Português"
                onPress={() => {}}
                isLast
              />
            </SectionCard>
          </Section>

          {/* EXIBIÇÃO */}
          <Section>
            <SectionLabel text="EXIBIÇÃO" size={12} color={colors.text70} weight="semi" align="left" />
            <SectionCard style={{ borderColor: colors.border }}>
              <SettingRow
                icon={<Ionicons name="moon-outline" size={18} color={colors.primary} />}
                label="Modo Escuro"
                toggle
                toggleValue={isDarkMode}
                onToggle={(value) => setPreference(value ? "dark" : "system")}
              />
              <SettingRow
                icon={<MaterialIcons name="format-size" size={18} color={colors.primary} />}
                label="Tamanho da Fonte"
                onPress={() => {}}
                isLast
              />
            </SectionCard>
          </Section>

          {/* SUPORTE */}
          <Section>
            <SectionLabel text="SUPORTE" size={12} color={colors.text70} weight="semi" align="left" />
            <SectionCard style={{ borderColor: colors.border }}>
              <SettingRow
                icon={<Feather name="help-circle" size={18} color={colors.primary} />}
                label="Central de Ajuda"
                onPress={() => navigate("/settings/feedback")}
              />
              <SettingRow
                icon={<Feather name="info" size={18} color={colors.primary} />}
                label="Politica de Privacidade"
                onPress={() => Linking.openURL("https://wishhub.co/privacidade")}
              />
              <SettingRow
                icon={<Feather name="file-text" size={18} color={colors.primary} />}
                label="Termos de Uso"
                onPress={() => Linking.openURL("https://wishhub.co/termos")}
                isLast
              />
            </SectionCard>
          </Section>

          {/* Sair */}
          <SignOutButton activeOpacity={0.8} onPress={signOut}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <MaterialIcons name="logout" size={18} color={colors.errorText} />
              <Txt text="Sair" size={15} weight="semi" color={colors.errorText} />
            </View>
          </SignOutButton>

        </PageContent>
      </TabScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const PageContent = styled.View`
  padding: 20px 20px 0px;
  gap: 20px;
`;

const UserCard = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 14px;
  border-width: 1px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const UserAvatar = styled(Image)`
  width: 48px;
  height: 48px;
  border-radius: 24px;
`;

const UserInfo = styled.View`
  flex: 1;
  gap: 2px;
`;

const EditButton = styled.TouchableOpacity`
  padding: 6px 14px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.duotoneBackground};
`;

const Section = styled.View`
  gap: 8px;
`;

const SectionLabel = styled(Txt)``;

const SectionCard = styled.View`
  border-radius: 14px;
  border-width: 1px;
  background-color: ${({ theme }) => theme.colors.background};
  overflow: hidden;
`;

const RowContainer = styled.TouchableOpacity<{ isLast: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom-width: ${({ isLast }) => (isLast ? 0 : 1)}px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

const RowLeft = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const RowRight = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const IconBox = styled.View`
  width: 34px;
  height: 34px;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.duotoneBackground};
`;

const SignOutButton = styled.TouchableOpacity`
  border-radius: 14px;
  height: 54px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.errorBg};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.errorBg};
`;
