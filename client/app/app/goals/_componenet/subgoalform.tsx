"use client"

import { useForm } from "react-hook-form"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSubgoal } from "@/utils/data/subgoals/createSubgoal"
import { Frequency } from "@/utils/types"
import { toast } from "sonner"

type FormData = {
    title: string
    description?: string
    frequency: Frequency
    due_date: string
}

interface SubgoalFormProps {
    goalId: string
}

const SubgoalForm = ({ goalId }: SubgoalFormProps) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>()

    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true)
            await createSubgoal({
                ...data,
                goal_id: goalId,
                due_date: new Date(data.due_date)
            })
            toast.success("Subgoal created successfully")
            router.push(`/goals/${goalId}`)
            router.refresh()
        } catch (error) {
            console.error("Error creating subgoal:", error)
            toast.error("Error creating subgoal")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                        {...register("title", { required: "Title is required" })}
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter subgoal title"
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
                        placeholder="Enter subgoal description"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Frequency</label>
                    <select
                        {...register("frequency", { required: "Frequency is required" })}
                        className="w-full p-2 border rounded-md"
                    >
                        <option value="WEEKLY">Weekly</option>
                        <option value="MONTHLY">Monthly</option>
                        <option value="QUARTERLY">Quarterly</option>
                        <option value="YEARLY">Yearly</option>
                    </select>
                    {errors.frequency && (
                        <p className="text-red-500 text-sm mt-1">{errors.frequency.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Due Date</label>
                    <input
                        {...register("due_date", { required: "Due date is required" })}
                        type="datetime-local"
                        className="w-full p-2 border rounded-md"
                    />
                    {errors.due_date && (
                        <p className="text-red-500 text-sm mt-1">{errors.due_date.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? "Creating..." : "Create Subgoal"}
                </button>
            </form>
        </div>
    )
}

export default SubgoalForm