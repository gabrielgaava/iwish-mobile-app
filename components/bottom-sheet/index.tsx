import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useTheme } from "@react-navigation/native";
import { forwardRef, ReactNode, useCallback, useMemo } from "react";
import { StyleProp, ViewStyle } from "react-native";

type UIBottomSheetProps = Omit<BottomSheetModalProps, "children" | "snapPoints"> & {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  snapPoints?: (string | number)[];
};

const UIBottomSheet = forwardRef<BottomSheetModal, UIBottomSheetProps>(
  (
    {
      children,
      contentContainerStyle,
      enablePanDownToClose = true,
      snapPoints,
      backgroundStyle,
      ...props
    },
    ref
  ) => {
    const { colors } = useTheme();
    const defaultSnapPoints = useMemo(() => snapPoints || ["35%", "65%"], [snapPoints]);

    const resolvedBackgroundStyle = useMemo(
      () => [{ backgroundColor: colors.background }, backgroundStyle],
      [colors.background, backgroundStyle]
    );

    const renderBackdrop = useCallback(
      (backdropProps: any) => (
        <BottomSheetBackdrop
          {...backdropProps}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
        />
      ),
      []
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={defaultSnapPoints}
        enablePanDownToClose={enablePanDownToClose}
        backdropComponent={renderBackdrop}
        backgroundStyle={resolvedBackgroundStyle}
        {...props}
      >
        <BottomSheetView style={contentContainerStyle}>
          {children}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

UIBottomSheet.displayName = "UIBottomSheet";

export default UIBottomSheet;
