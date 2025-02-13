"use client"

import { getActionItemsForPlan } from "@/utils/data/actionItem/getActionItemsForPlan";
import { getTaskActionPlan } from "@/utils/data/taskActionPlan/getTaskActionPlan";
import { ActionItem, PartialActionItem, Task, TaskActionPlan } from "@/utils/types";
import { Loader2, Plus, X, AlertCircle, Calendar as CalendarIcon, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { format, eachDayOfInterval, startOfToday, isSameDay, isToday } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dotted-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { getTaskById } from "@/utils/data/task/getTaskById";
import { getUserDailyHourLimit } from "@/utils/data/user/getUserDailyHourLimit";
import { cn } from "@/lib/utils";
import { updateActionItem } from "@/utils/data/actionItem/updateActionItem";
import { deleteActionItem } from "@/utils/data/actionItem/deleteActionItem";
import { createActionItem } from "@/utils/data/actionItem/createActionItem";
import { uid } from "uid";

interface UpdateTaskActionPlanPageProps {
    goalId: string,
    taskId: string,
    planId: string
}

interface NewAction {
    title: string;
    duration: number;
}

interface DailyHours {
    [date: string]: number;
}

const UpdateTaskActionPlanPage = ({goalId, taskId, planId}: UpdateTaskActionPlanPageProps) => {
    const [taskActionPlan, setTaskActionPlan] = useState<TaskActionPlan | null>(null);
    const [task, setTask] = useState<Task | null>(null);
    const [taskActionPlanLoading, setTaskActionPlanLoading] = useState<boolean>(false);
    const [actions, setActions] = useState<PartialActionItem[]>([]);
    const [actionsLoading, setActionsLoading] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAction, setNewAction] = useState<NewAction>({ title: '', duration: 30 });
    const [showLimitWarning, setShowLimitWarning] = useState<boolean>(false);
    const [dailyHourLimit, setDailyHourLimit] = useState<number>(8);
    const [days, setDays] = useState<Date[]>([]);
    const [dailyHours, setDailyHours] = useState<DailyHours>({});
    const [isLoadingHours, setIsLoadingHours] = useState<{[key: string]: boolean}>({});
    const [isAddingAction, setIsAddingAction] = useState<boolean>(false);
    const [selectedActionForEdit, setSelectedActionForEdit] = useState<PartialActionItem | null>(null);
    const [originalActions, setOriginalActions] = useState<PartialActionItem[]>([]);
    const [isUpdatingPlan, setIsUpdatingPlan] = useState(false);

    useEffect(() => {
        const loadDailyHourLimit = async () => {
            const limit = await getUserDailyHourLimit();
            setDailyHourLimit(limit);
        };
        loadDailyHourLimit();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setTaskActionPlanLoading(true);
                const [planData, taskData] = await Promise.all([
                    getTaskActionPlan({planId}),
                    getTaskById({taskId})
                ]);
                setTaskActionPlan(planData);
                setTask(taskData);

                if (taskData) {
                    const today = startOfToday();
                    const dueDate = new Date(taskData.due_date);
                    const daysInterval = eachDayOfInterval({ start: today, end: dueDate });
                    setDays(daysInterval);
                }
            } catch(error) {
                console.log("Error fetching data", error);
                toast.error("Failed to load plan data");
            } finally {
                setTaskActionPlanLoading(false);
            }
        };
        fetchData();
    }, [planId, taskId]);

    useEffect(() => {
        const fetchActionItems = async () => {
            if (!taskActionPlan) return;
            try {
                setActionsLoading(true);
                const data = await getActionItemsForPlan({
                    planId, 
                    version: taskActionPlan.version, 
                    taskId
                });
                setActions(data || []);
                setOriginalActions(data || []); // Store original actions
            } catch(error) {
                console.log("Error fetching action items", error);
                toast.error("Failed to load actions");
            } finally {   
                setActionsLoading(false);
            }
        };
        fetchActionItems();
    }, [taskActionPlan, taskId]);

    const calculateDailyHours = async (date: Date) => {
        const actionsForDay = actions.filter(action => 
            isSameDay(new Date(action.date), date)
        );
        return actionsForDay.reduce((total, action) => total + action.duration / 60, 0);
    };

    useEffect(() => {
        const loadHoursForDate = async (date: Date) => {
            const dateStr = format(date, 'yyyy-MM-dd');
            setIsLoadingHours(prev => ({ ...prev, [dateStr]: true }));
            try {
                const hours = await calculateDailyHours(date);
                setDailyHours(prev => ({ ...prev, [dateStr]: hours }));
            } catch (error) {
                console.error('Error loading hours for date:', error);
            } finally {
                setIsLoadingHours(prev => ({ ...prev, [dateStr]: false }));
            }
        };

        days.forEach(date => {
            loadHoursForDate(date);
        });
    }, [days, actions]);

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        setIsModalOpen(true);
        setSelectedActionForEdit(null);
        setNewAction({ title: '', duration: 30 });
    };

    const handleActionClick = (action: PartialActionItem) => {
        setSelectedDate(new Date(action.date));
        setSelectedActionForEdit(action);
        setNewAction({ 
            title: action.description, 
            duration: action.duration 
        });
        setIsModalOpen(true);
    };

    const handleAddOrUpdateAction = async () => {
        if (!selectedDate || !newAction.title || newAction.duration <= 0) return;

        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const currentHours = dailyHours[dateStr] || 0;
        const newHours = currentHours + (newAction.duration / 60);

        if (newHours > dailyHourLimit) {
            setShowLimitWarning(true);
            return;
        }

        setIsAddingAction(true);
        try {
            if (selectedActionForEdit) {
                const updatedActions = actions.map(action => 
                    action.id === selectedActionForEdit.id 
                        ? {
                            ...action,
                            description: newAction.title,
                            duration: newAction.duration
                        }
                        : action
                );
                setActions(updatedActions);
                toast.success("Action updated successfully");
            } else {
                const newActionItem: PartialActionItem = {
                    id: uid(32),
                    date: selectedDate,
                    description: newAction.title,
                    duration: newAction.duration
                };
                setActions([...actions, newActionItem]);
                toast.success("Action added successfully");
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error adding/updating action:', error);
            toast.error("Failed to save action");
        } finally {
            setIsAddingAction(false);
        }
    };

    const handleDeleteAction = (actionToDelete: PartialActionItem) => {
        setActions(actions.filter(action => action.id !== actionToDelete.id));
        toast.success("Action deleted successfully");
    };

    const hasChanges = () => {
        if (actions.length !== originalActions.length) return true;
        
        const sortedActions = [...actions].sort((a, b) => a.id.localeCompare(b.id));
        const sortedOriginalActions = [...originalActions].sort((a, b) => a.id.localeCompare(b.id));
        
        return sortedActions.some((action, index) => {
            const originalAction = sortedOriginalActions[index];
            return action.description !== originalAction.description ||
                   action.duration !== originalAction.duration ||
                   !isSameDay(new Date(action.date), new Date(originalAction.date));
        });
    };

    const handleUpdatePlan = async () => {
        if (!hasChanges()) return;
        
        setIsUpdatingPlan(true);
        try {
            // Find actions that need to be added (exist in current but not in original)
            const actionsToAdd = actions.filter(action => 
                !originalActions.some(original => original.id === action.id)
            );

            // Find actions that need to be deleted (exist in original but not in current)
            const actionsToDelete = originalActions.filter(original => 
                !actions.some(action => action.id === original.id)
            );

            // Find actions that need to be updated (exist in both but have changes)
            const actionsToUpdate = actions.filter(action => {
                const originalAction = originalActions.find(original => original.id === action.id);
                if (!originalAction) return false; // Skip if it's a new action

                return action.description !== originalAction.description ||
                       action.duration !== originalAction.duration ||
                       !isSameDay(new Date(action.date), new Date(originalAction.date));
            });

            console.log('Actions to process:', {
                toAdd: actionsToAdd,
                toUpdate: actionsToUpdate,
                toDelete: actionsToDelete
            });

            // Execute all updates in parallel
            const results = await Promise.allSettled([
                // Delete actions
                ...actionsToDelete.map(action => 
                    deleteActionItem({id: action.id})
                        .catch(err => {
                            console.error(`Failed to delete action ${action.id}:`, err);
                            throw err;
                        })
                ),
                
                // Update existing actions
                ...actionsToUpdate.map(action => 
                    updateActionItem({
                        id: action.id,
                        description: action.description,
                        duration: action.duration,
                        date: new Date(action.date)
                    }).catch(err => {
                        console.error(`Failed to update action ${action.id}:`, err);
                        throw err;
                    })
                ),
                
                // Add new actions
                ...actionsToAdd.map(action => 
                    createActionItem({
                        taskId,
                        date: new Date(action.date),
                        taskActionPlanId: taskActionPlan!.id,
                        actionItem: action,
                        goalId: goalId
                    }).catch(err => {
                        console.error(`Failed to create action:`, err);
                        throw err;
                    })
                )
            ]);

            // Check for any failures
            const failures = results.filter(result => result.status === 'rejected');
            if (failures.length > 0) {
                console.error('Some actions failed:', failures);
                throw new Error('Some actions failed to process');
            }
            
            toast.success("Plan updated successfully ✅");
            setOriginalActions([...actions]); // Update original actions after successful save
        } catch (error) {
            console.error('Error updating plan:', error);
            toast.error(error instanceof Error ? error.message : "Failed to update plan");
        } finally {
            setIsUpdatingPlan(false);
        }
    };

    const DailyHoursIndicator = ({ date }: { date: Date }) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const hours = dailyHours[dateStr] || 0;
        const percentage = (hours / dailyHourLimit) * 100;
        
        if (isLoadingHours[dateStr]) {
            return (
                <div className="mt-2">
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden animate-pulse"/>
                    <p className="text-xs text-slate-500 mt-1">Loading...</p>
                </div>
            );
        }
        
        return (
            <div className="mt-2">
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                        className={cn(
                            "h-full transition-all duration-300",
                            percentage > 100 
                                ? "bg-red-500" 
                                : percentage > 75 
                                    ? "bg-amber-500" 
                                    : "bg-blue-500"
                        )}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                    {hours.toFixed(1)}/{dailyHourLimit}h
                </p>
            </div>
        );
    };

    if (taskActionPlanLoading || actionsLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-slate-200 rounded w-[250px]"></div>
                        <div className="h-4 bg-slate-200 rounded w-[200px]"></div>
                    </div>
                </div>
            </div>
        );
    }

    const WarningDialog = () => (
        <Dialog open={showLimitWarning} onOpenChange={setShowLimitWarning}>
            <DialogContent className="sm:max-w-[425px] rounded-2xl bg-gradient-to-br from-white via-slate-50 to-white p-6">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-amber-600">
                        <AlertCircle className="h-6 w-6" />
                        Daily Hours Limit Exceeded
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                    <p className="text-slate-600">
                        Adding this action would exceed the recommended daily limit of {dailyHourLimit} hours.
                    </p>
                    <div className="flex items-center gap-2 p-4 bg-amber-50 rounded-xl">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                        <p className="text-sm text-amber-700">
                            Consider spreading your tasks across multiple days for better work-life balance.
                        </p>
                    </div>
                </div>
                <DialogFooter className="mt-6 space-x-2">
                    <Button
                        onClick={() => setShowLimitWarning(false)}
                        variant="outline"
                        className="rounded-xl"
                        disabled={isAddingAction}
                    >
                        Adjust Duration
                    </Button>
                    <Button
                        onClick={handleAddOrUpdateAction}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl"
                        disabled={isAddingAction}
                    >
                        {isAddingAction ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Adding...
                            </div>
                        ) : (
                            'Add Anyway'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

    return (
        <div className="p-4 md:p-8 bg-gradient-to-br from-white via-slate-50 to-white rounded-2xl shadow-2xl border border-slate-100">
            <div className="mb-8 space-y-4 md:space-y-0 md:flex md:justify-between md:items-center">
                <div className="space-y-2">
                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                        Update Action Plan
                    </h2>
                    {task && (
                        <div className="flex items-center space-x-2 text-slate-600">
                            <CalendarIcon className="h-4 w-4" />
                            <p className="text-sm font-medium">
                                Due: {format(new Date(task.due_date), 'PPP')}
                            </p>
                        </div>
                    )}
                </div>
                <Button
                    onClick={handleUpdatePlan}
                    disabled={!hasChanges() || isUpdatingPlan}
                    className={cn(
                        "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white",
                        "transition-all duration-300",
                        (!hasChanges() || isUpdatingPlan) && "opacity-50 cursor-not-allowed"
                    )}
                >
                    {isUpdatingPlan ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                        </>
                    ) : (
                        'Update Plan'
                    )}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 md:gap-6 overflow-x-auto pb-4">
                <div className="hidden md:grid md:grid-cols-7 md:col-span-7 gap-4 mb-4">
                    {days.slice(0, 7).map((date, index) => (
                        <div key={index} className="text-center text-md font-bold text-gray-900">
                            {format(date, 'EEE')}
                        </div>
                    ))}
                </div>

                {days.map((date, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={cn(
                            "min-h-[160px] border rounded-2xl p-4 relative transition-all duration-300",
                            "hover:border-blue-400 hover:shadow-lg hover:scale-[1.02]",
                            "bg-white backdrop-blur-lg",
                            isToday(date) && "ring-2 ring-blue-500 ring-opacity-50 shadow-md"
                        )}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex flex-col items-start">
                                <span className="text-sm font-medium text-slate-400">
                                    {format(date, 'E')}
                                </span>
                                <span className={cn(
                                    "text-lg font-bold mt-0.5",
                                    isToday(date) ? "text-blue-600" : "text-slate-700"
                                )}>
                                    {format(date, 'd')}
                                </span>
                            </div>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6"
                                onClick={() => handleDateClick(date)}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {actions
                                .filter(action => isSameDay(new Date(action.date), date))
                                .map(action => (
                                    <motion.div
                                        key={action.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="bg-blue-50 rounded-lg p-2 text-sm relative group"
                                    >
                                        <div className="pr-16"> 
                                            <p className="font-medium text-blue-900">{action.description}</p>
                                            <p className="text-blue-600">{action.duration} min</p>
                                        </div>
                                        <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-6 w-6 hover:bg-blue-100"
                                                onClick={() => handleActionClick(action)}
                                            >
                                                <Pencil className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-6 w-6 hover:bg-red-100"
                                                onClick={() => handleDeleteAction(action)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                        </div>

                        <DailyHoursIndicator date={date} />
                    </motion.div>
                ))}
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedActionForEdit ? 'Edit Action' : 'Add New Action'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Action Title</Label>
                            <Input
                                id="title"
                                value={newAction.title}
                                onChange={(e) => setNewAction(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Enter action title"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="duration">Duration (minutes)</Label>
                            <Input
                                id="duration"
                                type="number"
                                value={newAction.duration}
                                onChange={(e) => setNewAction(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                                min="1"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddOrUpdateAction}
                            disabled={isAddingAction}
                            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white"
                        >
                            {isAddingAction ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {selectedActionForEdit ? 'Updating...' : 'Adding...'}
                                </>
                            ) : (
                                selectedActionForEdit ? 'Update Action' : 'Add Action'
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <WarningDialog />
        </div>
    );
};

export default UpdateTaskActionPlanPage;