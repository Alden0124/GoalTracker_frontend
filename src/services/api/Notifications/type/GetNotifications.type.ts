export interface GetNotificationsResponse {
  notifications: Notification[];
  pagination: {
    current: number;
    size: number;
    total: number;
  };
  unreadCount: number;
}

export interface Notification {
  _id: string;
  recipient: string;
  sender: {
    _id: string;
    username: string;
    avatar: string;
  };
  type: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  content: string;
}

export interface GetNotificationsQuery {
  page: number;
  limit: number;
}
