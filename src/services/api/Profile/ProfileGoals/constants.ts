import { GetCommentsQuery, GetUserGoalsParams } from "./type";

export const DEFAULT_GOALS_PARAMS: GetUserGoalsParams = {
  page: 1,
  limit: 10,
  sort: "-createdAt",
  status: "",
};

export const DEFAULT_COMMENTS_PARAMS: GetCommentsQuery = {
  page: 1,
  limit: 100,
  parentId: "",
  type: "progress",
};
