import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { styles } from "../styles";

type LoadingOverlayProps = Readonly<{
  text: string;
}>;

export default function LoadingOverlay({
  text,
}: LoadingOverlayProps): React.JSX.Element {
  return (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color="#06b6d4" />
      <Text style={{ marginTop: 8 }}>{text}</Text>
    </View>
  );
}
