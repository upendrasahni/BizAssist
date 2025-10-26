import React, { useEffect, useRef } from "react";

import {
  Animated,
  FlatList,
  ListRenderItemInfo,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

interface TipsModalProps {
  visible: boolean;
  onClose: () => void;
}

interface TipItem {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  title: string;
  description: string;
  examples: string[];
}

const TipsModal: React.FC<TipsModalProps> = ({ visible, onClose }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
    }
  }, [visible, fadeAnim, slideAnim]);

  const tips: TipItem[] = [
    {
      icon: "chatbubble-outline",
      iconColor: "#0b66c3",
      title: "General Chat",
      description:
        "Ask me anything! I can help with business advice, calculations, and general questions.",
      examples: [
        "Calculate profit margin for ₹10,000 revenue and ₹7,000 cost",
        "Give me business tips for a small retail shop",
      ],
    },
    {
      icon: "attach-outline",
      iconColor: "#059669",
      title: "Upload Documents",
      description:
        "Tap the attach icon (📎) in the chat input to upload PDF documents for analysis.",
      examples: [
        "Summarize this contract",
        "What are the key points in section 2?",
      ],
    },
    {
      icon: "search-outline",
      iconColor: "#7c3aed",
      title: "Document Analysis",
      description:
        "Once a PDF is uploaded, ask specific questions about its content.",
      examples: ["List all payment terms", "Explain clause 5 in simple terms"],
    },
    {
      icon: "document-outline",
      iconColor: "#dc2626",
      title: "Export Chat",
      description:
        "Tap the document icon in the header to export your entire conversation as a PDF.",
      examples: [],
    },
    {
      icon: "trash-outline",
      iconColor: "#ea580c",
      title: "Clear Session",
      description:
        "Tap the trash icon to clear the chat and start fresh. This removes uploaded documents too.",
      examples: [],
    },
  ];

  const renderTip = ({ item }: ListRenderItemInfo<TipItem>) => {
    return (
      <View style={styles.tipCard}>
        <View style={styles.tipHeader}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: `${item.iconColor}15` },
            ]}
          >
            <Ionicons name={item.icon} size={24} color={item.iconColor} />
          </View>
          <Text style={styles.tipTitle}>{item.title}</Text>
        </View>

        <Text style={styles.tipDescription}>{item.description}</Text>

        {item.examples.length > 0 && (
          <View style={styles.examplesContainer}>
            <Text style={styles.examplesLabel}>💬 Try asking:</Text>
            {item.examples.map((ex, i) => (
              <View key={i + ""} style={styles.exampleItem}>
                <View style={styles.exampleDot} />
                <Text style={styles.exampleText}>"{ex}"</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Ionicons name="bulb" size={24} color="#fff" />
              <Text style={styles.headerTitle}>How to Use BizAssist</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={tips}
            keyExtractor={(_, idx) => String(idx)}
            renderItem={renderTip}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <Text style={styles.subtitle}>
                Your AI-powered business assistant is ready to help! Here's what
                you can do:
              </Text>
            }
            ListFooterComponent={
              <>
                <View style={styles.quickTipsBox}>
                  <View style={styles.quickTipsHeader}>
                    <Ionicons name="flash" size={20} color="#92400e" />
                    <Text style={styles.quickTipsTitle}>Quick Tips</Text>
                  </View>
                  <Text style={styles.quickTipItem}>
                    • Be specific in your questions for better answers
                  </Text>
                  <Text style={styles.quickTipItem}>
                    • Upload PDFs up to 10MB for analysis
                  </Text>
                  <Text style={styles.quickTipItem}>
                    • Your chat history is saved during the session
                  </Text>
                  <Text style={styles.quickTipItem}>
                    • Export conversations anytime as PDF
                  </Text>
                </View>

                <TouchableOpacity style={styles.gotItButton} onPress={onClose}>
                  <Text style={styles.gotItText}>Got It! Let's Start</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
              </>
            }
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    width: "92%",
    maxWidth: 500,
    maxHeight: "88%",
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: "#0b66c3",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  headerTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#fff",
    marginLeft: 10,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: { padding: 20, paddingBottom: 30 },
  subtitle: {
    fontSize: 15,
    color: "#475569",
    marginBottom: 24,
    lineHeight: 22,
  },
  tipCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  tipHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  tipTitle: { fontSize: 17, fontWeight: "700", color: "#1e293b", flex: 1 },
  tipDescription: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 21,
    marginBottom: 14,
  },
  examplesContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: "#06b6d4",
  },
  examplesLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0b66c3",
    marginBottom: 10,
  },
  exampleItem: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  exampleDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#06b6d4",
    marginRight: 10,
    marginTop: 7,
  },
  exampleText: {
    fontSize: 13,
    color: "#64748b",
    fontStyle: "italic",
    flex: 1,
    lineHeight: 19,
  },
  quickTipsBox: {
    backgroundColor: "#fef3c7",
    borderRadius: 14,
    padding: 18,
    marginTop: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#fde047",
  },
  quickTipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  quickTipsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#92400e",
    marginLeft: 8,
  },
  quickTipItem: {
    fontSize: 14,
    color: "#78350f",
    marginBottom: 8,
    lineHeight: 20,
  },
  gotItButton: {
    backgroundColor: "#0b66c3",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#0b66c3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gotItText: { color: "#fff", fontSize: 16, fontWeight: "700", marginRight: 8 },
});

export default TipsModal;
