"use client";

import { usePlanDateStore } from '@/store/usePlanDateStore';
import { getPlansForTheDay } from '@/utils/data/plans/getPlansForTheDay';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dotted-dialog"
import { Plan } from '@/utils/types';
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
import { planFormSchema } from '@/utils/zod/schemas';
import { createPlan } from '@/utils/data/plans/createPlan';


const PlansPage = () => {
    const { selectedDate } = usePlanDateStore();
    const [plans, setPlans] = useState<Plan[] | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [plansLoading, setPlansLoading] = useState<boolean>(false);
    var isToday = isSameDay(selectedDate, new Date());
    var isPast = selectedDate < new Date(new Date().setHours(0, 0, 0, 0));
    useEffect(() => {
        isToday = isSameDay(selectedDate, new Date());
        isPast = selectedDate < new Date(new Date().setHours(0, 0, 0, 0));
        const fetchPlansForTheDay = async() => {
            try {
                setPlansLoading(true);
                const data = await getPlansForTheDay({date: selectedDate});
                setPlans(data);
                toast.success("fetched plans for the day");
            } catch (e) {
                toast.error("cannot fetch plans for the day");
            } finally {
                setPlansLoading(false);
            }
        }
        fetchPlansForTheDay();
    }, [selectedDate]);
    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold">
                    Plans for {format(selectedDate, 'MMMM d, yyyy')}
                </h2>
                <p className="text-muted-foreground">
                    {isToday ? "Today's" : isPast ? "Past" : "Future"} Plans
                </p>
            </div>
            
            {/* Plans list will go here */}
            <div className="space-y-4">
                {isPast ? (
                    <div>View past plans here</div>
                ) : (
                    <div>
                        {
                            plansLoading ? (
                                <div className='text-muted-foreground'>Loading plans...</div>
                            ) : plans && plans.length > 0 ? (
                                <div>
                                    {
                                        plans.map((plan) => (
                                            <div key={plan.id}>
                                                <div>{plan.task}</div>
                                            </div>
                                        ))
                                    }
                                </div>
                            ) : (
                                <div>No plans found for the day</div>
                            )
                        }
                    </div>
                )}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm">Open Dialog</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create New Plan</DialogTitle>
                            <DialogDescription>
                                Add a new plan for {format(selectedDate, "PPP")}
                            </DialogDescription>
                        </DialogHeader>
                        <PlansForm onSuccess={() => {setOpen(false)}} />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};


const PlansForm = ({onSuccess}: {onSuccess: () => void}) => {
    const form = useForm<z.infer<typeof planFormSchema>>({
        resolver: zodResolver(planFormSchema),
        defaultValues: {
            task: "",
            description: "",
            from_time: format(new Date(), "HH:mm"),
            to_time: format(addHours(new Date(), 1), "HH:mm"),
            status: "NOT_STARTED",
            effectiveness: 5,
            distractions: 5,
            note: "",
        }
    });
    async function onSubmit(values: z.infer<typeof planFormSchema>) {
        try {
            await createPlan({data: values});
            form.reset();
            onSuccess();
            toast.success("Plan created successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create plan");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="task"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Task</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your task" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                                <Textarea 
                                    placeholder="Describe your task"
                                    className="resize-none"
                                    {...field} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="from_time"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Start Time</FormLabel>
                                <FormControl>
                                    <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="to_time"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>End Time</FormLabel>
                                <FormControl>
                                    <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                                    <SelectItem value="STARTED">Started</SelectItem>
                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                    <SelectItem value="NOT_DONE">Not Done</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Note (Optional)</FormLabel>
                            <FormControl>
                                <Textarea 
                                    placeholder="Add any notes"
                                    className="resize-none"
                                    {...field} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="effectiveness"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Effectiveness (1-10)</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="number" 
                                        min={1} 
                                        max={10}
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
                        name="distractions"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Distractions (1-10)</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="number"
                                        min={1}
                                        max={10}
                                        {...field}
                                        onChange={e => field.onChange(parseInt(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <DialogFooter>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Creating...
                            </div>
                        ) : (
                            "Create Plan"
                        )}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
}

export default PlansPage;