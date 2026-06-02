import { Txt } from "@/components/ui/text";
import i18n from "@/constants/region";
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from "@react-navigation/native";
import { useCallback } from "react";
import styled from 'styled-components/native';
import { CustomButton } from "../buttons";

type EmptyStateProps = {
    type: "wish" | "wishlist" | "publicWishlist" | "users" | "notifications" | "feed";
    showButton?: boolean;
    onButtonPress?: () => void;
}

export default function EmptyState(props: EmptyStateProps) {

    const { colors } = useTheme();

    const ICON_SIZE = 48;
    const ICON_COLOR = colors.primary;

    const icons = {
        wish: <Ionicons name="gift" size={ICON_SIZE} color={ICON_COLOR}/>,
        users: <Feather name="users" size={ICON_SIZE} color={ICON_COLOR} />,
        wishlist: <Ionicons name="list-outline" size={ICON_SIZE} color={ICON_COLOR} />,
        publicWishlist: <Ionicons name="gift" size={ICON_SIZE} color={ICON_COLOR} />,
        notifications: <MaterialIcons name="notifications-off" size={ICON_SIZE} color={ICON_COLOR} />,
        feed: <Feather name="bell-off" size={ICON_SIZE} color={ICON_COLOR} />
    }

    const handleButtonPress = useCallback(() => {
        props.onButtonPress?.();
    }, [props.onButtonPress]);

    const { title, description } = i18n.t(`emptyState.${props.type}`) as { title: string; description: string };

    return (
        <Container>
            {icons[props.type]}
            <Txt text={title} size={22} color={colors.text} weight="semi"/>
            <Txt text={description} size={16} color={colors.text70} />
            {props.showButton && (
                <ButtonContainer>
                    <CustomButton
                        variant="outline"
                        onPress={handleButtonPress}
                        text={i18n.t("emptyState.addButton")}
                        color={ICON_COLOR}
                    />
                </ButtonContainer>
            )}
        </Container>
    );
}

const Container = styled.View`
    justify-content: center;
    align-items: center;
    gap: 6px;
    padding: 42px;
`;

const ButtonContainer = styled.View`
    width: 220px;
    height: 40px;
    margin-top: 20px;
`;