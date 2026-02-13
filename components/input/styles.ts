import { Animated, StyleSheet } from "react-native"
import styled from "styled-components/native"

type StyledInputProps = {
  isFocused: boolean,
}

export const styles = StyleSheet.create({
  label: {
    position: "absolute",
    left: 18,
    zIndex: 2,
    fontFamily: "Poppins_400Regular",
  }
})

export const StyledInput = styled.TextInput<StyledInputProps>`
  flex: 1;
  max-height: 50px;
  min-height: 50px;
  width: 100%;
  outline-width: 0;
  color: ${props => props.theme.colors.text70};
  z-index: 5;
  font-size: 16px;
  padding-top: 12px;
  line-height: 16px;
  include-font-padding: false;
  padding-horizontal: 0px;
  padding-vertical: 0px;
`

export const StyledContainer = styled(Animated.View)<StyledInputProps>`
  flex: 1;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 18px;
  border-width: 1px;
  max-height: 70px;
  min-height: 70px;
  line-height: 70px;
  margin-bottom: 12px;
  border-radius: 10px;
  z-index: 1;
`

export const StyledLabel = styled.Text<StyledInputProps>`
  position: absolute;
  left: 18px;
  z-index: 2;
  font-family: Poppins_400Regular;
  transition: all 0.2s;
`