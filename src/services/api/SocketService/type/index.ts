export interface ReceiveMessage {
  content: string;
  id: string;
  sender: {
    id: string;
    username: string;
    avatar: string | null;
  };
  timestamp: string;
}
