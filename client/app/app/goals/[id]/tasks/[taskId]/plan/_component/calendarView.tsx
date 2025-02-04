"use client";

import React, { useEffect, useState } from 'react';
import { PartialActionItem, Task } from '@/utils/types';
import { getTaskById } from '@/utils/data/task/getTaskById';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format, eachDayOfInterval, startOfToday, isSameDay, isToday } from 'date-fns';
import { Plus, X, Calendar as CalendarIcon, Clock, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { uid } from 'uid';
import { generateTaskActions } from '@/utils/ai/generateTaskAction';

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

const CalendarView = ({ goalId, taskId }: CalendarViewProps) => {
  const [task, setTask] = useState<Task | null>(null);
  const [actions, setActions] = useState<ActionItem[]|PartialActionItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAction, setNewAction] = useState({
    title: '',
    duration: 30,
  });
  const [generatingAiActions, setGeneratingAiActions] = useState(false);
  const [days, setDays] = useState<Date[]>([]);

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

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleAddAction = () => {
    if (selectedDate && newAction.title) {
      const newActionItem: ActionItem = {
        id: uid(32),
        date: selectedDate,
        description: newAction.title,
        duration: newAction.duration
      };

      setActions([...actions, newActionItem]);
      setIsModalOpen(false);
      setNewAction({ title: '', duration: 30 });
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
  const handleDeleteAction = (actionId: string) => {
    setActions(actions.filter(action => action.id !== actionId));
  };

  const handleSaveAll = async () => {
    // TODO: Save actions to the database
    console.log('Saving actions:', actions);
  };

  const getActionsForDate = (date: Date) => {
    return actions?.filter(action => isSameDay(new Date(action.date), date));
  };

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
        >
          Save Plan
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
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-semibold text-slate-600 py-2">
              {day}
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
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
            >
              Add Action
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarView;