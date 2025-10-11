import { Control, Controller } from "react-hook-form";
import { StyleProp, TextInput } from "react-native";

export const InputText = ({ control, rules, name, label, style }: Props) => {
  return (
    <Controller
      control={control}
      rules={{ required: rules.required }}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          placeholder={label}
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          style={style}
          secureTextEntry={rules.isPassword || false}
          keyboardType={getKeyBoardType(rules)}
        />
      )}
      name={name}
    />
  );
};

const getKeyBoardType = (rules: Settings) => {
  if (rules.isEmail) return "email-address";
  if (rules.isPhone) return "phone-pad";
  if (rules.isNumber) return "numeric";
  return "default";
};

type Settings = {
  required: boolean;
  isPassword?: boolean;
  isEmail?: boolean;
  isPhone?: boolean;
  isNumber?: boolean;
};

type Props = {
  control: Control<any>;
  rules: Settings;
  name: string;
  label: string;
  style: StyleProp<any>;
};
