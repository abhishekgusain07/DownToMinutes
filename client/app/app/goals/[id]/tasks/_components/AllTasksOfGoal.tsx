"use client"

import { useEffect, useState } from "react";
import { Task, Subgoal } from "@/utils/types";
import { getTaskOfGoal } from "@/utils/data/task/getTaskOfGoal";
import { getSubgoalsOfGoals } from "@/utils/data/subgoals/getSubgoalsOfGoals";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateTaskDialog } from "../../../_components/CreateTaskDialog";
import CreateNewTaskDialog from "../../../_components/CreateNewTaskDIalog";
import { useRouter } from "next/navigation";
import { getTaskOfGoalWithActionPlan } from "@/utils/data/task/getTaskofGoalWithActionPlan";

interface AllTasksOfGoalProps {
    goalId: string;
}

const AllTasksOfGoal = ({ goalId }: AllTasksOfGoalProps) => {
    const [tasksWithPlanId, setTasksWithPlanId] = useState<(Task & {action_plan_id: string | null})[]>([]);
    const [subgoals, setSubgoals] = useState<Subgoal[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubgoalId, setSelectedSubgoalId] = useState<string>("all");
    const [filteredTasks, setFilteredTasks] = useState<(Task & {action_plan_id: string | null})[]>([]);
    const router = useRouter();
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tasksData, subgoalsData] = await Promise.all([
                    getTaskOfGoalWithActionPlan({ goalId }),
                    getSubgoalsOfGoals({ goalId })
                ]);
                
                setTasksWithPlanId(tasksData || []);
                setSubgoals(subgoalsData || []);
                setFilteredTasks(tasksData || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [goalId]);

    useEffect(() => {
        if (selectedSubgoalId === "all") {
            setFilteredTasks(tasksWithPlanId);
        } else {
            setFilteredTasks(tasksWithPlanId.filter(task => task.subgoal_id === selectedSubgoalId));
        }
    }, [selectedSubgoalId, tasksWithPlanId]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "NOT_STARTED":
                return "bg-gray-500";
            case "IN_PROGRESS":
                return "bg-blue-500";
            case "COMPLETED":
                return "bg-green-500";
            case "BLOCKED":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    const fetchTasks = async () => {
        try {
            const tasksData = await getTaskOfGoalWithActionPlan({ goalId });
            setTasksWithPlanId(tasksData || []);
            setFilteredTasks(tasksData || []);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin h-8 w-8" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between  items-center">

                <Select
                    value={selectedSubgoalId}
                    onValueChange={setSelectedSubgoalId}
                >
                    <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Filter by Subgoal" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Tasks</SelectItem>
                        {subgoals.map((subgoal) => (
                            <SelectItem key={subgoal.id} value={subgoal.id}>
                                {subgoal.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <CreateNewTaskDialog goalId={goalId} subgoals={subgoals} onTaskCreated={fetchTasks} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTasks.length === 0 ? (
                    <div className="col-span-full text-center py-10">
                        <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {selectedSubgoalId === "all" 
                                ? "Start by creating some tasks for this goal." 
                                : "No tasks found for this subgoal."}
                        </p>
                    </div>
                ) : (
                    filteredTasks.map((task) => (
                        <Card key={task.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-lg">{task.title}</CardTitle>
                                <CardDescription>
                                    {task.description || "No description provided"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Badge className={getStatusColor(task.status)}>
                                            {task.status.replace(/_/g, " ")}
                                        </Badge>
                                        <div>
                                        <p className="text-sm text-gray-500">
                                            Estimated Hours: {task.estimated_hours}h
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Hours Spent: {task.actual_hours}h
                                        </p>
                                        <div className="flex space-x-2 mt-2">
                                            <Button variant="default" size="sm"
                                                onClick={() => {
                                                    task.action_plan_id ?
                                                    router.push(`/app/goals/${goalId}/tasks/${task.id}/view/${task.action_plan_id}`)
                                                    :
                                                    router.push(`/app/goals/${goalId}/tasks/${task.id}/create-plan`)
                                                }}
                                            >
                                                {
                                                    task.action_plan_id ? "Manage Plan" : "Create Plan"
                                                }
                                            </Button>
                                            {
                                                task.action_plan_id &&  <Button variant="default" size="sm"
                                                onClick={() => {
                                                    router.push(`/app/goals/${goalId}/tasks/${task.id}/view/${task.action_plan_id}`)
                                                }}
                                            >
                                                {
                                                    task.action_plan_id && "View Progress"
                                                }
                                            </Button>
                                            }
                                        </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        Due: {format(new Date(task.due_date), "PPP")}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default AllTasksOfGoal;