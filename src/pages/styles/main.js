import { StyleSheet } from "react-native";

export const TAB_COLOR = '#259252';
export const BG_COLOR = '#080808';
export const FG_COLOR = '#259252';
export const TEXT_COLOR = '#259252';
export const SURFACE = '#121212';
export const SURFACE_2 = '#1A1A1A';
export const BORDER = '#2A2A2A';
export const MUTED = '#8A8A8A';
export const WHITE = '#F5F5F5';

export const mainStyles = StyleSheet.create({
     input: {
          backgroundColor: SURFACE_2,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: BORDER,
          height: 52,
          paddingHorizontal: 16,
          marginBottom: 16,
          fontFamily: 'Exo',
          fontSize: 17,
          color: WHITE,
     },
     button: {
          backgroundColor: FG_COLOR,
          height: 56,
          borderRadius: 14,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 4,
          shadowColor: FG_COLOR,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.6,
          shadowRadius: 8,
          elevation: 12,
     },
     buttonText: {
          color: WHITE,
          fontWeight: 'bold',
          fontFamily: 'Exo',
          fontSize: 17,
          letterSpacing: 2,
     },
});