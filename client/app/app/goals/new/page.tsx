"use client"

import { useForm } from "react-hook-form"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createGoal } from "@/utils/data/goals/createGoal"
import { toast } from "sonner"
import { Goal, Priority, ProgressType } from "@/utils/types"
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

type FormData = {
    title: string
    description?: string
    priority: Priority
    start_date: string
    end_date: string
    progress_type: ProgressType
    current_progress?: number
}

const NewGoal = ({onSuccess}:{onSuccess: () => void}) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<FormData>({
        defaultValues: {
            priority: Priority.MEDIUM,
            progress_type: ProgressType.TASK_BASED,
            current_progress: 0
        }
    })

    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true)
            const goal: Goal | null = await createGoal({
                ...data,
                start_date: new Date(data.start_date),
                end_date: new Date(data.end_date),
                current_progress: Number(data.current_progress) || 0
            })
            router.refresh()
            onSuccess()
            toast.success("Goal created successfully")
        } catch (error) {
            toast.error("Error creating goal")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Create New Goal</h1>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                        {...register("title", { required: "Title is required" })}
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter goal title"
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        {...register("description")}
                        className="w-full p-2 border rounded-md"
                        rows={3}
                        placeholder="Enter goal description"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Priority</label>
                    <select
                        {...register("priority")}
                        className="w-full p-2 border rounded-md"
                    >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Progress Type</label>
                    <select
                        {...register("progress_type")}
                        className="w-full p-2 border rounded-md"
                    >
                        <option value="TASK_BASED">Task Based</option>
                        <option value="TIME_BASED">Time Based</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Current Progress (%)</label>
                    <input
                        {...register("current_progress", {
                            min: { value: 0, message: "Progress cannot be less than 0%" },
                            max: { value: 100, message: "Progress cannot exceed 100%" },
                            valueAsNumber: true
                        })}
                        type="number"
                        className="w-full p-2 border rounded-md"
                        placeholder="0"
                    />
                    {errors.current_progress && (
                        <p className="text-red-500 text-sm mt-1">{errors.current_progress.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input
                        {...register("start_date", { required: "Start date is required" })}
                        type="datetime-local"
                        className="w-full p-2 border rounded-md"
                    />
                    {errors.start_date && (
                        <p className="text-red-500 text-sm mt-1">{errors.start_date.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <input
                        {...register("end_date", { required: "End date is required" })}
                        type="datetime-local"
                        className="w-full p-2 border rounded-md"
                    />
                    {errors.end_date && (
                        <p className="text-red-500 text-sm mt-1">{errors.end_date.message}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full  rounded-md"
                    variant="default"
                >
                    {loading ? "Creating" : "Create Goal"}
                    {loading && <Loader2 className="ml-2 size-4 animate-spin" />}
                </Button>
            </form>
        </div>
    )
}

export default NewGoal