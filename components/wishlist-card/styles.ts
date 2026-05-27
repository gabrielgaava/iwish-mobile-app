import { Image } from "expo-image";
import styled from "styled-components/native";

export const TouchContainer = styled.TouchableOpacity<{ width: string }>`
    width: ${p => p.width}%;
`;

export const CardContainer = styled.View`
    flex-direction: column;
    background-color: ${({ theme }) => theme.colors.darkBackground};
    border-radius: 16px;
    overflow: hidden;
`;

export const ImageContainer = styled.View`
    position: relative;
    width: 100%;
    height: 160px;
`;

export const CoverImg = styled(Image)`
    position: absolute;
    inset: 0;
`;

export const CardInfo = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px 12px;
    gap: 8px;
`;

export const CardTextGroup = styled.View`
    flex: 1;
    gap: 2px;
`;

export const BadgeContainer = styled.View<{color: string}>`
    position: absolute;
    top: 10px;
    right: 10px;
    flex-direction: row;
    align-items: center;
    background-color: ${p => p.color};
    border-radius: 20px;
    gap: 4px;
    padding: 4px 10px;
`;