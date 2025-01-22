import SubgoalForm from "@/app/app/goals/_componenet/subgoalform";

const NewSubgoal = async ({ params }: {
    params: Promise<{
        id: string
    }>
}) => {
    const goalId = ((await params).id);

    return (
        <div>
            <h1>Create New Subgoal for Goal {goalId}</h1>
            <SubgoalForm goalId={goalId} />
        </div>
    )
}

export default NewSubgoal