import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";

type CountdownTimerProps = {
  minutes?: number; // duração em minutos, aceita decimais
  endTime?: Date;   // horário de término
  onFinish?: () => void; // callback ao finalizar
};

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  minutes,
  endTime,
  onFinish,
}) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasFinished = useRef(false);

  // calcula o tempo inicial
  useEffect(() => {
    let initialSeconds = 0;

    if (endTime) {
      initialSeconds = Math.max(
        0,
        Math.floor((endTime.getTime() - Date.now()) / 1000)
      );
    } else if (minutes) {
      initialSeconds = Math.max(1, Math.ceil(minutes * 60)); // garante pelo menos 1s
    }

    setTimeLeft(initialSeconds);
  }, [endTime, minutes]);

  // controla o countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return null;

        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          if (!hasFinished.current) {
            hasFinished.current = true;
            onFinish?.();
          }
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      if(intervalRef.current)
        clearInterval(intervalRef?.current);
    }
  }, [])

  // formata o tempo em hh:mm:ss ou mm:ss
  const formatTime = (time: number) => {
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = time % 60;

    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s
        .toString()
        .padStart(2, "0")}`;
    }

    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (timeLeft === null) return <Text>Carregando...</Text>;

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 40, fontWeight: "bold" }}>
        {formatTime(timeLeft)}
      </Text>
    </View>
  );
};
