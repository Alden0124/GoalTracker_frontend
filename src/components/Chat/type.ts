export interface Message {
  id?: string;
  content: string;
  isCurrentUser: boolean;
  sender: {
    id: string;
    avatar?: string;
  };
  timestamp: string;
}
