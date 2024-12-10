import { Goal as GoalType } from "@/services/api/Profile/ProfileGoals/type";
import { memo } from "react";
import Goal from "./Goal";

interface GoalListProps {
  goals: GoalType[];
}

const GoalList = memo(({ goals }: GoalListProps) => {
  return (
    <div className="flex flex-col gap-[20px] ">
      {goals.map((goal) => (
        <Goal key={goal._id} goal={goal} />
      ))}
    </div>
  );
});

GoalList.displayName = "GoalList";

export default GoalList;
