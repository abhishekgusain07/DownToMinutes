import CalendarView from "./_component/calendarView";
import { SortableActions } from "./_component/dndKit";

const ActionPlan = async ({params}: {params: Promise<{ id: string, taskId: string } >}) => {
    const goalId = (await params).id;
    const taskId = (await params).taskId;
    return (
        <div>
            Action Plan
            <div>
                <p>Goal Id: {goalId}</p>
                <p>Task Id: {taskId}</p>
                <CalendarView goalId={goalId} taskId={taskId} />
            </div>
        </div>
    )
}

export default ActionPlan