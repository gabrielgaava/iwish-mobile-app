import { Image } from "expo-image";
import styled from "styled-components/native";

export const Container = styled.View`
    flex: 1;;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
`;

export const ImageContainer = styled.View`
    position: relative;    
    border-radius: 20px;
    margin-bottom: 8px;
    overflow: hidden;
    width: 100%;
    height: 174px;
`;

export const CoverImg = styled(Image)`
    position:absolute;
    inset: 0;
`;

export const TouchContainer = styled.TouchableOpacity<{ width: string }>`
    height: 100%;
    max-height: 230px;
    width: ${p => p.width}%;
`;