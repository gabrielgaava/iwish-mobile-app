import { Txt } from "@/components/ui/text";
import { useTheme } from "@react-navigation/native";
import { ActivityIndicator, Modal } from "react-native";
import styled from "styled-components/native";

type Props = {
  visible: boolean;
  message?: string;
};

export function LoadingOverlay({ visible, message }: Props) {
  const { colors } = useTheme();

  return (
    <Modal transparent animationType="fade" visible={visible} statusBarTranslucent>
      <Backdrop>
        <Card>
          <ActivityIndicator size="large" color={colors.primary} />
          {message && (
            <Txt text={message} size={14} weight="semi" style={{ marginTop: 14 }} />
          )}
        </Card>
      </Backdrop>
    </Modal>
  );
}

const Backdrop = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 16px;
  padding: 32px 40px;
  align-items: center;
`;
