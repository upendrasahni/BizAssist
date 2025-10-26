import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles";

type HeaderProps = Readonly<{
  userName: string;
  documentContextState: any;
  onTips: () => void;
  onExport: () => void;
  onDelete: () => void;
  onLogout: () => void;
}>;

export default function Header({
  userName,
  documentContextState,
  onTips,
  onExport,
  onDelete,
  onLogout,
}: HeaderProps): React.JSX.Element {
  return (
    <View style={styles.headerRow}>
      <View>
        <Text style={styles.title}>BizAssist Chat</Text>
        {documentContextState ? (
          <View style={styles.docRow}>
            <Text numberOfLines={1} style={styles.docText}>
              📄 {documentContextState.fileName}
            </Text>
            <Text style={styles.docReady}>Ready</Text>
          </View>
        ) : (
          <Text style={styles.sub}>
            Welcome {userName}! Upload a PDF or ask me anything.
          </Text>
        )}
      </View>

      <View style={styles.headerActions}>
        <TouchableOpacity onPress={onTips} style={styles.headerIcon}>
          <Ionicons name="bulb-outline" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onExport} style={styles.headerIcon}>
          <Ionicons name="share-social-outline" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.headerIcon}>
          <Ionicons name="trash-outline" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onLogout} style={styles.headerIcon}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
