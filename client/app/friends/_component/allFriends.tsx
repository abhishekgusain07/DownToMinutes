"use client"

import { getAllFriends } from "@/utils/data/friend/getAllFriends";
import { FriendInfo } from "@/utils/types";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

const AllFriends = () => {
    const [friends, setFriends] = useState<FriendInfo[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchFriends = async() => {
            const friends: FriendInfo[] | null = await getAllFriends()
            setFriends(friends)
            setIsLoading(false)
        }
        fetchFriends()
    }, [])
    const redirectToChat = (userId: string) => {
        // Implement your logic here
        console.log("Redirecting to chat with user:", userId);
      }
    return (
        <div className="flex flex-col items-center justify-center">
            <h1>all friends</h1>
            {
                isLoading ? (  
                    <Loader2 className="animate-spin size-4" />
                ) : (
                    friends?.map((friend, index) => (
                        <div key={index}>
                            <div className="flex flex-row items-center justify-center gap-2 hover:bg-zinc-200 cursor-pointer rounded-lg p-3"
                                onClick={() => {
                                    redirectToChat(friend.user_id)
                                }}
                            >
                                <Avatar>
                                    <AvatarImage src={friend.profile_image_url!} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <h1>{friend.first_name} {friend.last_name}</h1>
                            </div>
                        </div>
                    ))
                )
            }
            
        </div>
    )
}
export default AllFriends;