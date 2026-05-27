import { FeatherIconName } from "@/types/Ui";
import { useState } from "react";
import { StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";
import { SelectableOption } from "./SelectableOption";

export type OptionSelectorProps = {
    options: Options[]
    onValueChange: (value: string) => void;
    style?: StyleProp<ViewStyle>
    defaultValue?: string;
}

export type Options = {
    value: string;
    title: string;
    description: string;
    icon: FeatherIconName;
}

export function OptionSelector({ options, style, onValueChange, defaultValue }: OptionSelectorProps) {

  const [selected, setSelected] = useState(defaultValue ?? options[0].value);

  const handleChange = (newValue: string) => {
    setSelected(newValue);
    onValueChange(newValue);
  }

  return (
    <Grid style={style}>
      {options.map((option => 
        <SelectableOption
            key={option.value}
            selected={option.value === selected}
            title={option.title}
            description={option.description}
            icon={option.icon}
            onPress={() => handleChange(option.value)}
        />
      ))}
    </Grid>
  );
}

const Grid = styled.View`
  flex-direction: row;
  width: 100%;
  gap: 16px;
`;
