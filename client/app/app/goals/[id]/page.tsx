import { Button } from "@/components/ui/button";
import { getSubgoalsOfGoals } from "@/utils/data/subgoals/getSubgoalsOfGoals";
import { Frequency, Goal as GoalType, Subgoal } from "@/utils/types";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import SubgoalsDisplay from "../_components/subgoalSection";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { getGoal } from "@/utils/data/goals/getGoal";

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
                    <h1 className="text-2xl font-semibold">{goal?.title}</h1>
                    <p className="text-muted-foreground">{goal?.description}</p>
                </div>
                <Button asChild>
                    <Link href={`/app/goals/${goalId}/subgoals/new`} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Subgoal
                    </Link>
                </Button>
            </div>

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
                                <div key={subgoal.id} className="bg-card p-4 rounded-lg border">
                                    <h3 className="font-medium">{subgoal.title}</h3>
                                    <p className="text-sm text-muted-foreground">{subgoal.description}</p>
                                    <div className="mt-2">
                                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                            {subgoal.frequency}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </TabsContent>

                {Object.entries(groupedSubgoals || {}).map(([frequency, subgoals]) => (
                    <TabsContent key={frequency} value={frequency.toLowerCase()} className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {subgoals.map((subgoal) => (
                                <div key={subgoal.id} className="bg-card p-4 rounded-lg border">
                                    <h3 className="font-medium">{subgoal.title}</h3>
                                    <p className="text-sm text-muted-foreground">{subgoal.description}</p>
                                    <div className="mt-2">
                                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                            {subgoal.frequency}
                                        </span>
                                    </div>
                                </div>
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
