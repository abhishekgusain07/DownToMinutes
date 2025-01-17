"use client"

import { useForm } from "react-hook-form"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createGoal } from "@/utils/data/goals/createGoal"
import { toast } from "sonner"

type FormData = {
    title: string
    description?: string
    priority: "LOW" | "MEDIUM" | "HIGH"
    start_date: string
    end_date: string
}

const NewGoal = () => {
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
            await createGoal({
                ...data,
                start_date: new Date(data.start_date),
                end_date: new Date(data.end_date),
            })
            router.push("/goals")
            router.refresh()
            toast.success("Goal created successfully")
        } catch (error) {
            toast.error("Error creating goal")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
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

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? "Creating..." : "Create Goal"}
                </button>
            </form>
        </div>
    )
}

export default NewGoal