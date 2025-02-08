"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dotted-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Subgoal, UpdateSubgoalInput } from "@/utils/types";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface UpdateSubgoalProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subgoal: Subgoal;
  onSave: (updates: UpdateSubgoalInput & { progress?: string }) => Promise<void>;
}

export function UpdateSubgoalProgressDialog({
  open,
  onOpenChange,
  subgoal,
  onSave,
}: UpdateSubgoalProgressDialogProps) {
  const [progress, setProgress] = useState("");
  const [dueDate, setDueDate] = useState<Date>(new Date(subgoal.due_date));
  const [active, setActive] = useState(subgoal.active);
  const [completed, setCompleted] = useState(subgoal.completed);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await onSave({
        id: subgoal.id,
        active,
        completed,
        progress,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update subgoal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Subgoal Progress</DialogTitle>
          <DialogDescription>
            Update progress and settings for: {subgoal.title}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="progress">Progress Made</Label>
            <Textarea
              id="progress"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              placeholder="Describe the progress you've made..."
              className="h-24"
            />
          </div>

          <div className="grid gap-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(date) => date && setDueDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Active Status</Label>
              <div className="text-[0.8rem] text-muted-foreground">
                Toggle to put subgoal on hold
              </div>
            </div>
            <Switch
              checked={active}
              onCheckedChange={setActive}
              aria-label="Active status"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Completion Status</Label>
              <div className="text-[0.8rem] text-muted-foreground">
                Mark as completed when done
              </div>
            </div>
            <Switch
              checked={completed}
              onCheckedChange={setCompleted}
              aria-label="Completion status"
            />
          </div>

          <div className="grid gap-2">
            <Label>Current Status</Label>
            <div className="text-sm space-y-1">
              <div className="text-muted-foreground">
                Created: {new Date(subgoal.created_at).toLocaleDateString()}
              </div>
              <div className="text-muted-foreground">
                Last Updated: {new Date(subgoal.updated_at).toLocaleDateString()}
              </div>
              <div className="text-muted-foreground">
                Frequency: {subgoal.frequency}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
