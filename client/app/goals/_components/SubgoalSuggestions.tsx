"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { X, Plus, Loader2 } from "lucide-react";
import { Subgoal, SubgoalSuggestion } from "@/utils/types";
import { toast } from "sonner";
import { createSubgoal } from "@/utils/data/subgoals/createSubgoal";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface SubgoalSuggestionsProps {
  suggestions: SubgoalSuggestion[];
  isLoading: boolean;
  goalId: string
  onUpdate: (suggestions: SubgoalSuggestion[]) => void;
}

export enum Priority { 
  LOW,
  MEDIUM,
  HIGH
}

export enum Frequency {
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  YEARLY = "YEARLY",
}

const subgoalSchema = z.object({
  subgoals: z.array(z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    frequency: z.nativeEnum(Frequency, { required_error: "Frequency is required" }),
    due_date: z.date({ required_error: "Due date is required" })
  }))
});

type FormData = z.infer<typeof subgoalSchema>;

export default function SubgoalSuggestions({
  suggestions,
  isLoading,
  onUpdate,
  goalId
}: SubgoalSuggestionsProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(subgoalSchema),
    defaultValues: {
      subgoals: suggestions.map(s => ({
        title: s.title || "",
        description: s.description || "",
        frequency: s.frequency || Frequency.MONTHLY,
        due_date: s.due_date || new Date()
      }))
    }
  });

  const [subgoals, setSubgoals] = useState<SubgoalSuggestion[]>(suggestions);

  const handleRemove = (index: number) => {
    const newSubgoals = subgoals.filter((_, i) => i !== index);
    setSubgoals(newSubgoals);
    onUpdate(newSubgoals);
  };

  const router = useRouter()

  const handleAdd = () => {
    const newSubgoal: SubgoalSuggestion = {
      title: "",
      description: "",
      frequency: Frequency.MONTHLY,
    };
    const newSubgoals = [...subgoals, newSubgoal];
    setSubgoals(newSubgoals);
    onUpdate(newSubgoals);
  };

  const handleUpdate = (index: number, field: keyof SubgoalSuggestion, value: any) => {
    const newSubgoals = subgoals.map((subgoal, i) => {
      if (i === index) {
        return { ...subgoal, [field]: value };
      }
      return subgoal;
    });
    setSubgoals(newSubgoals);
    onUpdate(newSubgoals);
  };

  const addSubgoals = async () => {
    try {
      if (subgoals.length === 0) {
        toast.error("Please add at least one subgoal");
        return;
      }

      // Validate subgoals
      const invalidSubgoals = subgoals.filter(
        (subgoal) => !subgoal.title || !subgoal.frequency
      );
      if (invalidSubgoals.length > 0) {
        toast.error("All subgoals must have a title and frequency");
        return;
      }

      await Promise.all(
        subgoals.map(async (subgoal) => {
          try {
            const result: Subgoal = await createSubgoal({
              title: subgoal.title,
              description: subgoal.description || "",
              frequency: subgoal.frequency,
              due_date: subgoal.due_date || new Date(),
              goal_id: goalId,
            });
          } catch (error) {
            console.error(`Error creating subgoal "${subgoal.title}":`, error);
            throw error;
          }
        })
      );

      toast.success("Subgoals added successfully");
      setSubgoals([]); // Clear the subgoals after successful creation
      onUpdate([]); // Update parent component
      router.replace(`/goals/${goalId}`)
    } catch (error: any) {
      console.error("Error adding subgoals:", error);
      toast.error(error.message || "Failed to add subgoals");
    }
  };

  const onSubmit = handleSubmit((data) => {
    addSubgoals();
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4 flex flex-col items-center justify-center">
      <div className="flex w-[50vh] items-center justify-between">
        <h3 className="text-lg font-semibold">Suggested Subgoals</h3>
        <Button onClick={handleAdd} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Subgoal
        </Button>
      </div>
      <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 space-x-5">
        {subgoals.map((subgoal, index) => (
          <Card key={index} className="p-4">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <Controller
                    name={`subgoals.${index}.title`}
                    control={control}
                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                      <div>
                        <Input
                          placeholder="Subgoal title"
                          value={value}
                          onChange={onChange}
                          className={error ? "border-red-500" : ""}
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                      </div>
                    )}
                  />
                  <Controller
                    name={`subgoals.${index}.description`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Textarea
                        placeholder="Description (optional)"
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                  <Controller
                    name={`subgoals.${index}.frequency`}
                    control={control}
                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                      <div>
                        <Select
                          value={value}
                          onValueChange={onChange}
                        >
                          <SelectTrigger className={error ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={Frequency.WEEKLY}>Weekly</SelectItem>
                            <SelectItem value={Frequency.MONTHLY}>Monthly</SelectItem>
                            <SelectItem value={Frequency.QUARTERLY}>Quarterly</SelectItem>
                            <SelectItem value={Frequency.YEARLY}>Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                      </div>
                    )}
                  />
                  <Controller
                    name={`subgoals.${index}.due_date`}
                    control={control}
                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                      <div>
                        <Input
                          type="date"
                          value={value ? value.toISOString().split("T")[0] : ""}
                          onChange={(e) => onChange(new Date(e.target.value))}
                          placeholder="Due date"
                          className={error ? "border-red-500" : ""}
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                      </div>
                    )}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Button onClick={onSubmit} className="mt-4">
        Save Subgoals
      </Button>
    </div>
  );
}
