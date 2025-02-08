"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dotted-dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";
import { taskFormSchema, TaskFormValues } from "@/utils/zod/schemas";
import { createTask } from "@/utils/data/task/createTask";
import { subgoalFormSchema, SubgoalFormValues } from "@/utils/zod/schemas";
import { createSubgoal } from "@/utils/data/subgoals/createSubgoal";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2, Plus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface CreateSubgoalDialogProps {
  goalId: string;
  onSubgoalCreated?: () => void;
}

export function CreateNewSubGoalDialog({ goalId, onSubgoalCreated }: CreateSubgoalDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<SubgoalFormValues>({
    resolver: zodResolver(subgoalFormSchema),
    defaultValues: {
      title: "",
      description: "",
      frequency: "WEEKLY",
      due_date: new Date(),
      goal_id: goalId,
    },
  });

  async function onSubmit(data: SubgoalFormValues) {
    setIsSubmitting(true)
    try {
      await createSubgoal(data);
      toast.success("Subgoal created successfully! ✅");
      form.reset();
      setOpen(false);
      onSubgoalCreated?.();
    } catch (error) {
      toast.error("Failed to create subgoal. Please try again. ❌");
      console.error("Error creating subgoal:", error);
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Subgoal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] w-[90vw] max-h-[90vh] overflow-y-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg">
        <DialogHeader>
          <DialogTitle>Create New Subgoal</DialogTitle>
          <DialogDescription>
            Add a new subgoal to track your progress. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter subgoal title" {...field} />
                  </FormControl>
                  <FormDescription>
                    Give your subgoal a clear and concise title
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your subgoal (optional)"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Add details about what you want to achieve
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="WEEKLY">Weekly</SelectItem>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                      <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                      <SelectItem value="YEARLY">Yearly</SelectItem>
                      <SelectItem value="ONE_TIME">One Time</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How often do you want to track this subgoal?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        field.onChange(date);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    When does this task need to be completed?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />    

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Subgoal"}
              {
                isSubmitting && (
                  <Loader2 className="ml-2 h-4 w-4 animate-spin"/>
                )
              }
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
