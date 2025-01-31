"use client"

import { Button } from "@/components/ui/button"
import { getTaskOfSubgoal } from "@/utils/data/task/getTaskOfSubgoal"
import { Task } from "@/utils/types"
import { Bookmark, BookmarkCheck, Check, Loader2, PlusIcon, Router } from "lucide-react"
import { useEffect, useState } from "react"
import PageHeaders from "../../_componenets/PageHeaders"
import { CreateTaskDialog } from "./CreateTaskDialog"
import { getSubgoalStatus } from "@/utils/data/subgoals/getSubgoalStatus"
import { toast } from "sonner"
import { markSubGoalCompleted } from "@/utils/data/subgoals/markSubGoalCompleted"
import { useRouter } from "next/navigation"

interface AllTasksOfSubgoalProps {
    subgoalId: string,
    goalId: string
}
const AllTasksOfSubgoal = ({ subgoalId, goalId }: AllTasksOfSubgoalProps) => {
    const [isTasksLoading, setIsTasksLoading] = useState<boolean>(false)
    const [tasks, setTasks] = useState<Task[] | null>(null)
    const [isSubGoalCompleted, setIsSubGoalCompleted] = useState<Boolean>(false)
    const [statusLoading, setStatusLoading] = useState<Boolean>(false)
    const [isMarking, setIsMarking] = useState<Boolean>(false);

    const router = useRouter();

    useEffect(() => {
        const fetchTasks = async () => {
            setIsTasksLoading(true)
            try {
                const tasks = await getTaskOfSubgoal({subgoalId, goalId})
                setTasks(tasks)
            } catch (error) {
                console.error("Error fetching tasks:", error);
            } finally {
                setIsTasksLoading(false)
            }
        }
        const fetchSubgoalStatus = async() => {
            setStatusLoading(true);
            try{
                const res = await getSubgoalStatus({goalId, subgoalId});
                setIsSubGoalCompleted(res);
            }catch(error) {
                console.log("Failed to load status of task ", error)
            }finally{
                setStatusLoading(false);
            }
        }
        fetchTasks()
        fetchSubgoalStatus()
    }, [goalId, subgoalId])
    const handleTaskCreated = async () => {
        const fetchTasks = async () => {
            setIsTasksLoading(true)
            try {
                const tasks = await getTaskOfSubgoal({subgoalId, goalId})
                setTasks(tasks)
            } catch (error) {
                console.error("Error fetching tasks:", error);
            } finally {
                setIsTasksLoading(false)
            }
        }
        fetchTasks()
    }
    const markCompleted =  async() => {
        setIsMarking(true);
        try{
            await markSubGoalCompleted({goalId, subgoalId});
            toast.success("Subgoal Marked Completed")
            setIsSubGoalCompleted(true);
            router.refresh();
        }catch(error) {
            toast.error("Error while marking completed ‼️")
        }finally{
            setIsMarking(false);
        }
    }
    return (
        <div className="max-w-8xl mx-auto">
            <div className="flex flex-col justify-center h-full w-full p-5 m-5">
                <PageHeaders>
                    <div><h1 className="text-xl font-semibold">Navigation</h1></div>
                    <div className="flex justify-center items-center gap-2">
                        <CreateTaskDialog subgoalId={subgoalId} onTaskCreated={handleTaskCreated} goalId={goalId}/>
                        <Button variant="default" onClick={markCompleted} disabled={statusLoading == true || (isSubGoalCompleted && isSubGoalCompleted==true)}>
                            {
                                statusLoading == true ? "Loading " : isMarking ? "Marking" : isSubGoalCompleted == true
                                ? "Completed" : "Mark Completed"
                            }
                            {
                                (isMarking || statusLoading ) && <Loader2 className="size-4 animate-spin" />
                            }
                        </Button>
                    </div>
                </PageHeaders>
                <div className="w-full h-full text-center items-center mx-2">   
                    <h1 className="text-3xl font-semibold">All Tasks of Subgoal {subgoalId}</h1><br/>
                </div>
                <div className="mt-2">
                    {isTasksLoading ? (
                        <div className="flex justify-center items-center gap-2">
                            <p>Loading tasks</p>
                            <Loader2 className="animate-spin" />
                        </div>
                    ) : (
                        tasks && tasks.length > 0 ? (
                            tasks.map((task) => (
                                <div key={task.id} className="bg-white p-4 mb-4 rounded-md">
                                    <p className="text-lg font-semibold">{task.title}</p>
                                </div>
                            ))
                        ) : (
                            <div className="flex justify-center items-center gap-2">
                                <p>No tasks found</p><br/>
                                <CreateTaskDialog subgoalId={subgoalId} onTaskCreated={handleTaskCreated} goalId={goalId} />
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}
export default AllTasksOfSubgoal;