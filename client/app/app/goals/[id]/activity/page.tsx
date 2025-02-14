import ActivityForGoals from "./_components/acitivityForGoals";

const ActivityPage = async({ params }: { params: Promise<{ id: string }> }) => {
    const goalId = (await (params)).id;
    return (
        <div className="w-full h-screen flex flex-col gap-2 items-center justify-center">
            <h1>Activity for Goal {goalId}</h1>
            <ActivityForGoals goalId={goalId}/>
        </div>
    );
};


export default ActivityPage;