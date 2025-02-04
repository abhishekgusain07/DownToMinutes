import CalendarView from "./_component/calendarView";
import { SortableActions } from "./_component/dndKit";

const ActionPlan = async ({params}: {params: Promise<{ id: string, taskId: string } >}) => {
    const goalId = (await params).id;
    const taskId = (await params).taskId;
    return (
        <div className="min-h-screen min-w-screen p-5 m-5">
                <CalendarView goalId={goalId} taskId={taskId} />
        </div>
    )
}

export default ActionPlan