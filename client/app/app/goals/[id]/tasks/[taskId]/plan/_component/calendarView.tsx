"use client";

import React, { useEffect, useState } from 'react';
import { Task } from '@/utils/types';
import { getTaskById } from '@/utils/data/task/getTaskById';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format, eachDayOfInterval, startOfToday, isSameDay, isToday } from 'date-fns';
import { Plus, X, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CalendarViewProps {
  goalId: string;
  taskId: string;
}

interface ActionItem {
  id: string;
  date: Date;
  title: string;
  duration: number;
}

const CalendarView = ({ goalId, taskId }: CalendarViewProps) => {
  const [task, setTask] = useState<Task | null>(null);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAction, setNewAction] = useState({
    title: '',
    duration: 30,
  });
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
        id: Math.random().toString(36).substr(2, 9),
        date: selectedDate,
        title: newAction.title,
        duration: newAction.duration
      };

      setActions([...actions, newActionItem]);
      setIsModalOpen(false);
      setNewAction({ title: '', duration: 30 });
    }
  };

  const handleDeleteAction = (actionId: string) => {
    setActions(actions.filter(action => action.id !== actionId));
  };

  const handleSaveAll = async () => {
    // TODO: Save actions to the database
    console.log('Saving actions:', actions);
  };

  const getActionsForDate = (date: Date) => {
    return actions.filter(action => isSameDay(new Date(action.date), date));
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
    <div className="p-4 md:p-6 bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-xl">
      <div className="mb-6 space-y-4 md:space-y-0 md:flex md:justify-between md:items-center">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Action Plan
          </h2>
          <div className="flex items-center space-x-2 text-gray-600">
            <CalendarIcon className="h-4 w-4" />
            <p className="text-sm">
              Due: {format(new Date(task.due_date), 'PPP')}
            </p>
          </div>
        </div>
        <Button 
          onClick={handleSaveAll}
          className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Save Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 overflow-x-auto pb-4">
        <div className="hidden md:grid md:grid-cols-7 md:col-span-7 gap-4 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-medium text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>
        
        {days.map((date) => {
          const dayActions = getActionsForDate(date);
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={date.toISOString()}
              className={cn(
                "min-h-[140px] border rounded-xl p-3 relative transition-all duration-200",
                "hover:border-blue-400 hover:shadow-md",
                "bg-white backdrop-blur-sm",
                isToday(date) && "ring-2 ring-blue-500 ring-opacity-50"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">
                  {format(date, 'E')}
                </span>
                <span className={cn(
                  "text-sm font-semibold rounded-full w-7 h-7 flex items-center justify-center",
                  isToday(date) ? "bg-blue-500 text-white" : "text-gray-700"
                )}>
                  {format(date, 'd')}
                </span>
              </div>
              <div className="space-y-2">
                <AnimatePresence>
                  {dayActions.map((action) => (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      key={action.id}
                      className="text-sm bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-2 group relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700 truncate flex-1">
                          {action.title}
                        </span>
                        <button
                          onClick={() => handleDeleteAction(action.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity duration-200"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Clock size={12} className="mr-1" />
                        {action.duration} min
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <button
                  onClick={() => handleDateClick(date)}
                  className="absolute bottom-2 right-2 p-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
                >
                  <Plus size={16} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Add New Action
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-gray-700">Selected Date</Label>
              <div className="flex items-center space-x-2 text-gray-600 bg-gray-50 p-2 rounded-lg">
                <CalendarIcon className="h-4 w-4" />
                <p className="text-sm">
                  {selectedDate && format(selectedDate, 'PPP')}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700">Action Title</Label>
              <Input
                id="title"
                value={newAction.title}
                onChange={(e) => setNewAction({ ...newAction, title: e.target.value })}
                placeholder="Enter action title"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-gray-700">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={newAction.duration}
                onChange={(e) => setNewAction({ ...newAction, duration: parseInt(e.target.value) })}
                min={15}
                max={480}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddAction}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
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