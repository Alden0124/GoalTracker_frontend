import { Goal as GoalType } from "@/services/api/Profile/ProfileGoals/type";
import Goal from "./Goal";

interface GoalListProps {
  goals: GoalType[];
  isCurrentUser: boolean;
}

const GoalList = ({ goals, isCurrentUser }: GoalListProps) => {
  return (
    <div className="flex flex-col gap-[20px] ">
      {goals.map((goal) => (
        <Goal key={goal._id} goal={goal} isCurrentUser={isCurrentUser} />
      ))}
    </div>
  );
};

GoalList.displayName = "GoalList";

export default GoalList;
