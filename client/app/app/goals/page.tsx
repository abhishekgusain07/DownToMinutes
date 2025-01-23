import { Button } from "@/components/ui/button";
import { fetchUserGoals } from "@/utils/data/user/fetchUserGoals";
import { Goal } from "@/utils/types";
import { currentUser } from "@clerk/nextjs/server";
import { GoalCard } from "./_components/GoalCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import Link from "next/link";

const Goals = async () => {
    const user = await currentUser();
    if (!user) {
        return null;
    }

    const goals: (Goal[] | null) = await fetchUserGoals({ userId: user?.id! });

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Goals Management</h1>
                <Button asChild>
                    <Link href="/app/goals/new" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add New Goal
                    </Link>
                </Button>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid grid-cols-5 w-fit">
                    <TabsTrigger value="all">All Goals</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
                    <TabsTrigger value="yearly">Yearly</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals === null || goals.length === 0 ? (
                    <div className="col-span-full text-center py-10">
                        <h2 className="text-xl font-medium text-neutral-400">No goals currently</h2>
                        <p className="text-neutral-500 mt-2">Create your first goal to get started</p>
                    </div>
                ) : (
                    goals.map((goal) => (
                        <GoalCard key={goal.id} goal={goal} />
                    ))
                )}
            </div>
        </div>
    );
}

export default Goals;