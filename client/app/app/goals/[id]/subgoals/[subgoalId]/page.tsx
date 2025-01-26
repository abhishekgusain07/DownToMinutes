import PageHeaders from "@/app/app/_componenets/PageHeaders";
import AllTasksOfSubgoal from "../../../_components/AllTaskOfSubgoal";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import  Link from "next/link"

const SingleSubgoalPage = async (
    { params }: { params: Promise<{ id: string, subgoalId: string }> }
) => {
    const subgoalId = (await params).subgoalId;
    const goalId = (await params).id;
    return (
        <div className="max-w-8xl mx-auto">
            <PageHeaders>
                <div className="flex gap-1">
                    <Link href={`/app/goals/${goalId}`}>
                        <Button variant="ghost" size="icon" className="hover:bg-grey-600">
                            <ChevronLeft className="size-6" />
                            <span className="sr-only">Back</span>
                        </Button>
                    </Link>
                </div>
            </PageHeaders>
            <div className="min-h-screen min-w-screen p-5 m-5">
                <AllTasksOfSubgoal subgoalId={subgoalId} goalId={goalId}/>
            </div>
            
        </div>
    )
}
export default SingleSubgoalPage;