import { LinearGradient } from "expo-linear-gradient";
import styled from "styled-components/native";
import { Txt } from "../ui/text";

export const Gradient = styled(LinearGradient)`
  flex: 1;
  width: "100%";
  justify-content: "center";
  align-items: "center";
`;

export const ButtonText = styled(Txt) <{ color: string }>`
  color: ${({ color }) => color};
  text-align: center;
  font-size: 16px;
  flex: 1;
  line-height: 60px;
`;

export const Button = styled.TouchableOpacity`
  width: 100%;
  height: 60px;
  margin-top: 10px;
  border-radius: 10px;
  overflow: hidden;
`;