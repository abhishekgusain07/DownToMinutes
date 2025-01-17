import { Button } from "@/components/ui/button";
import { getSubgoalsOfGoals } from "@/utils/data/subgoals/getSubgoalsOfGoals";
import { Subgoal } from "@/utils/types";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

const Goal = async({ params }: 
    {
        params: Promise<{
            id: string
        }>
    }
) => {
    const goalId = ((await params).id);
    const { userId } = await auth();

    const subgoals: Subgoal[] | null = await getSubgoalsOfGoals({
        userId: userId!,
        goalId: goalId
    })

    return (
        <div>
            <div>{goalId}</div>
            <div>
                {
                    (subgoals === null || subgoals.length === 0) ? (
                        <h1>No subgoals currently</h1>
                    ) : (
                        <h1>Subgoals</h1>
                    )
                }
                {subgoals?.map((subgoal) => (
                    <div key={subgoal.id}>{subgoal.title}</div>
                ))}
            </div>

            <div className="mt-4">
                <Link href={`/goals/${goalId}/subgoals/new`}>
                    <Button>Add Subgoal</Button>
                </Link>
            </div>
        </div>
    )
}

export default Goal

