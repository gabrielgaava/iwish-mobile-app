import { Animated, StyleSheet } from "react-native";
import styled from "styled-components/native";

type StyledInputProps = {
  isFocused: boolean;
  hasError?: boolean;
  isDisabled?: boolean;
}

export const styles = StyleSheet.create({
  iconLeft: {
    marginRight: 10,
  },
  iconRight: {
    marginLeft: 10,
  },
})

export const StyledWrapper = styled.View`
  width: 100%;
  margin-bottom: 6px;
  margin-top: 12px;
`

export const StyledContainer = styled(Animated.View)<StyledInputProps>`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 16px;
  padding-right: 16px;
  border-width: 1.5px;
  max-height: 54px;
  min-height: 54px;
  border-radius: 16px;
  background-color: ${props =>
    props.isDisabled
      ? props.theme.colors.altBackground
      : props.theme.colors.darkBackground};
`

export const StyledInput = styled.TextInput<StyledInputProps>`
  flex: 1;
  height: 54px;
  width: 100%;
  outline-width: 0;
  color: ${props =>
    props.isDisabled ? props.theme.colors.text50 : props.theme.colors.text};
  z-index: 5;
  font-size: 15px;
  padding: 0px;
`

export const StyledErrorText = styled.Text`
  color: ${props => props.theme.colors.errorText};
  font-size: 12px;
  margin-top: 6px;
  padding-left: 4px;
  padding-right: 4px;
  font-family: Poppins_400Regular;
`
