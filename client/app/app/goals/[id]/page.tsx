"use client"

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const Goal = () =>{
    const router = useRouter();
    const pathname = usePathname();
    const goalId = pathname.split('/').slice(-1)[0];
    useEffect(() => {
        router.push(`/app/goals/${goalId}/subgoals`);
    }, [])
    return (
        <div className="h-full w-full flex justify-center items-center">
            <Loader2 className="animate-spin size-4" />
        </div>
    )
}

export default Goal
