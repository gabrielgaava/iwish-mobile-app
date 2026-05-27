import styled from "styled-components/native";

/**
 * Shared styled components for auth screens (verify, recovery, etc.)
 * that share the same visual structure.
 */

export const AuthBackButton = styled.TouchableOpacity`
  padding: 4px;
  margin-bottom: 24px;
  align-self: flex-start;
`;

export const AuthHeaderSection = styled.View`
  align-items: center;
  margin-bottom: 32px;
`;

export const AuthIconContainer = styled.View`
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background-color: ${p => p.theme.colors.duotoneBackground};
  justify-content: center;
  align-items: center;
`;

export const AuthButtonWrapper = styled.View`
  margin-top: auto;
  padding-top: 24px;
  padding-bottom: 8px;
  width: 100%;
`;

export const AuthNotReceivedRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
