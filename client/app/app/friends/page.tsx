"use client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const FriendsPage = () => {
    const router = useRouter(); 
    useEffect(() => {
        router.push("/app/friends/friend-requests");
    }, [])

    return (
        <Loader2 className="animate-spin size-4" />
    );
};

export default FriendsPage;