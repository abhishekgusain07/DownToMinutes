"use client";

import { Subgoal, UpdateSubgoalInput } from "@/utils/types";
import { Check, Pause, XCircle } from "lucide-react";
import { useState } from "react";
import { UpdateSubgoalProgressDialog } from "./UpdateSubgoalProgressDialog";

interface SubgoalCardProps {
  subgoal: Subgoal;
  goalId: string;
}

export function SubgoalCard({ subgoal, goalId }: SubgoalCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSaveProgress = async (updates: UpdateSubgoalInput & { progress?: string }) => {
    // TODO: Implement the API call to save progress and updates
    console.log("Saving updates:", { goalId, ...updates });
  };

  const getStatusIcon = () => {
    if (!subgoal.active) return <Pause className="h-4 w-4 text-yellow-500" />;
    if (subgoal.completed) return <Check className="h-4 w-4 text-green-500" />;
    return <Check className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <>
      <div
        className="bg-card p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setDialogOpen(true)}
      >
        <h3 className="font-medium">{subgoal.title}</h3>
        <p className="text-sm text-muted-foreground">{subgoal.description}</p>
        <div className="mt-2">
          <p className="text-xs text-muted-foreground">
            Due: {new Date(subgoal.due_date).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            status: {subgoal.completed ? "Completed" : subgoal.active ? "Active" : "On Hold"}{" "}
            {getStatusIcon()}
          </p>
        </div>
      </div>

      <UpdateSubgoalProgressDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        subgoal={subgoal}
        onSave={handleSaveProgress}
      />
    </>
  );
}
