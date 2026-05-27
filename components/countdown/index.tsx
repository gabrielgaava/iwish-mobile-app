import { Txt } from "@/components/ui/text";
import { useTheme } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";

type Props = {
  minutes?: number;
  endTime?: Date;
  onFinish?: () => void;
};

/**
 * Renderiza apenas o tempo formatado (mm:ss) como Txt inline.
 * O intervalo é criado uma única vez — sem recriação a cada tick.
 */
export const CountdownTimer = ({ minutes, endTime, onFinish }: Props) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { colors } = useTheme();

  // Ref para onFinish: permite alterar o callback sem reiniciar o timer
  const onFinishRef = useRef(onFinish);
  useEffect(() => { onFinishRef.current = onFinish; });

  useEffect(() => {
    const initialSeconds = endTime
      ? Math.max(0, Math.floor((endTime.getTime() - Date.now()) / 1000))
      : Math.max(0, Math.ceil((minutes ?? 0) * 60));

    setTimeLeft(initialSeconds);

    if (initialSeconds <= 0) {
      onFinishRef.current?.();
      return;
    }

    // Intervalo criado uma única vez — não recria a cada mudança de timeLeft
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          // setTimeout evita chamar setState dentro de outro setState
          setTimeout(() => onFinishRef.current?.(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [minutes, endTime]); // só reinicia se os props mudarem

  const mm = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const ss = (timeLeft % 60).toString().padStart(2, "0");

  return <Txt text={`${mm}:${ss}`} color={colors.primary} weight="semi" size={14} />;
};
