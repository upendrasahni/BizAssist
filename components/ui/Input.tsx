import React from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {}

export const Input: React.FC<InputProps> = (props) => {
  return <TextInput style={styles.input} {...props} />;
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 5,
    fontSize: 16,
  },
});
