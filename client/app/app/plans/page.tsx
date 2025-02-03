import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import PlansPage from "./_component/plansPage";

const Plans = async () => {
    const { userId } = await auth();
    if (!userId) {
        redirect("/sign-in");
    }
    return (
        <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <PlansPage />
            </div>
        </div>
    )
}

export default Plans;