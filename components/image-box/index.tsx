import { Image, ImageContentFit, ImageLoadEventData, ImageSource, ImageStyle } from "expo-image";
import { useCallback, useMemo, useState } from "react";
import { DimensionValue, StyleProp } from "react-native";

type Props = {
  source: ImageSource;
  height?: number;
  width?: DimensionValue;
  contentFit?: ImageContentFit;
  style?: StyleProp<ImageStyle>;
};

/**
 * Wrapper do Image do Expo com aspect ratio automático.
 *
 * - Apenas `height` → largura 100%, altura fixa, proporção preservada via contentFit.
 * - Apenas `width`  → largura fixa/relativa, altura calculada automaticamente
 *                      pela proporção natural da imagem (via onLoad + aspectRatio).
 * - Ambos ou nenhum → valores passados diretamente, sem cálculo de proporção.
 */
export default function ImageBox({
  source,
  height,
  width,
  contentFit = "cover",
  style,
}: Props) {
  const [aspectRatio, setAspectRatio] = useState<number | undefined>();

  const handleLoad = useCallback((event: ImageLoadEventData) => {
    const { width: nW, height: nH } = event.source;
    if (nW > 0 && nH > 0) {
      setAspectRatio(nW / nH);
    }
  }, []);

  const resolvedStyle = useMemo(() => {
    // Height-first: preenche largura total, respeita altura definida
    if (height !== undefined && width === undefined) {
      return { width: "100%" as DimensionValue, height };
    }
    // Width-first: largura fixa/relativa + altura calculada via aspectRatio
    // aspectRatio ?? 1 evita height=0 antes do onLoad (imagem temporariamente quadrada)
    if (width !== undefined && height === undefined) {
      return { width, aspectRatio: aspectRatio ?? 1 };
    }
    // Ambos ou nenhum: passa diretamente
    return {
      width: width ?? ("100%" as DimensionValue),
      height: height ?? ("100%" as DimensionValue),
    };
  }, []);

  return (
    <Image
      source={source}
      style={[resolvedStyle, style]}
      contentFit={contentFit}
      onLoad={handleLoad}
    />
  );
}
