"use client";

import React, { useEffect, useState } from 'react';
import { Task } from '@/utils/types';
import { getTaskById } from '@/utils/data/task/getTaskById';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format, eachDayOfInterval, startOfToday, isSameDay, addDays } from 'date-fns';
import { Plus, X } from 'lucide-react';

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
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Action Plan</h2>
          <p className="text-gray-600">
            Due date: {format(new Date(task.due_date), 'PPP')}
          </p>
        </div>
        <Button onClick={handleSaveAll} className="bg-blue-600 hover:bg-blue-700">
          Save Plan
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-semibold py-2">
            {day}
          </div>
        ))}
        
        {days.map((date) => {
          const dayActions = getActionsForDate(date);
          return (
            <div
              key={date.toISOString()}
              className="min-h-[120px] border rounded-lg p-2 relative hover:border-blue-500 transition-colors"
            >
              <div className="text-right text-sm text-gray-500 mb-2">
                {format(date, 'd')}
              </div>
              <div className="space-y-2">
                {dayActions.map((action) => (
                  <div
                    key={action.id}
                    className="text-sm bg-blue-100 rounded p-1 flex justify-between items-center"
                  >
                    <span className="truncate">{action.title}</span>
                    <button
                      onClick={() => handleDeleteAction(action.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => handleDateClick(date)}
                  className="absolute bottom-2 right-2 text-blue-600 hover:text-blue-800"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Action</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <p className="text-sm text-gray-600">
                {selectedDate && format(selectedDate, 'PPP')}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Action Title</Label>
              <Input
                id="title"
                value={newAction.title}
                onChange={(e) => setNewAction({ ...newAction, title: e.target.value })}
                placeholder="Enter action title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={newAction.duration}
                onChange={(e) => setNewAction({ ...newAction, duration: parseInt(e.target.value) })}
                min={15}
                max={480}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAction}>
              Add Action
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarView;