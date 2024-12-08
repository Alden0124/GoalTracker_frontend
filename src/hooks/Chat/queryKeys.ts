export const queryKeys = {
  chat: {
    messages: (recipientId: string) => ["chat", "messages", recipientId],
  },
};  
