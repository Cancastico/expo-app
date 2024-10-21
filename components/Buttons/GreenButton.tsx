import React from "react";
import { GestureResponderEvent, Text, StyleSheet } from "react-native";
import Button from "./Button";

type Props = {
  label: string;
  disabled?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
};

export default function GreenButton({ label, onPress, disabled }: Props) {
  return (
    <Button
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        disabled ? styles.disabled : styles.enabled,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    width:'100%',
    paddingVertical: 12,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  enabled: {
    backgroundColor: '#38A169', // Green 500
  },
  disabled: {
    backgroundColor: '#7cb195', // Gray 300
  },
  label: {
    color: '#FFFFFF', // White text
    fontWeight: '600', // Semi-bold
    fontSize: 20, // text-3xl approximation
  },
});
