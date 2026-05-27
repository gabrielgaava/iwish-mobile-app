import { useTheme } from "@react-navigation/native";
import { Switch, SwitchProps } from "react-native";

type UISwitchProps = Omit<SwitchProps, "trackColor" | "thumbColor" | "ios_backgroundColor"> & {
  trackColor?: SwitchProps["trackColor"];
  thumbColor?: string;
};

export function UISwitch({ trackColor, thumbColor, ...props }: UISwitchProps) {
  const { colors } = useTheme();

  const resolvedTrackColor = trackColor ?? {
    false: colors.altBackground,
    true: colors.primary,
  };

  const resolvedThumbColor = thumbColor ?? colors.altBackground;

  return (
    <Switch
      trackColor={resolvedTrackColor}
      thumbColor={resolvedThumbColor}
      ios_backgroundColor={colors.altBackground}
      {...props}
    />
  );
}
