import { Frequency, Goal as GoalType, Subgoal } from "@/utils/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HomeIcon, Plus } from "lucide-react";
import { getGoal } from "@/utils/data/goals/getGoal";
import { getSubgoalsOfGoals } from "@/utils/data/subgoals/getSubgoalsOfGoals";
import { auth } from "@clerk/nextjs/server";
import PageHeaders from "@/app/app/_componenets/PageHeaders";
import { SubgoalCard } from "../../_components/SubgoalCard";
import SubgoalsDisplay from "../../_components/subgoalSection";
import { CreateNewSubGoalDialog } from "../../_components/CreateNewSubGoalDialog";

const Goal = async({ params }: 
    {
        params: Promise<{ id: string }>
    }
) => {
    const { userId } = await auth();
    if (!userId) return null;

    const goalId = (await params).id;
    const goal = await getGoal(goalId);
    const subgoals: Subgoal[] | null = await getSubgoalsOfGoals({
        userId,
        goalId
    });

    if (!goal) {
        return <div>Goal not found</div>;
    }

    // Group subgoals by frequency
    const groupedSubgoals = subgoals?.reduce((acc, subgoal) => {
        const frequency = subgoal.frequency;
        if (!acc[frequency]) {
            acc[frequency] = [];
        }
        acc[frequency].push(subgoal);
        return acc;
    }, {} as Record<Frequency, Subgoal[]>);

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">{goal.title}</h1>
                    <p className="text-muted-foreground">{goal.description}</p>
                </div>
                <CreateNewSubGoalDialog goalId={goalId} />
            </div>
            <PageHeaders>
                <div className="mt-3 flex gap-1 justify-start items-center">
                    <Link href="/app/goals">
                        <Button variant="ghost">
                            <HomeIcon className="mr-2 h-4 w-4" />
                            Home
                        </Button>
                    </Link>
                </div>
            </PageHeaders>
            <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-fit" style={{ gridTemplateColumns: `repeat(${Object.keys(Frequency).length + 1}, minmax(0, 1fr))` }}>
                    <TabsTrigger value="all">All Subgoals</TabsTrigger>
                    {Object.values(Frequency).map((freq) => (
                        <TabsTrigger key={freq} value={freq.toLowerCase()}>{freq}</TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="all" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {!subgoals || subgoals.length === 0 ? (
                            <div className="col-span-full text-center py-10">
                                <h2 className="text-xl font-medium text-neutral-400">No subgoals currently</h2>
                                <p className="text-neutral-500 mt-2">Create your first subgoal to get started</p>
                            </div>
                        ) : (
                            subgoals.map((subgoal) => (
                                <SubgoalCard 
                                    key={subgoal.id} 
                                    subgoal={subgoal} 
                                    goalId={goalId} 
                                />
                            ))
                        )}
                    </div>
                </TabsContent>

                {Object.entries(groupedSubgoals || {}).map(([frequency, subgoals]) => (
                    <TabsContent key={frequency} value={frequency.toLowerCase()} className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {subgoals.map((subgoal) => (
                                <SubgoalCard 
                                    key={subgoal.id} 
                                    subgoal={subgoal} 
                                    goalId={goalId} 
                                />
                            ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>

            <SubgoalsDisplay goalId={goalId} />
        </div>
    )
}

export default Goal
