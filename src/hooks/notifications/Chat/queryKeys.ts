import { GetNotificationsQuery } from "@/services/api/Notifications/type";

export const queryKeys = {
  notifications: {
    notifications: (query: GetNotificationsQuery) => ["notifications", query],
  },
};
