import { Txt } from "@/components/ui/text";
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from "@react-navigation/native";
import styled from 'styled-components/native';
import { BorderButton } from "../buttons";

type EmptyStateProps = {
    type: "wish" | "wishlist" | "users" | "notifications";
    showButton?: boolean;
    onButtonPress?: () => void;
}

export default function EmptyState(props: EmptyStateProps) {

    const { colors } = useTheme();

    const ICON_SIZE = 42;
    const ICON_COLOR = colors.text50;

    const icons = {
        wish: <Ionicons name="gift" size={ICON_SIZE} color={ICON_COLOR}/>,
        users: <Feather name="users" size={ICON_SIZE} color={ICON_COLOR} />,
        wishlist: <Ionicons name="list-circle" size={ICON_SIZE} color={ICON_COLOR} />,
        notifications: <MaterialIcons name="notifications-off" size={ICON_SIZE} color={ICON_COLOR} />
    }

    const text = {
        wish: "Essa lista esta vazia",
        users: "Nenhum usuário encontrado",
        wishlist: "Nenhuma lista de desejos encontrada",
        notifications: "Nenhuma notificação por aqui"
    }

    const description = {
        wish: "Parece que não há nenhum item aqui. Que tal adicionar um novo desejo para começar a preencher essa lista?",
        users: "Enter a name or email to find people you know and connect with them. Sharing wishlists is more fun with friends!",
        wishlist: "Parece que não há nenhuma lista de desejos aqui. Que tal criar uma nova lista para começar a adicionar seus desejos favoritos?",
        notifications: "Você está em dia! Nenhuma notificação por aqui."
    }

    function handleButtonPress() { 
        if(props.onButtonPress) {
            props.onButtonPress();
        }

        else return;
    }

    return (
        <Container>
            {icons[props.type]}
            <Txt text={text[props.type]} size={18} color={colors.text} weight="semi"/>
            <Txt text={description[props.type]} size={14} color={colors.text70} />
            {props.showButton && (
                <ButtonContainer>
                    <BorderButton 
                        onPress={handleButtonPress} 
                        text="Adicionar item" 
                        color={ICON_COLOR} 
                        weight="regular"
                    />
                </ButtonContainer>
            ) }
        </Container>
    );
}

const Container = styled.View`
    justify-content: center;
    align-items: center;
    gap: 6px;
    padding: 32px 42px;
`;

const ButtonContainer = styled.View`
    width: 220px;
    height: 40px;
    margin-top: 20px;
`;