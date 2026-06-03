import { Image } from "expo-image";
import styled from "styled-components/native";

export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 16px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  overflow: hidden;
  margin-bottom: 12px;
`;

export const ItemHeader = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
`;

export const UserAvatar = styled(Image)`
  width: 38px;
  height: 38px;
  border-radius: 19px;
`;

export const HeaderTextColumn = styled.View`
  flex: 1;
`;

export const WishlistCover = styled.TouchableOpacity`
  width: 100%;
  height: 190px;
  position: relative;
`;

export const CoverImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

export const CoverOverlay = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 14px 16px;
  background-color: rgba(0, 0, 0, 0);
`;

export const WishRow = styled.View`
  flex-direction: row;
  gap: 12px;
  padding: 0px 14px;
  align-items: center;
`;

export const WishImage = styled(Image)`
  width: 88px;
  height: 88px;
  border-radius: 10px;
`;

export const WishDetails = styled.View`
  flex: 1;
  gap: 4px;
`;

export const DetailsButtonWrapper = styled.View`
  height: 44px;
  margin: 14px 14px 6px 14px;
`;
