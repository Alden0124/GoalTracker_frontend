export interface ReceiveMessage {
  content: string;
  messageId: string;
  sender: {
    id: string;
    username: string;
    avatar: string | null;
  };
  timestamp: string;
}
