"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dotted-dialog";
import { Plus } from "lucide-react";
import NewGoal from "../new/page";

const NewGoalDialog = () => {
    const [open, setOpen] = useState<boolean>(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2" onClick={() => setOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Add New Goal
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] w-[90vw] max-h-[90vh] overflow-y-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg">
                <DialogHeader className="space-y-2">
                    <DialogTitle className="text-xl font-semibold">Create New Goal</DialogTitle>
                    <DialogDescription>
                        Add a new goal to track your progress. Fill in the details below.
                    </DialogDescription>
                </DialogHeader>
                <NewGoal onSuccess={() => setOpen(false)}/>
            </DialogContent>
        </Dialog>
    )
}

export default NewGoalDialog;