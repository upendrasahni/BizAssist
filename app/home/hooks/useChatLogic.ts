import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { GiftedChat, IMessage } from "react-native-gifted-chat";

import {
    appendSessionMessage, getDocumentContext,
    setDocumentContext,
    setSessionMessages,
} from "@/app/services/chatStorageService";
import { pickDocument } from "@/app/services/documentService";
import {
    askGeminiWithFile,
    deleteUploadedFile,
    generateText,
    uploadPdfToGemini,
    waitForFileActive,
} from "@/app/services/geminiPdfService";
import { saveUserChatHistory } from "@/app/services/userContext";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import { Router } from "expo-router";

type UseChatLogicParams = {
  userName: string;
  currentUserId: string | null;
  messages: IMessage[];
  setMessages: (msgs: IMessage[] | ((prev: IMessage[]) => IMessage[])) => void;
  router: Router;
};

export function useChatLogic({
  userName,
  currentUserId,
  messages,
  setMessages,
  router,
}: UseChatLogicParams) {
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [documentContextState, setDocumentContextState] = useState<any>(getDocumentContext());

  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      if (!newMessages || newMessages.length === 0) return;
      const userMessage = newMessages[0].text;
      setMessages((prev) => GiftedChat.append(prev, newMessages));
      appendSessionMessage(newMessages[0]);

      setLoading(true);
      try {
        let aiResponseText: string;

        if (documentContextState?.geminiFileName) {
          aiResponseText = await askGeminiWithFile(documentContextState.geminiFileName, userMessage);
        } else {
          const currentMessages = GiftedChat.append(messages, newMessages);
          aiResponseText = await generateText(userMessage, currentMessages);
        }

        const aiMessage: IMessage = {
          _id: Math.random().toString(),
          text: aiResponseText,
          createdAt: new Date(),
          user: { _id: 2, name: "BizAssist" },
        };

        setMessages((prev) => GiftedChat.append(prev, [aiMessage]));
        appendSessionMessage(aiMessage);
      } catch (err) {
        // keep console logging as in your original code
        // eslint-disable-next-line no-console
        console.error("AI error", err);
        Alert.alert("Error", "Failed to get AI response");
      }
      setLoading(false);
    },
    // keep dependencies same as original
    [messages, documentContextState, setMessages]
  );

  const deleteTheSession = async () => {
    Alert.alert("Delete", "Are you sure you want to delete the chat?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          (async () => {
            try {
              if (documentContextState?.geminiFileName) {
                await deleteUploadedFile(documentContextState.geminiFileName);
              }

              setMessages([]);
              setDocumentContextState(null);
              setSessionMessages([]);

              if (currentUserId) {
                await saveUserChatHistory(currentUserId, []);
              }

              setMessages([
                {
                  _id: Math.random().toString(),
                  text: `Hello ${userName}! 👋 I'm BizAssist, ready to start a new chat.`,
                  createdAt: new Date(),
                  user: { _id: 2, name: "BizAssist" },
                },
              ]);

              Alert.alert("Deleted", "Chat session has been deleted.");
            } catch (err) {
              // eslint-disable-next-line no-console
              console.error("Delete session error:", err);
              Alert.alert("Error", "Failed to delete chat session.");
            }
          })();
        },
      },
    ]);
  };

  const handleUploadDocument = async () => {
    try {
      setUploading(true);
      const result = await pickDocument();
      if (result.canceled) {
        setUploading(false);
        return;
      }
      const fileUri = result.uri!;
      const fileName = result.name || `document_${Date.now()}.pdf`;
      let uploadedFile;
      try {
        uploadedFile = await uploadPdfToGemini(fileUri, fileName);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Gemini upload failed", err);
        setUploading(false);
        Alert.alert("Upload Error", "Failed to upload PDF to Gemini");
        return;
      }

      const docContext = {
        fileName,
        fileType: "application/pdf",
        geminiFileName: uploadedFile.name,
        geminiMimeType: uploadedFile.mimeType,
        firebaseUrl: undefined,
        uploadedAt: new Date().toISOString(),
      };

      setDocumentContext(docContext);
      setDocumentContextState(docContext);

      const processingMessage: IMessage = {
        _id: Math.random().toString(),
        text: `📄 Document "**${fileName}**" uploaded. Please wait while Gemini processes the PDF...`,
        createdAt: new Date(),
        user: { _id: 2, name: "BizAssist" },
      };
      setMessages((prev) => GiftedChat.append(prev, [processingMessage]));
      appendSessionMessage(processingMessage);

      try {
        await waitForFileActive(uploadedFile.name);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Gemini wait for active failed", err);
        Alert.alert("Processing Error", `PDF processing failed: ${(err as Error).message}. File will be deleted.`);
        await deleteUploadedFile(uploadedFile.name);
        setDocumentContextState(null);
        setUploading(false);
        return;
      }

      const finalSystemMessage: IMessage = {
        _id: Math.random().toString(),
        text: `✅ Document "**${fileName}**" is ready! You can now ask me any questions about this document.`,
        createdAt: new Date(),
        user: { _id: 2, name: "BizAssist" },
      };
      setMessages((prev) => GiftedChat.append(prev, [finalSystemMessage]));
      appendSessionMessage(finalSystemMessage);

      setUploading(false);
      Alert.alert("Success", `Document "${fileName}" is ready for questions.`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Upload error", err);
      setUploading(false);
      Alert.alert("Error", "Failed to upload document");
    }
  };

const handleExportPDF = async () => {
  try {
    const escapeHtml = (unsafe: string) =>
      unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const markdownToHtml = (text: string) => {
      if (!text) return "";
      let t = escapeHtml(text);

      // Code blocks
      t = t.replace(/```([\s\S]*?)```/g, (_m, code) => {
        return `<pre class="code-block"><code>${code.replace(
          /</g,
          "&lt;"
        )}</code></pre>`;
      });
      // Inline code
      t = t.replace(/`([^`]+)`/g, "<code class='inline-code'>$1</code>");
      // Bold
      t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      t = t.replace(/__([^_]+)__/g, "<strong>$1</strong>");
      // Italic
      t = t.replace(/\*([^*]+)\*/g, "<em>$1</em>");
      t = t.replace(/_([^_]+)_/g, "<em>$1</em>");
      // Paragraphs and line breaks
      t = t.replace(/\n{2,}/g, "</p><p>");
      t = t.replace(/\n/g, "<br>");

      return `<p>${t}</p>`;
    };

    // Sort messages in chronological order (oldest first)
    const sortedMessages = [...messages].reverse();

    const messagesHtml = sortedMessages
      .map((m, index) => {
        // Sender logic
        let sender: string;
        if (m.user?.name) {
          sender = m.user.name;
        } else if (m.user?._id === 1) {
          sender = "You";
        } else if (m.user?._id === 2) {
          sender = "BizAssist";
        } else {
          sender = "User";
        }

        // Message class
        let whoClass: string;
        if (m.user?._id === 1) {
          whoClass = "message user";
        } else if (m.user?._id === 2) {
          whoClass = "message bot";
        } else {
          whoClass = "message system";
        }

        const time = m.createdAt
          ? new Date(m.createdAt).toLocaleString()
          : new Date().toLocaleString();

        const htmlText = markdownToHtml(
          typeof m.text === "string" ? m.text : ""
        );

        return `
        <div class="${whoClass}" data-message-id="${index}">
          <div class="bubble">
            <div class="bubble-content">${htmlText}</div>
            <div class="meta">
              <span class="sender">${escapeHtml(sender)}</span>
              <span class="time">${escapeHtml(time)}</span>
            </div>
          </div>
        </div>
      `;
      })
      .join("\n");

    // Document box HTML
    const docCtx = documentContextState;
    const docBoxHtml = docCtx
      ? `<div class="doc-box">
        <div class="doc-title">📄 Document: ${escapeHtml(
          docCtx.fileName
        )}</div>
        <div class="doc-meta">Uploaded: ${new Date(
          docCtx.uploadedAt
        ).toLocaleString()}</div>
      </div>`
      : "";

    const html = `
    <!doctype html>
    <html>
    <head>
      <meta charset="utf-8" />
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        @page {
          size: A4;
          margin: 15mm;
        }
        
        html, body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          background: #ffffff;
          color: #1a1a1a;
          font-size: 13px;
          line-height: 1.5;
        }
        
        body {
          padding: 10px;
        }
        
        header.top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 2px solid #0b66c3;
          page-break-after: avoid;
        }
        
        h1 {
          margin: 0;
          font-size: 20px;
          color: #0b66c3;
          font-weight: 700;
        }
        
        .generated {
          font-size: 10px;
          color: #64748b;
        }
        
        .doc-box {
          border-left: 4px solid #06b6d4;
          background: #f0f9ff;
          padding: 12px;
          margin-bottom: 16px;
          border-radius: 4px;
          page-break-after: avoid;
          page-break-inside: avoid;
        }
        
        .doc-title {
          font-weight: 700;
          color: #0b2632;
          margin-bottom: 4px;
          font-size: 14px;
        }
        
        .doc-meta {
          font-size: 11px;
          color: #64748b;
        }
        
        .chat {
          display: block;
          width: 100%;
        }
        
        .message {
          margin-bottom: 12px;
          page-break-inside: avoid;
          width: 100%;
          clear: both;
        }
        
        .message.user {
          text-align: right;
        }
        
        .message.bot {
          text-align: left;
        }
        
        .message.system {
          text-align: center;
        }
        
        .bubble {
          display: inline-block;
          max-width: 85%;
          padding: 10px 14px;
          border-radius: 10px;
          text-align: left;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .message.user .bubble {
          background: linear-gradient(135deg, #0b66c3, #06b6d4);
          color: #ffffff;
          border-bottom-right-radius: 3px;
        }
        
        .message.bot .bubble {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #0b2632;
          border-bottom-left-radius: 3px;
        }
        
        .message.system .bubble {
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #92400e;
          max-width: 90%;
        }
        
        .bubble-content {
          font-size: 13px;
          line-height: 1.6;
          word-wrap: break-word;
          overflow-wrap: break-word;
          white-space: normal;
        }
        
        .bubble-content p {
          margin: 0 0 8px 0;
        }
        
        .bubble-content p:last-child {
          margin-bottom: 0;
        }
        
        .meta {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 6px;
          font-size: 10px;
        }
        
        .message.user .meta {
          color: rgba(255, 255, 255, 0.85);
        }
        
        .message.bot .meta {
          color: #64748b;
        }
        
        .sender {
          font-weight: 600;
        }
        
        .time {
          opacity: 0.85;
        }
        
        pre.code-block {
          background: #1e293b;
          color: #f1f5f9;
          padding: 10px;
          border-radius: 4px;
          overflow-x: auto;
          font-family: "Courier New", Courier, monospace;
          font-size: 11px;
          line-height: 1.4;
          margin: 6px 0;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        
        code.inline-code {
          background: rgba(0, 0, 0, 0.08);
          padding: 2px 5px;
          border-radius: 3px;
          font-family: "Courier New", Courier, monospace;
          font-size: 12px;
        }
        
        .message.user code.inline-code {
          background: rgba(255, 255, 255, 0.25);
        }
        
        strong {
          font-weight: 700;
        }
        
        em {
          font-style: italic;
        }
        
        .footer {
          position: fixed;
          bottom: 8px;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 9px;
          color: #94a3b8;
        }
        
        @media print {
          body {
            background: white;
            padding: 0;
          }
          
          .message {
            page-break-inside: avoid;
          }
          
          .bubble {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <header class="top">
        <h1>BizAssist Chat Transcript</h1>
        <div class="generated">Generated: ${new Date().toLocaleString()}</div>
      </header>

      ${docBoxHtml}
      
      <div class="chat">${messagesHtml}</div>

      <div class="footer">
        BizAssist Chat Export • ${new Date().toLocaleDateString()} • Confidential
      </div>
    </body>
    </html>
  `;

    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert("Error", "Sharing is not available on this device");
      return;
    }

    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });

    await Sharing.shareAsync(uri, {
      mimeType: "application/pdf",
      dialogTitle: "Share BizAssist Chat Transcript",
      UTI: "com.adobe.pdf",
    });

    Alert.alert("Success", "Chat transcript exported successfully!");
  } catch (err) {
    console.error("Export error", err);
    Alert.alert("Error", `Failed to export: ${(err as Error).message || "Unknown error"}`);
  }
};

  const handleLogout = async () => {
    Alert.alert("Logout", "Do you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => router.replace("/auth/login"),
      },
    ]);
  };

  return {
    onSend,
    deleteTheSession,
    handleUploadDocument,
    handleExportPDF,
    handleLogout,
    loading,
    uploading,
    documentContextState,
  } as const;
}
