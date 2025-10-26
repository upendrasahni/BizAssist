import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, StatusBar, View } from "react-native";
import TipsModal from "../models/TipsModal";
import ChatUI from "./components/ChatUI";
import Header from "./components/Header";
import LoadingOverlay from "./components/LoadingOverlay";
import { useChatLogic } from "./hooks/useChatLogic";
import { useUserContext } from "./hooks/useUserContext";
import { styles } from "./styles";

const STATUS_BAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight || 0 : 44;

export default function HomeScreen(): React.JSX.Element {
  const router = useRouter();
  const { userName, currentUserId, messages, setMessages } = useUserContext();

  const {
    loading,
    uploading,
    documentContextState,
    onSend,
    deleteTheSession,
    handleUploadDocument,
    handleExportPDF,
    handleLogout,
  } = useChatLogic({
    userName,
    currentUserId,
    messages,
    setMessages,
    router,
  });

  const [tipsVisible, setTipsVisible] = useState(false);

  return (
    <View style={styles.safe}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <LinearGradient
        colors={["#0b66c3", "#06b6d4"]}
        style={[styles.header, { paddingTop: STATUS_BAR_HEIGHT + 16 }]}
      >
        <Header
          userName={userName}
          documentContextState={documentContextState}
          onTips={() => setTipsVisible(true)}
          onExport={handleExportPDF}
          onDelete={deleteTheSession}
          onLogout={handleLogout}
        />
      </LinearGradient>

      <ChatUI
        userName={userName}
        messages={messages}
        onSend={onSend}
        handleUploadDocument={handleUploadDocument}
        uploading={uploading}
      />

      {(loading || uploading) && (
        <LoadingOverlay
          text={uploading ? "Processing document..." : "Thinking..."}
        />
      )}

      <TipsModal visible={tipsVisible} onClose={() => setTipsVisible(false)} />
    </View>
  );
}
