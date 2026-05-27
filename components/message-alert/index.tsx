import Feather from "@expo/vector-icons/Feather";
import { useTheme } from "@react-navigation/native";
import styled from "styled-components/native";
import { Txt } from "../ui/text";

type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

type AlertType = "success" | "error" | "warning";

type MessageAlertProps = {
    type: AlertType;
    message: string;
}

const ICON_MAP = {
    success: "check-circle",
    error: "alert-circle",
    warning: "info",
} satisfies Record<AlertType, FeatherIconName>;

export default function MessageAlert({type, message}: MessageAlertProps) {

    const icon = ICON_MAP[type];
    const { colors } = useTheme();

    const colorText = {
        success: colors.successText,
        warning: colors.warningText,
        error: colors.errorText,
    }

    const colorBackground = {
        success: colors.darkBackground,
        warning: colors.darkBackground,
        error: colors.errorBg,
    }

    return (
        <Container color={colorBackground[type]}>
            <Feather name={icon} size={18} color={colorText[type]}/>
            <Txt text={message} size={14} color={colorText[type]} weight="semi"/>
        </Container>
    )
}

const Container = styled.View<{color: string}>`
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 6px;
    background: ${props => props.color};
    padding: 16px;
    border-radius: 12px;
    margin-top: 12px;
    margin-bottom: 12px;
`;