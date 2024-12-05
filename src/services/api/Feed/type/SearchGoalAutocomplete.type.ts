export interface SearchGoalAutocompleteResponse {
  goals: Goal[] | [];
  users: User[] | [];
  message: string;
}

interface User {
  id: string;
  username: string;
  avatar: string;
  type: "user";
}

interface Goal {
  type: "goal";
  id: string;
  title: string;
}

export interface SearchGoalAutocompleteQuery {
  q: string;
  limit?: number;
  type: "all" | "goal" | "user";
}
