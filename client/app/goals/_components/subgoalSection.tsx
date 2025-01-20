"use client"

import { Button } from "@/components/ui/button"
import { generateSubgoalSuggestions } from "@/utils/ai/generateSubgoals"
import { SubgoalSuggestion } from "@/utils/types"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import SubgoalSuggestions from "./SubgoalSuggestions"

interface SubgoalDisplayProps {
    goalId: string
}

const SubgoalsDisplay = ({
    goalId
}:SubgoalDisplayProps) => {
    const [subgoalsSuggestions, setSubgoalsSuggestions] = useState<SubgoalSuggestion[]>([])
    const [subgoalsLoading, setSubgoalsLoading] = useState<boolean>(false)

    const generateSubogoalsOfGoal = async () => {
        try {
            setSubgoalsLoading(true)
            const subgoals = await generateSubgoalSuggestions({goalId: goalId})
            setSubgoalsSuggestions(subgoals)
        }catch (error) {
            console.log(error)
        }finally {
            setSubgoalsLoading(false)
        }
    }
    return (
        <div className="mt-5 flex flex-col items-center justify-center">
            <div className="flex items-center justify-between mb-6">
                <Button 
                    variant="outline" 
                    onClick={generateSubogoalsOfGoal}
                    disabled={subgoalsLoading}
                    >
                        {subgoalsLoading ? "Generating..." : "Generate Subgoals"}
                        {subgoalsLoading ? <Loader2 className="animate-spin size-4" /> : null}
                </Button>
            </div>
            <div className="mt-4 p-4">
                {
                    subgoalsSuggestions && subgoalsSuggestions.length > 0 ? (
                        <SubgoalSuggestions suggestions={subgoalsSuggestions} isLoading={subgoalsLoading} onUpdate={setSubgoalsSuggestions} goalId={goalId} />
                    ) : null
                }
            </div>
        </div>
    )
}

export default SubgoalsDisplay