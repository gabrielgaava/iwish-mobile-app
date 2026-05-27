import { CountdownTimer } from "@/components/countdown";
import i18n from "@/constants/region";
import Feather from "@expo/vector-icons/Feather";
import { useTheme } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Txt } from "../ui/text";
import OTPCodeInput from "./index";
import { OTPCodeInputProps } from "./OTPCodeInput";

type OTPWithResendProps = OTPCodeInputProps & {
  /** Duração do timer em minutos antes de liberar o reenvio. Default: 1 */
  timerMinutes?: number;
  /** Chamado quando o timer zera (pode ser usado para logging ou side-effects extras) */
  onTimerFinish?: () => void;
  /** Chamado quando o usuário toca em "Reenviar", após o timer ter zerado */
  onResendPress?: () => void;
};

/**
 * OTPCodeInput com seção de timer e reenvio encapsulados.
 *
 * Gerencia internamente o estado `canRetry` — o timer controla quando
 * o botão de reenvio fica ativo. Os callbacks `onTimerFinish` e
 * `onResendPress` permitem que a tela pai reaja a esses eventos.
 */
export default function OTPWithResend({
  timerMinutes = 1,
  onTimerFinish,
  onResendPress,
  ...otpProps
}: OTPWithResendProps) {
  const [canRetry, setCanRetry] = useState(false);
  const { colors } = useTheme();

  const handleTimerFinish = useCallback(() => {
    setCanRetry(true);
    onTimerFinish?.();
  }, [onTimerFinish]);

  const handleResend = useCallback(() => {
    if (!canRetry) return;
    setCanRetry(false);
    onResendPress?.();
  }, [canRetry, onResendPress]);

  return (
    <Wrapper>
      <OtpBox>
        <OTPCodeInput {...otpProps} />
      </OtpBox>

      <ResendSection>
        {!canRetry && (
          <TimerRow>
            <Feather name="clock" size={14} color={colors.text70} />
            <Txt
              text={" " + i18n.t("verify.resendIn") + " "}
              color={colors.text70}
              size={14}
            />
            <CountdownTimer minutes={timerMinutes} onFinish={handleTimerFinish} />
          </TimerRow>
        )}

        <TouchableOpacity onPress={handleResend} disabled={!canRetry} activeOpacity={0.7}>
          <NotReceivedRow>
            <Txt
              text={i18n.t("verify.notReceived") + " "}
              color={colors.text50}
              size={14}
            />
            <Txt
              text={i18n.t("verify.resend")}
              color={canRetry ? colors.primary : colors.text50}
              weight={canRetry ? "bold" : "regular"}
              size={14}
            />
          </NotReceivedRow>
        </TouchableOpacity>
      </ResendSection>
    </Wrapper>
  );
}

const Wrapper = styled.View`
  width: 100%;
`;

const OtpBox = styled.View`
  width: 100%;
  margin-bottom: 24px;
`;

const ResendSection = styled.View`
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

const TimerRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const NotReceivedRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
