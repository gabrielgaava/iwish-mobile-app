import { Image } from "expo-image";
import styled from "styled-components/native";

export const Container = styled.TouchableOpacity`
    flex-direction: row;
    gap: 8px;
    margin-bottom: 12px;
    border-bottom-width: 1px;
    border-bottom-color: ${props => props.theme.colors.border};;
    padding-bottom: 0cqmax;
`;

export const Avatar = styled(Image)`
    height: 50px;
    width: 50px;
    border-radius: 4px;
`;

export const NameColumn = styled.View`
    flex-direction: column;
    align-items: flex-start;
`;