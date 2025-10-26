import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from './types';

const USER_CONTEXT_KEY = '@user_context';
const USER_CHAT_HISTORY_KEY = '@user_chat_history_';

/**
 * Save user context to AsyncStorage when user logs in
 */
export async function setUserContext(userContext: UserContext): Promise<void> {
  try {
    await AsyncStorage.setItem(USER_CONTEXT_KEY, JSON.stringify(userContext));
  } catch (error) {
    console.error('Error saving user context:', error);
    throw error;
  }
}

/**
 * Get current user context
 */
export async function getUserContext(): Promise<UserContext | null> {
  try {
    const data = await AsyncStorage.getItem(USER_CONTEXT_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user context:', error);
    return null;
  }
}

/**
 * Clear user context on logout
 */
export async function clearUserContext(): Promise<void> {
  try {
    await AsyncStorage.removeItem(USER_CONTEXT_KEY);
  } catch (error) {
    console.error('Error clearing user context:', error);
  }
}

/**
 * Generate system prompt with user context for Gemini
 */
export function generateSystemPromptWithUserContext(userContext: UserContext): string {
  return `You are BizAssist, a helpful business assistant AI. You are currently chatting with:
- Name: ${userContext.name}
- Email: ${userContext.email}
- User ID: ${userContext.userId}
- Login Time: ${new Date(userContext.loginTime).toLocaleString()}

Important instructions:
- When the user asks "what is my name" or "who am I", respond with their name: "${userContext.name}"
- When asked about their email, respond with: "${userContext.email}"
- Personalize your responses using their name when appropriate
- Remember all conversation context from this session
- Be professional, helpful, and friendly

The user may upload documents for analysis. When a document is uploaded, you can answer questions about its content.`;
}

/**
 * Save chat history for a specific user
 */
export async function saveUserChatHistory(userId: string, messages: any[]): Promise<void> {
  try {
    await AsyncStorage.setItem(
      `${USER_CHAT_HISTORY_KEY}${userId}`,
      JSON.stringify(messages)
    );
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
}

/**
 * Load chat history for a specific user
 */
export async function loadUserChatHistory(userId: string): Promise<any[]> {
  try {
    const data = await AsyncStorage.getItem(`${USER_CHAT_HISTORY_KEY}${userId}`);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
}

/**
 * Clear chat history for a specific user
 */
export async function clearUserChatHistory(userId: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(`${USER_CHAT_HISTORY_KEY}${userId}`);
  } catch (error) {
    console.error('Error clearing chat history:', error);
  }
}