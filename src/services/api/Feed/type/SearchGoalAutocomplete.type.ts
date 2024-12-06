export interface SearchGoalAutocompleteResponse {
  suggestions: {
    goals: Goal[] | [];
    users: User[] | [];
  }
  message: string;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  type: "user";
}

export interface Goal {
  type: "goal";
  id: string;
  title: string;
}

export interface SearchGoalAutocompleteQuery {
  q: string;
  limit?: number;
  type: "all" | "goal" | "user";
}
