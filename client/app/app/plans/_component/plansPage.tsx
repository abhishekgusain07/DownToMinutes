"use client";

import { usePlanDateStore } from '@/store/usePlanDateStore';
import { getPlansForTheDay } from '@/utils/data/plans/getPlansForTheDay';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dotted-dialog"
import { Action, ActionItem, Plan, Task } from '@/utils/types';
import { format, isSameDay } from 'date-fns';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import {Textarea} from "@/components/ui/textarea";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addHours } from 'date-fns';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { actionFormSchema } from '@/utils/zod/schemas';
import { createPlan } from '@/utils/data/plans/createPlan';
import { useRouter } from 'next/navigation';
import ShowSuggestAiPlans from './showSuggestAiPlans';
import { getAllTaskOfUser } from '@/utils/data/task/getAllTaskOfUser';
import { generateDailyActions } from '@/utils/ai/generatePlans';
import { getActionItemForDate } from '@/utils/data/actionItem/getActionItemForDate';


const PlansPage = () => {
    const { selectedDate } = usePlanDateStore();
    const [actions, setActions] = useState<ActionItem[]| null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [aiPlansloading, setAiPlansLoading] = useState<boolean>(false);
    const [aiPlans, setAiPlans] = useState<ActionItem[]|null>(null);
    const [plansLoading, setPlansLoading] = useState<boolean>(false);
    var isToday = isSameDay(selectedDate, new Date());
    var isPast = selectedDate < new Date(new Date().setHours(0, 0, 0, 0));
    const [tasks, setTasks] = useState<Task[] | null>(null)
    const [tasksLoading, setTasksLoading] = useState<boolean>(false);

    const router = useRouter();
    // const generateAIPlans = async () => {
    //     //TODO: change prompt to generate actionItem instead of simple action
    //     if(tasksLoading || tasks === null || tasks.length === 0) {
    //         toast.error("cannot generate ai plans for the day");
    //         return;
    //     }
    //     try {
    //         setAiPlansLoading(true);
    //         const aiGenPlans: Action[] | null = await generateDailyActions({tasks: tasks});
    //         setAiPlans(aiGenPlans);
    //         router.refresh();
    //         toast.success("fetched ai plans for the day");
    //     } catch (e) {
    //         toast.error("cannot fetch ai plans for the day");
    //     } finally {
    //         setAiPlansLoading(false);
    //     }
    // }
    useEffect(() => {
        isToday = isSameDay(selectedDate, new Date());
        isPast = selectedDate < new Date(new Date().setHours(0, 0, 0, 0));
        const fetchActionItemsForTheDay = async() => {
            try {
                setPlansLoading(true);
                const data: ActionItem[] | null = await 
                getActionItemForDate({date:selectedDate})
                setActions(data);
                router.refresh();
                toast.success("fetched actions for the day");
            } catch (e) {
                toast.error("cannot fetch actions for the day");
            } finally {
                setPlansLoading(false);
            }
        }
        const fetchAllTaskOfUser = async () => {
            try {
                setTasksLoading(true);
                const data: Task[] | null = await getAllTaskOfUser();
                setTasks(data);
                router.refresh();
                toast.success("fetched tasks");
            } catch (e) {
                toast.error("cannot fetch tasks");
            } finally {
                setTasksLoading(false);
            }
        }
        fetchActionItemsForTheDay();
        fetchAllTaskOfUser();
    }, [selectedDate]);
    const handleSuccess = () => {
        setOpen(false);
    };
    const updatePlans = async (newActions: (ActionItem[] | null)) => {
        setActions(newActions);
    };

    if(tasksLoading || plansLoading) {
        return <div className='h-full w-full flex justify-center items-center'>
            <Loader2 className='size-4 animate-spin' />
        </div>
    }
    return (
        <div className="w-full space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-12 gap-6">
                {/* Left Column - Calendar and Form */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-2xl font-bold">
                            Plans for {format(selectedDate, 'MMMM d, yyyy')}
                        </h2>
                        <p className="text-muted-foreground">
                            {isToday ? "Today's" : isPast ? "Past" : "Future"} Plans
                        </p>
                    </div>
                    
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button 
                                className="w-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                                size="lg"
                            >
                                Add New Plan
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Plan</DialogTitle>
                                <DialogDescription>
                                    Add a new plan for {format(selectedDate, 'MMMM d, yyyy')}
                                </DialogDescription>
                            </DialogHeader>
                            <PlansForm
                                onSuccess={() => {
                                    updatePlans(null);
                                    toast.success('Plan created successfully');
                                }}
                                updatePlans={updatePlans}
                                selectedDate={selectedDate}
                                tasks={tasks}
                            />
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Right Column - AI Plans */}
                <div className="lg:col-span-8">
                    <div className="space-y-4">
                        {isPast ? (
                            <div>View past plans here</div>
                        ) : (
                            <div>
                                {
                                    plansLoading ? (
                                        <div className='text-muted-foreground'>Loading plans...</div>
                                    ) : actions && actions.length > 0 ? (
                                        <div>
                                            {
                                                actions.map((action) => (
                                                    <div key={action.id}>
                                                        <div>{action.description}</div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    ) : (
                                        <div>No actions found for the day</div>
                                    )
                                }
                            </div>
                        )}
                        <Button onClick={() => {}} disabled={aiPlansloading}> Generate AI Actions</Button>
                    </div>
                    <div className='mt-4'>
                    {
                        aiPlansloading ? (
                            <div className='text-muted-foreground'>Generating AI Plans <Loader2 className="animate-spin size-4" /></div>
                        ) : (
                            aiPlans && aiPlans.length > 0 ? (
                                <div>
                                    {/* <ShowSuggestAiPlans actions={aiPlans} /> */}
                                </div>
                            ) : (
                                <div>No AI plans found for the day</div>
                            )
                        )
                    }
                    </div>
                </div>
            </div>
        </div>
    );
};


const PlansForm = ({
    onSuccess,
    updatePlans,
    selectedDate,
    tasks,
}: {
    onSuccess: () => void,
    updatePlans: (newPlans: ActionItem[]|null) => void,
    selectedDate: Date,
    tasks: Task[] | null,
}) => {
    const router = useRouter();
    const form = useForm<z.infer<typeof actionFormSchema>>({
        resolver: zodResolver(actionFormSchema),
        defaultValues: {
            title: "",
            duration: 30,
            completed: false,
            task_id: "",
            notes: "",
        }
    });

    const handleSubmit = async (values: z.infer<typeof actionFormSchema>) => {
        try {
            await createPlan({data: values});
            form.reset();
            onSuccess();
            const data = await getActionItemForDate({date: selectedDate});
            updatePlans(data);
            router.refresh();
            toast.success("Action created successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create action");
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">

                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter action title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Duration (minutes)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={1}
                                    placeholder="Enter duration in minutes"
                                    {...field}
                                    onChange={e => field.onChange(parseInt(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="task_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Select Task</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a task" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {tasks && tasks.map((task) => (
                                        <SelectItem key={task.id} value={task.id}>
                                            {task.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes (Optional)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Add any additional notes"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                    {form.formState.isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                        </>
                    ) : (
                        'Create Action'
                    )}
                </Button>
            </form>
        </Form>
    );
};

export default PlansPage;