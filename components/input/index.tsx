import AntDesign from "@expo/vector-icons/AntDesign";
import { useState } from "react";
import { Control, Controller } from "react-hook-form";
import { StyleProp, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

export const InputText = ({ control, rules, name, label, style }: Props) => {
  const [hidePassword, setHidePassword] = useState<boolean>(true);

  if (rules.isPassword) {
    return (
      <View style={styles.containerPasswrod}>
        <Controller
          control={control}
          rules={{ required: rules.required }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder={label}
              placeholderTextColor={"#ffffff70"}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={[style, styles.input]}
              secureTextEntry={hidePassword}
              keyboardType={getKeyBoardType(rules)}
            />
          )}
          name={name}
        />
        <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
          {hidePassword && <AntDesign name="eye" size={20}  color={'#FFFFFF60'}/>}
          {!hidePassword && <AntDesign name="eye-invisible" size={20}  color={'#FFFFFF60'}/>}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        rules={{ required: rules.required }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder={label}
            placeholderTextColor={"#ffffff70"}
            autoCapitalize="none"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={[style, styles.input]}
            secureTextEntry={false}
            keyboardType={getKeyBoardType(rules)}
          />
        )}
        name={name}
      />
    </View>
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
  style?: StyleProp<any>;
};
