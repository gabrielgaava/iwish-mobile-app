import { ReactNode } from "react";
import { styled } from "styled-components/native";

export const Screen = ({ children }: {children: ReactNode}) => {
  return (
    <StyledSafeArea>
      {children}
    </StyledSafeArea>
  );
}

const StyledSafeArea = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.screenBackground};
`;