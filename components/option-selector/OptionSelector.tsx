import { ReactElement, useState } from "react";
import { SelectableOption } from "./SelectableOption";

export type OptionSelectorProps = {
    options: Options[]
    onValueChange: (value: string) => void;
}

export type Options = {
    value: string;
    title: string;
    description: string;
    icon: ReactElement;
}

export function OptionSelector({ options, onValueChange }: OptionSelectorProps) {

  const [selected, setSelected] = useState(options[0].value);

  const handleChange = (newValue: string) => {
    setSelected(newValue);
    onValueChange(newValue);
  }

  return (
    <>
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
    </>
  );
}
