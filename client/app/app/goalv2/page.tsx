"use client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Goalsv2Page = () => {
    const router = useRouter(); 
    useEffect(() => {
        router.push("/app/goalv2/Subgoals");
    }, [])

    return (
        <Loader2 className="animate-spin size-4" />
    );
};

export default Goalsv2Page;