import AllTasksOfGoal from "./_components/AllTasksOfGoal";

const Task = async ({ params }: { params: Promise<{ id: string } > }) => {
    const goalId = (await params).id;
    return (
        <div>
            <div className="min-h-screen min-w-screen p-5 m-5">
                <AllTasksOfGoal goalId={goalId}/>
            </div>
        </div>
    )
};  

export default Task;