import { fetchUserGoals } from "@/utils/data/user/fetchUserGoals";
import { Goal, Priority } from "@/utils/types";
import { currentUser } from "@clerk/nextjs/server";

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
                        <div>
                            something
                        </div>
                    ))
                )
            }
        </div>
    )
}

export default Goals;