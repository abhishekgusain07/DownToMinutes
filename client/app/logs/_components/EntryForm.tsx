"use client";
import { useForm } from "react-hook-form";
import { ActivityCategory } from "@prisma/client";
import { createDayEntry } from "@/utils/data/logs/createDayEntry";
import { useState } from "react";
import { useRouter } from "next/navigation";

type FormData = {
    title: string;
    description?: string;
    category: ActivityCategory;
    start_time: string;
    end_time: string;
    focus_score?: number;
    energy_level?: number;
    interruptions?: number;
    location?: string;
};

export const EntryForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        try {
            setIsLoading(true);
            await createDayEntry({
                ...data,
                start_time: new Date(data.start_time),
                end_time: new Date(data.end_time),
            });
            reset();
            router.refresh();
        } catch (error) {
            console.error("Failed to create entry:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Title
                </label>
                <input
                    type="text"
                    {...register("title", { required: "Title is required" })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.title && (
                    <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Description (optional)
                </label>
                <textarea
                    {...register("description")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Category
                </label>
                <select
                    {...register("category", { required: "Category is required" })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                    {Object.values(ActivityCategory).map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
                {errors.category && (
                    <p className="text-red-500 text-sm">{errors.category.message}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Start Time
                    </label>
                    <input
                        type="datetime-local"
                        {...register("start_time", { required: "Start time is required" })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.start_time && (
                        <p className="text-red-500 text-sm">{errors.start_time.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        End Time
                    </label>
                    <input
                        type="datetime-local"
                        {...register("end_time", { required: "End time is required" })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.end_time && (
                        <p className="text-red-500 text-sm">{errors.end_time.message}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Focus Score (1-10)
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="10"
                        {...register("focus_score", { min: 1, max: 10 })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Energy Level (1-10)
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="10"
                        {...register("energy_level", { min: 1, max: 10 })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Interruptions
                    </label>
                    <input
                        type="number"
                        min="0"
                        {...register("interruptions", { min: 0 })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Location (optional)
                </label>
                <input
                    type="text"
                    {...register("location")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
                {isLoading ? "Creating..." : "Create Entry"}
            </button>
        </form>
    );
};
