import '@react-navigation/native';
import 'styled-components';
import { CustomDefaultTheme } from '../constants/theme'; // seu tema padrão

type ThemeType = typeof CustomDefaultTheme;

declare module 'styled-components/native' {
  export interface DefaultTheme extends ThemeType {}
}

declare module '@react-navigation/native' {
  export type ExtendedTheme = ThemeType;
  export function useTheme(): ExtendedTheme;
}
