import ActivityForGoals from "./_components/acitivityForGoals";

const ActivityPage = async({ params }: { params: Promise<{ id: string }> }) => {
    const goalId = (await (params)).id;
    return (
        <div>
            <h1>Activity for Goal {goalId}</h1>
            <ActivityForGoals goalId={goalId}/>
        </div>
    );
};


export default ActivityPage;