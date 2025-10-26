import { IMessage } from 'react-native-gifted-chat';

let inMemoryMessages: IMessage[] = [];
let inMemoryDocumentContext: any = null;

export function getSessionMessages(): IMessage[] {
  return inMemoryMessages;
}

export function setSessionMessages(msgs: IMessage[]) {
  inMemoryMessages = msgs;
}

export function appendSessionMessage(msg: IMessage) {
  inMemoryMessages = [...inMemoryMessages, msg];
}

export function clearSession() {
  inMemoryMessages = [];
  inMemoryDocumentContext = null;
}

export function setDocumentContext(ctx: any) {
  inMemoryDocumentContext = ctx;
}

export function getDocumentContext() {
  return inMemoryDocumentContext;
}