import React, { ReactNode } from "react";
import { GestureResponderEvent, Pressable, StyleSheet, Text, ViewStyle } from "react-native";

type ButtonProps = {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
};

export default function Button({ children, style, onPress, disabled }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.9,
  },
  disabled: {
    backgroundColor: '#CCC',
  },
});
