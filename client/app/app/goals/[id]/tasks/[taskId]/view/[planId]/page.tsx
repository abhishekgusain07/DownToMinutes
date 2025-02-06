import UpdateTaskActionPlanPage from "../../../_components/UpdateTaskActionPlanPage";

const TaskActionPlanPage = async({ params }: { params: Promise<{ id: string, taskId: string, planId: string } >}) => {
    const planId = (await params).planId;
    const goalId = (await params).id;
    const taskId = (await params).taskId;
    return (
        <div className="min-h-screen min-w-screen p-5 m-5">
            <UpdateTaskActionPlanPage goalId={goalId} taskId={taskId} planId={planId}/>
        </div>
    )
}


export default TaskActionPlanPage;