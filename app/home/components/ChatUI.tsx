import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Bubble,
  Composer,
  GiftedChat,
  IMessage,
  InputToolbar,
} from "react-native-gifted-chat";
import Markdown from "react-native-markdown-display";
import { markdownStyles, markdownStylesSystem, styles } from "../styles";

type ChatUIProps = Readonly<{
  userName: string;
  messages: IMessage[];
  onSend: (msgs: IMessage[]) => void | Promise<void>;
  handleUploadDocument: () => void | Promise<void>;
  uploading: boolean;
}>;

export default function ChatUI({
  userName,
  messages,
  onSend,
  handleUploadDocument,
  uploading,
}: ChatUIProps): React.JSX.Element {
  function renderMessageText(props: any) {
    const text = props.currentMessage?.text ?? "";
    const isSystemMessage =
      props.currentMessage?.user?._id !== 1 &&
      props.currentMessage?.user?._id !== 2;

    return (
      <View
        style={[
          styles.messageTextContainer,
          isSystemMessage && styles.systemMessageTextContainer,
        ]}
      >
        <Markdown
          style={isSystemMessage ? markdownStylesSystem : markdownStyles}
          mergeStyle={false}
        >
          {text}
        </Markdown>
      </View>
    );
  }

  function renderBubble(props: any) {
    const isSystemMessage =
      props.currentMessage?.user?._id !== 1 &&
      props.currentMessage?.user?._id !== 2;

    if (isSystemMessage) {
      return (
        <View style={styles.systemBubbleContainer}>
          <View style={styles.systemBubble}>
            <Markdown style={markdownStylesSystem}>
              {props.currentMessage?.text}
            </Markdown>
          </View>
        </View>
      );
    }

    return (
      <Bubble
        {...props}
        wrapperStyle={{ right: styles.bubbleRight, left: styles.bubbleLeft }}
        textStyle={{
          right: styles.bubbleTextRight,
          left: styles.bubbleTextLeft,
        }}
        renderTicks={() => null}
      />
    );
  }

  const renderComposer = (props: any) => {
    const hasText = props.text && props.text.trim().length > 0;

    return (
      <View style={styles.composerContainer}>
        <TouchableOpacity
          onPress={handleUploadDocument}
          style={styles.uploadIconButtonLeft}
          accessible
          accessibilityLabel="Upload document"
        >
          {uploading ? (
            <ActivityIndicator size="small" color="#0b66c3" />
          ) : (
            <Ionicons name="attach-outline" size={22} color="#0b66c3" />
          )}
        </TouchableOpacity>

        <Composer
          {...props}
          textInputStyle={styles.composerText}
          placeholder="Ask me anything..."
          style={{ flex: 1 }}
        />

        {hasText && (
          <TouchableOpacity
            onPress={() => {
              if (props.onSend && props.text) {
                props.onSend({ text: props.text.trim() }, true);
              }
            }}
            style={styles.sendIconButton}
            accessible
            accessibilityLabel="Send message"
          >
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderInputToolbar = (props: any) => (
    <InputToolbar
      {...props}
      containerStyle={styles.inputToolbar}
      primaryStyle={styles.inputPrimary}
      renderActions={() => null}
    />
  );

  const renderAvatar = () => null;
  const messagesContainerStyle = useMemo(() => styles.messagesContainer, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(msgs) => onSend(msgs)}
      user={{ _id: 1, name: userName }}
      placeholder="Type your message..."
      showUserAvatar={false}
      renderUsernameOnMessage={false}
      renderBubble={renderBubble}
      renderMessageText={renderMessageText}
      renderSend={() => <View style={{ width: 0, height: 0 }} />}
      renderComposer={renderComposer}
      renderInputToolbar={renderInputToolbar}
      renderAvatar={renderAvatar}
      alwaysShowSend={false}
      messagesContainerStyle={messagesContainerStyle}
      alignTop
      bottomOffset={Platform.OS === "android" ? 10 : 0}
    />
  );
}
