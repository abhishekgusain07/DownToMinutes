"use client";

import { FriendRequestWithUser } from "@/utils/types";
import { useState } from "react";
import { getAllFriendRequests } from "@/utils/data/friend/getAllFriendRequests";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { acceptRequest } from "@/utils/data/friend/acceptRequest";
import { declineRequest } from "@/utils/data/friend/declineRequest";

const RequestPage = () => {
    const {userId} = useAuth()
    const [friendRequests, setFriendRequests] = useState<FriendRequestWithUser[] | null>(null);
    const [requestsLoading, setRequestsLoading] = useState<boolean>(true);
    
    useEffect(() => {
        const fetchRequests = async() => {
            setRequestsLoading(true);
            const requests : (FriendRequestWithUser[]|null) = await getAllFriendRequests(userId!)
            console.log("requests ✅ ", requests)
            setFriendRequests(requests)
            setRequestsLoading(false)
        }
        fetchRequests()
    }, [])
    const acceptFriendRequest = async(requestId: string) => {
        try{
            await acceptRequest({requestId, userId: userId!})
            toast.success("Friend request accepted ✅")
        }catch (error) {
            console.log(error)
            toast.error("Error accepting friend request ‼️")
        }
    }
    const declineFriendRequest = async(requestId: string) => {
        try{
            await declineRequest({requestId, userId: userId!})
            toast.success("Friend request declined ✅")
        }catch (error) {
            console.log(error)
            toast.error("Error declining friend request ❌")
        }
    }
  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Friend Requests</h1>
      {
        requestsLoading ? (
            <Loader2 className="animate-spin size-4" />
        ) : (
            friendRequests && friendRequests.length > 0 ?
            (   
                friendRequests?.map((request) => (
                    <div key={request.id} className="flex items-center justify-around w-[30vw]">
                        <h2>{request.senderData?.first_name} {request.senderData?.last_name}</h2>
                        <div className="flex gap-2">
                            <Button variant="ghost" className="border" onClick={() => acceptFriendRequest(request.id)}>
                                ✅
                            </Button>
                            <Button variant="ghost" className="border" onClick={() => declineFriendRequest(request.id)}>
                                ❌
                            </Button>
                        </div>
                    </div>
                ))
            ):
            (
                <h1 className="text-center">No friend requests</h1>
            )
        )
      }
    </div>
  );
};

export default RequestPage;