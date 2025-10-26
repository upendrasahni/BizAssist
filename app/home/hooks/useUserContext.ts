import { setSessionMessages } from "@/app/services/chatStorageService";
import { getUserContext, loadUserChatHistory, saveUserChatHistory } from "@/app/services/userContext";
import { useEffect, useState } from "react";
import { IMessage } from "react-native-gifted-chat";

/**
 * Hook that loads user context and chat history and persists messages.
 * Logic is the same as your original file; moved here for separation.
 */
export function useUserContext() {
  const [userName, setUserName] = useState<string>("User");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    const loadUserData = async () => {
      const userContext = await getUserContext();
      if (userContext) {
        setCurrentUserId(userContext.userId);
        setUserName(userContext.name);

        const history = await loadUserChatHistory(userContext.userId);
        if (history && history.length > 0) {
          setMessages(history);
        } else {
          const welcomeMessage: IMessage = {
            _id: Math.random().toString(),
            text: `Hello ${userContext.name}! 👋 I'm BizAssist, your personal business assistant. How can I help you today?`,
            createdAt: new Date(),
            user: { _id: 2, name: "BizAssist" },
          };
          setMessages([welcomeMessage]);
        }
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      // persist history each time messages change (same as original logic)
      saveUserChatHistory(currentUserId, messages);
      setSessionMessages(messages);
    }
  }, [messages, currentUserId]);

  return { userName, currentUserId, messages, setMessages } as const;
}
