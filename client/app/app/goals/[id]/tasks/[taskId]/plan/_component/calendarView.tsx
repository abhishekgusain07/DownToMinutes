"use client";

import React, { useEffect, useState } from 'react';
import { PartialActionItem, Task } from '@/utils/types';
import { getTaskById } from '@/utils/data/task/getTaskById';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dotted-dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format, eachDayOfInterval, startOfToday, isSameDay, isToday } from 'date-fns';
import { Plus, X, Calendar as CalendarIcon, Clock, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { uid } from 'uid';
import { generateTaskActions } from '@/utils/ai/generateTaskAction';
import { getActionItemForDate } from '@/utils/data/actionItem/getActionItemForDate';
import { getUserDailyHourLimit } from '@/utils/data/user/getUserDailyHourLimit';
import { createNewTaskActionPlan } from '@/utils/data/taskActionPlan/createNewTaskActionPlan';
import { toast } from 'sonner';
import { createActionItem } from '@/utils/data/actionItem/createActionItem';

interface CalendarViewProps {
  goalId: string;
  taskId: string;
}

interface ActionItem {
  id: string;
  date: Date;
  description: string;
  duration: number;
}

interface NewAction {
  title: string;
  duration: number;
}

interface DailyHours {
  [date: string]: number;
}

const CalendarView = ({ goalId, taskId }: CalendarViewProps) => {
  const [task, setTask] = useState<Task | null>(null);
  const [actions, setActions] = useState<ActionItem[]|PartialActionItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAction, setNewAction] = useState<NewAction>({ title: '', duration: 30 });
  const [generatingAiActions, setGeneratingAiActions] = useState<boolean>(false);
  const [showLimitWarning, setShowLimitWarning] = useState<boolean>(false);
  const [dailyHourLimit, setDailyHourLimit] = useState<number>(8); // Default value until loaded
  const [days, setDays] = useState<Date[]>([]);
  const [dailyHours, setDailyHours] = useState<DailyHours>({});
  const [isLoadingHours, setIsLoadingHours] = useState<{[key: string]: boolean}>({});
  const [isAddingAction, setIsAddingAction] = useState<boolean>(false);
  const [savingPlan, setSavingPlan] = useState<boolean>(false)

  useEffect(() => {
    const loadDailyHourLimit = async () => {
      const limit = await getUserDailyHourLimit();
      setDailyHourLimit(limit);
    };
    loadDailyHourLimit();
  }, []);

  useEffect(() => {
    const fetchTask = async () => {
      const taskData = await getTaskById({ taskId });
      setTask(taskData);
      if (taskData) {
        const today = startOfToday();
        const dueDate = new Date(taskData.due_date);
        const daysInterval = eachDayOfInterval({ start: today, end: dueDate });
        setDays(daysInterval);
      }
    };
    fetchTask();
  }, [taskId]);

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
  }, [days]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const calculateDailyHours = async(date: Date, additionalMinutes: number = 0) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const existingActions = await getActionItemForDate({date});
    const totalMinutes = (existingActions).reduce((sum, action) => 
      sum + (action.duration || 0), 0) + additionalMinutes;
    return totalMinutes / 60; // Convert to hours
  };

  const handleAddAction = async() => {
    if (selectedDate && newAction.title) {
      setIsAddingAction(true);
      try {
        const newTotalHours = await calculateDailyHours(selectedDate, newAction.duration);

        if (newTotalHours > dailyHourLimit) {
          setShowLimitWarning(true);
          return;
        }

        const newActionItem: ActionItem = {
          id: uid(32),
          date: selectedDate,
          description: newAction.title,
          duration: newAction.duration
        };

        // Update daily hours for the selected date
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const currentHours = dailyHours[dateStr] || 0;
        const newHours = currentHours + (newAction.duration / 60);
        
        setActions(prev => [...prev, newActionItem]);
        setDailyHours(prev => ({ ...prev, [dateStr]: newHours }));
        setIsModalOpen(false);
        setNewAction({ title: '', duration: 30 });
        setShowLimitWarning(false);
      } catch (error) {
        console.error('Error adding action:', error);
      } finally {
        setIsAddingAction(false);
      }
    }
  };

  const handleDeleteAction = (actionId: string) => {
    const actionToDelete = actions.find(action => action.id === actionId);
    if (actionToDelete) {
      const dateStr = format(new Date(actionToDelete.date), 'yyyy-MM-dd');
      const currentHours = dailyHours[dateStr] || 0;
      const newHours = Math.max(0, currentHours - (actionToDelete.duration / 60));
      
      setDailyHours(prev => ({ ...prev, [dateStr]: newHours }));
      setActions(actions.filter(action => action.id !== actionId));
    }
  };

  const handleAddAnyway = async () => {
    if (selectedDate && newAction.title) {
      setIsAddingAction(true);
      try {
        const newActionItem: ActionItem = {
          id: uid(32),
          date: selectedDate,
          description: newAction.title,
          duration: newAction.duration
        };

        // Update daily hours for the selected date
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const currentHours = dailyHours[dateStr] || 0;
        const newHours = currentHours + (newAction.duration / 60);
        
        setActions(prev => [...prev, newActionItem]);
        setDailyHours(prev => ({ ...prev, [dateStr]: newHours }));
        setIsModalOpen(false);
        setNewAction({ title: '', duration: 30 });
        setShowLimitWarning(false);
      } catch (error) {
        console.error('Error adding action:', error);
      } finally {
        setIsAddingAction(false);
      }
    }
  };

  const generateAiPlan = async() => {
    setGeneratingAiActions(true);
    try{
      const actions = await generateTaskActions({task: task!})
      console.log("actions ✅", actions)
      setActions(actions!)
    }catch(error){ 
      console.error("Error generating AI plan:", error);
    }finally{
      setGeneratingAiActions(false);
    }
  }

  const handleSaveAll = async () => {
    setSavingPlan(true);
    try{
      const newActionPlan = await createNewTaskActionPlan({taskId, start_date: new Date(), end_date: task?.due_date!})
      if(!newActionPlan){
        toast.error("Failed to create new action plan");
        return;
      }
      const actionItems: ActionItem[] = await Promise.all(
        actions.map(action => createActionItem(
          {taskId, date: action.date, taskActionPlanId: newActionPlan.id, actionItem: action, goalId: goalId!}
        ))
      )
      console.log("actionItems ✅", actionItems)
      toast.success("Saved all actions");
    }catch(error) {
      console.error("Error saving actions:", error);
      toast.error("Failed to save actions");
    }finally {
      setSavingPlan(false);
    }
  };

  const getActionsForDate = (date: Date) => {
    return actions?.filter(action => isSameDay(new Date(action.date), date));
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
            onClick={handleAddAnyway}
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

  if (!task) {
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

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-white via-slate-50 to-white rounded-2xl shadow-2xl border border-slate-100">
      <div className="mb-8 space-y-4 md:space-y-0 md:flex md:justify-between md:items-center">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Action Plan
          </h2>
          <div className="flex items-center space-x-2 text-slate-600">
            <CalendarIcon className="h-4 w-4" />
            <p className="text-sm font-medium">
              Due: {format(new Date(task.due_date), 'PPP')}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
        <Button 
          onClick={handleSaveAll}
          className="w-full md:w-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
          disabled={savingPlan}
        >
          {savingPlan && "Saving "}
          {
            savingPlan ? <Loader2 className='animate-spin size-2 ml-2' /> : 'Save Plan'
          }
        </Button>
        <Button 
          onClick={generateAiPlan}
          className="w-full md:w-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
        >
          {
            generatingAiActions ? `Generating` : `Generate Plan `
          }
          {
            generatingAiActions ? <Loader2 className='animate-spin size-2' /> : <Sparkles className='size-2' />
          }
        </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 md:gap-6 overflow-x-auto pb-4">
        <div className="hidden md:grid md:grid-cols-7 md:col-span-7 gap-4 mb-4">
          {days.slice(0, 7).map((date, index) => (
            <div key={index} className="text-center text-md font-bold text-gray-900">
              {format(date, 'EEE')}
            </div>
          ))}
        </div>
        
        {days.map((date, index) => {
          const dayActions = getActionsForDate(date);
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              key={date.toISOString()}
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
                {isToday(date) && (
                  <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
                    Today
                  </span>
                )}
              </div>
              <div className="space-y-2.5">
                <AnimatePresence>
                  {dayActions?.map((action) => (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      key={action.id}
                      className="text-sm bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-3 group relative hover:shadow-sm transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-700 truncate flex-1">
                          {action.description}
                        </span>
                        <button
                          onClick={() => handleDeleteAction(action.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all duration-200"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div className="flex items-center mt-1.5 text-xs text-slate-500">
                        <Clock size={12} className="mr-1" />
                        {action.duration} min
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <DailyHoursIndicator date={date} />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDateClick(date)}
                  className="absolute bottom-3 right-3 p-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Plus size={16} />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl bg-gradient-to-br from-white via-slate-50 to-white p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Add New Action
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-slate-700">
                Action Title
              </Label>
              <Input
                id="title"
                value={newAction.title}
                onChange={(e) => setNewAction({ ...newAction, title: e.target.value })}
                placeholder="Enter action title..."
                className="rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium text-slate-700">
                Duration (minutes)
              </Label>
              <Input
                id="duration"
                type="number"
                min="0"
                value={newAction.duration === 0 ? '' : newAction.duration}
                onChange={(e) => setNewAction({ 
                  ...newAction, 
                  duration: e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value) || 0)
                })}
                className="rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
              />
            </div>
          </div>
          <DialogFooter className="mt-8">
            <Button
              onClick={handleAddAction}
              disabled={!newAction.title || isAddingAction}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
            >
              {isAddingAction ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </div>
              ) : (
                'Add Action'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <WarningDialog />
    </div>
  );
};

export default CalendarView;