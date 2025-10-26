import { Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f6f9fb" },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { color: "#fff", fontSize: 18, fontWeight: "700" },
  headerActions: { flexDirection: "row", alignItems: "center" },
  headerIcon: { marginLeft: 10, padding: 6, opacity: 0.95 },
  sub: { color: "rgba(255,255,255,0.95)", marginTop: 6,width:220 },
  docRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  docText: { color: "#ffffff", flex: 1, fontWeight: "600" },
  docReady: {
    color: "#e6fffa",
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
    fontSize: 12,
  },

  messagesContainer: {
    paddingBottom: 6,
    paddingHorizontal: 12,
    paddingTop: 0,
  },

  messageTextContainer: {
    maxWidth: "100%",
  },
  systemMessageTextContainer: {
    maxWidth: "100%",
    paddingHorizontal: 0,
  },

  // System message bubble styling
  systemBubbleContainer: {
    alignItems: "center",
    marginVertical: 8,
    paddingHorizontal: 12,
  },
  systemBubble: {
    backgroundColor: "#fff7ed",
    borderWidth: 1,
    borderColor: "#fde3bf",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    maxWidth: "92%",
    alignSelf: "center",
  },

  bubbleRight: {
    backgroundColor: "#06b6d4",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    maxWidth: "78%",
  },
  bubbleLeft: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#eef3f6",
    maxWidth: "80%",
  },
  bubbleTextRight: { color: "#012026", fontSize: 15 },
  bubbleTextLeft: { color: "#0b2632", fontSize: 15 },

  inputToolbar: {
    backgroundColor: "transparent",
    padding: 6,
    borderTopWidth: 0,
    marginBottom: Platform.OS === "android" ? 6 : 0,
  },
  inputPrimary: { alignItems: "center", backgroundColor: "transparent" },
  composerText: {
    color: "#0b2632",
    fontSize: 16,
    backgroundColor: "transparent",
    paddingLeft: 0,
    paddingRight: 12,
    paddingTop: 8,
    paddingBottom: 8,
    minHeight: 40,
  },

  composerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
    borderRadius: 24,
    paddingHorizontal: 4,
    paddingVertical: 4,
    flex: 1,
    marginHorizontal: 8,
  },
  uploadIconButtonLeft: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
    marginRight: 4,
  },

  loadingOverlay: {
    position: "absolute",
    top: "45%",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  sendIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0b66c3",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
});

const markdownStyles: any = {
  body: {
    color: "#0b2632",
    fontSize: 15,
    lineHeight: 20,
    margin: 0,
    padding: 0,
  },
  strong: { fontWeight: "700" },
  em: { fontStyle: "italic" },
  link: { color: "#0b66c3" },
  code_inline: {
    backgroundColor: "#f0f4f8",
    padding: 4,
    borderRadius: 4,
  },
  fence: {
    backgroundColor: "#0f1720",
    color: "#f8fafc",
    padding: 10,
    borderRadius: 6,
    marginVertical: 8,
  },
  paragraph: {
    margin: 0,
    padding: 0,
  },
};

const markdownStylesSystem: any = {
  body: {
    color: "#92400e",
    fontSize: 14,
    lineHeight: 18,
    margin: 0,
    padding: 0,
    textAlign: "center",
  },
  strong: {
    fontWeight: "700",
    color: "#92400e",
  },
  em: {
    fontStyle: "italic",
    color: "#92400e",
  },
  link: { color: "#0b66c3" },
  code_inline: {
    backgroundColor: "rgba(255,255,255,0.5)",
    padding: 2,
    borderRadius: 3,
    color: "#92400e",
  },
  fence: {
    backgroundColor: "#0f1720",
    color: "#f8fafc",
    padding: 8,
    borderRadius: 6,
    marginVertical: 6,
  },
  paragraph: {
    margin: 0,
    padding: 0,
  },
};


export { markdownStyles, markdownStylesSystem, styles };
