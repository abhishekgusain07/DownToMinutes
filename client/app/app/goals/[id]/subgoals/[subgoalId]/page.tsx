import AllTasksOfSubgoal from "../../../_components/AllTaskOfSubgoal";

const SingleSubgoalPage = async (
    { params }: { params: Promise<{ id: string, subgoalId: string }> }
) => {
    const subgoalId = (await params).subgoalId;
    const goalId = (await params).id;
    return (
        <div className="max-w-8xl mx-auto">
            <div className="min-h-screen min-w-screen p-5 m-5">
                <AllTasksOfSubgoal subgoalId={subgoalId} goalId={goalId}/>
            </div>
            
        </div>
    )
}
export default SingleSubgoalPage;