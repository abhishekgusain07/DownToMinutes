import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import PlansPage from "./_component/plansPage";

const Plans = async () => {
    const { userId } = await auth();
    if (!userId) {
        redirect("/sign-in");
    }
    return (
        <div className="h-full w-full flex flex-col items-center justify-center mt-4">
            <h1 className="text-3xl font-bold">Plans Page</h1>
            <div className="flex items-center justify-center mt-4">
                <PlansPage />
            </div>
        </div>
    )
}

export default Plans;