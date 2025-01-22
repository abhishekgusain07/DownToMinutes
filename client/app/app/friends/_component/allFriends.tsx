"use client"

import { getAllFriends } from "@/utils/data/friend/getAllFriends";
import { FriendInfo } from "@/utils/types";
import { useEffect, useState } from "react";
import { Loader2, ToggleLeft, ToggleRight } from "lucide-react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
  
import { Switch } from "@/components/ui/switch";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const AllFriends = () => {
    const [friends, setFriends] = useState<FriendInfo[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const {userId} = useAuth();
    const router = useRouter();
    useEffect(() => {
        const fetchFriends = async() => {
            const friends: FriendInfo[] | null = await getAllFriends()
            setFriends(friends)
            setIsLoading(false)
        }
        fetchFriends()
    }, [])
    const createConversation = useMutation(api.chat.createOrGetConversation);
    const redirectToChat = async(friendUserId: string) => {
        const conversationId = await createConversation({
            participantUserId: userId!,
            currentUserId: friendUserId
        })
        router.replace(`/friends/chat/${conversationId}`);
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
                            <div className="flex flex-row items-center justify-center gap-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 cursor-pointer rounded-lg p-3  border-2 border-gray-200 dark:border-zinc-700"
                                onClick={() => {
                                    redirectToChat(friend.user_id)
                                }}
                            >
                                <Avatar>
                                    <AvatarImage src={friend.profile_image_url!} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <h1>{friend.first_name} {friend.last_name}</h1>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild><Switch /></TooltipTrigger>
                                        <TooltipContent>
                                        <p>If on, your friend will be able to see your activity and will get notifications about your activity</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>         
                            </div>

                        </div>
                    ))
                )
            }
            
        </div>
    )
}
export default AllFriends;