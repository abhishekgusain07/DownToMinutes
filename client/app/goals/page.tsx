import { Button } from "@/components/ui/button";
import { fetchUserGoals } from "@/utils/data/user/fetchUserGoals";
import { Goal, Priority } from "@/utils/types";
import { SignOutButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

const Goals = async() => {
    const user = await currentUser()
    if(!user){

    }
    const goals:(Goal[]|null) = await fetchUserGoals({userId: user?.id!});
    return (
        <div>
            Goals
            <h1>{user?.id}</h1>
            {
                goals === null ? (
                    <h1>No goals currently</h1>
                ) : (
                    goals.map((goal) => (
                        <div key={goal.id}>
                            {goal.title}
                        </div>
                    ))
                )
            }
            <Button variant="ghost" asChild>
                <Link href="/goals/new">
                    add goal
                </Link>
            </Button>
            
        </div>
    )
}

export default Goals;