import Feather from '@expo/vector-icons/Feather';
import { useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import styled from "styled-components/native";

type SearchInputProps = {
  onValueChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export default function SearchInput({
  debounceMs = 600,
  onValueChange,
  placeholder = "Buscar...",
}: SearchInputProps) {

  const { colors } = useTheme();
  const [value, setValue] = useState("");

  // Fire the onValueChange just after 400ms withou type
  useEffect(() => {
    const timeout = setTimeout(() => {
      onValueChange(value);
    }, debounceMs);

    return () => clearTimeout(timeout);
  }, [debounceMs, onValueChange, value]);

  function clearSearch() {
    setValue("");
  }

  return (
    <Container>
      <Left>
        <Feather name="search" size={22} color={colors.text70} />
        <Input value={value} onChangeText={setValue} placeholder={placeholder} placeholderTextColor={colors.text70}/>
      </Left>
      {value &&
        (
          <ClearButton onPress={clearSearch}>
            <Feather name="x" size={22} color={colors.text70} />
          </ClearButton>
        )}
    </Container>
  );
}

const Container = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    padding-left: 12px;
    padding-right: 12px;
    color: ${props => props.theme.colors.text70};
    border-radius: 12px;
    background:  ${props => props.theme.colors.background};
    border: ${props => props.theme.colors.border30};;
`;

const Input = styled.TextInput`
    height: 50px;
    flex: 1;
    color: ${p => p.theme.colors.text70};
`;

const Left = styled.View`
    flex: 1;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
`;

const ClearButton = styled.TouchableOpacity`
`
