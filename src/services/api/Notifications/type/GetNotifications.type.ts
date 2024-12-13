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
  id: string;
  type: string;
  sender: {
    id: string;
    username: string;
    avatar: string;
  };
  goal: {
    id: string;
    title: string;
  };
  content: string;
  read: boolean;
  createdAt: string;
}

export interface NewNotification {
  notification: Notification;
  unreadCount: number;
}
export interface GetNotificationsQuery {
  page: number;
  limit: number;
}
